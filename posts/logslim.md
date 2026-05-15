---
title: 'How I’m building a better way to understand and store legacy logs'
subtitle: 'A Deep Dive into the ideation and the architecture of Logslim'
date: '2026-05-15'
peek: 'Logslim is a log ingestion tool that runs the Drain log-parsing algorithm, separates repeating log templates from their variable parameters, and stores everything in compressed Parquet via DuckDB.'
---

![images/logslim](/images/chaos_to_structure.png)

In my first semester at Purdue, I took CS540 Database Systems to study database systems in depth. At its core, database design is about organizing data around a system’s access patterns whether it is optimizing for reads or writes, transactional workloads (OLTP), analytical workloads (OLAP), point lookups, scans, or some hybrid of the two. That got me thinking about data almost every distributed system produces continuously. Application logs sat awkwardly across every category; they are append-heavy like event streams, semi-structured like documents, queried analytically like OLAP systems, or using text search. 

Another problem that got my attention is the rising cost of log storage. In microservice architecture, log storage cost quietly eats budget. You look at the bill, then look at what you're storing, and realize most of it is the same 15 patterns firing millions of times. The timestamp changes. The user ID changes. The rest of the line is identical. The motivation for optimizing for both access and storage cost led me to build Logslim. 

Logslim is a log ingestion tool that runs the Drain log-parsing algorithm, separates repeating log templates from their variable parameters, and stores everything in compressed Parquet via DuckDB. LogSlim turns logs from immutable text streams into a structured event store with reconstructable templates and queryable parameters. Detect anomalies, understand system behavior, and spot noisy log patterns, and save storage cost, all from the templates alone! Compression runs at 76–81% on real workloads, with every line reconstructable, byte-for-byte.

For teams paying significant Elasticsearch or S3 bills for log storage, 80% compression with full queryability and zero-loss reconstruction is a meaningful win. The Drain algorithm does the heavy lifting; everything else is plumbing to make it usable.

This post walks through how it all works. 

---
## Core idea

Take a typical application log:

```
2024-01-15T10:23:45Z DEBUG 1234 DB SELECT table=sessions 5 rows 12ms
2024-01-15T10:23:46Z DEBUG 5678 DB SELECT table=sessions 2 rows 8ms
2024-01-15T10:23:47Z DEBUG 9999 DB SELECT table=sessions 14 rows 31ms
```

Three seemingly unique strings, but there's really just one template and three sets of parameters:

```
Template: "{ts} DEBUG {num} DB SELECT table=sessions {rows} {duration}"

Parameters: 

["2024-01-15T10:23:45Z", "1234", "5 rows", "12ms"]
["2024-01-15T10:23:46Z", "5678", "2 rows", "8ms"]
["2024-01-15T10:23:47Z", "9999", "14 rows", "31ms"]
```

Extract the template, store it only once, and store the parameters separately. DuckDB's columnar `zstd` compression takes care of the rest. But how do you extract templates from the logs? 

One way is to use regex, which is essentially what I started off with. I asked Claude to write a regex for me to extract log levels, messages and timestamps. But this went quickly out of hand since logs are largely unstructured. Regex was a good idea to start with the MVP, but getting the one-size-fits-all regex is practically impossible. 


---
## Drain Algorithm

[Drain](https://logparser.readthedocs.io/en/latest/tools/Drain.html) is a streaming log parser that groups log lines into clusters without requiring any regex configuration. The workflow is divided into two major steps.

### Step 1: Tokenize

Every incoming line gets split into tokens. `LogTokenizer` handles this with whitespace-split, but the tokenizer is also aware of multi-word structures like quoted strings and certain compound values.

Once you have tokens, `TokenClassifier` labels each one:

| Token | Type |
|---|---|
| `2024-01-15T10:23:45Z` | `TIMESTAMP` |
| `12ms` | `NUM` (numeric-ish) |
| `550e8400-e29b-41d4-a716-446655440000` | `UUID` |
| `d41d8cd98f00b204e9800998ecf8427e` | `HASH` |
| `192.168.1.1` | `IP` |
| `SELECT` | `WORD` (static) |

![images/logslim](/images/drain.png)

The `WORD` tokens are potentially static. TokenClassifier has a regex for obvious variables, such as timestamps, UUIDs, IPs, hashes etc. These get replaced with placeholders like {ts} or {uuid} upfront. It is called _pre-masking_. Application-specific tokens like `req-755556` don't get this treatment. They have to go through the _drain-tree_ before they are marked as wildcards. 

### Step 2: Drain Tree

Every incoming log line finds its place in the Drain Tree using two keys: how many tokens it has, and what its first non-wildcard word is.

```bash
Root
├── length=6
│   ├── "User" → [cluster: "User {num} logged in from {ip}"]
│   └── "DB"   → [cluster: "DB {num} SELECT table={word}"]
└── length=8
    └── "Cache" → [cluster: "Cache {num} hit for key {uuid}"]
```

When a new line arrives, it walks this tree to find the closest existing cluster. Closeness is measured by how many static tokens match. A line that agrees on 4 out of 6 tokens scores higher than one that agrees on 2.

If the best match scores above `sim-threshold` (default 50%), the line merges into that cluster. Any position where the line disagrees with the cluster becomes a wildcard. If nothing scores high enough, a new cluster starts.

At this point, a cluster is a _candidate_ and not a template yet. Only after `lockAfterN` hits (default: 10) does it get committed to the database as a permanent template. Before that, lines go into `raw_logs` whole. Drain doesn't need to see every log line to learn a template. After seeing two lines that differ only in a few positions, it has enough signal to generalize. Once a cluster is seen
`lockAfterN` times, it locks the pattern and commits that as a `Template` to the database.


---
## Storage Model

Logslim persists data across three logical layers: 
- raw ingestion, 
- structural templates,
- compact reconstructed entries

During Drain’s initial learning phase, unmatched logs are temporarily stored verbatim in `raw_logs` so no information is lost while templates stabilize. Once patterns are learned, each distinct structure is stored exactly once in `templates`, along with occurrence metadata, while individual log events in `log_entries` reference the template ID and persist only the variable parameters plus timestamp metadata. Timestamps are stored as epoch millisecond `BIGINT`s instead of ISO strings to improve columnar compression efficiency in DuckDB and reduce per-row overhead at scale. Parameters are stored as ordered JSON arrays instead of key-value maps because the template already defines what each position represents. This keeps serialization simpler and reduces storage overhead. Multi-line payloads such as JVM stack traces are attached separately as raw continuation blobs. This allows Logslim to reconstruct original logs.

---
## Compaction

Compaction moves `templates`, `log_entries`, and `raw_logs` out of the main DuckDB file into compressed Parquet archives, then replaces the original tables with `UNION ALL` views that combine archived data with fresh writable tables. Compression improves further as template repetition increases, since repeated structures allow DuckDB’s columnar encoding to become even more efficient.

After compacting the db, getting the queries working was non-trivial. Once the db is compacted, the base table names (`templates`, `log_entries`) are no longer tables but only views. All query commands go through these views. DuckDB pushes predicates into the Parquet scan. Time-range queries on `log_timestamp` are fast because Parquet row groups carry min/max statistics per column.


The `WriteTarget` component handles the write-side of this:

```java
public String tableFor(String base) {
	return isCompacted() ? base + "_live" : base;
}

```
  
It checks `information_schema.tables` once to see if any of the core table names are views. If they are views, it means compaction has been done. It caches this information, and routes all INSERTs to `_live` tables after that.
This means ingestion can continue uninterrupted after compaction. New lines go into `templates_live` and `log_entries_live`, which the unified views include automatically.


---
## Continuous Ingestion from Kafka

For real-time log ingestion, `logslim consume` subscribes to a Kafka topic and runs indefinitely:

```bash
logslim consume \
--topic app-logs \
--bootstrap-servers kafka-broker:9092 \
--group-id logslim-prod \
--batch-size 5000 \
--flush-interval PT5S \
--compact-interval PT10M
```


A few implementation choices here that matter:

**Single-threaded.** Poll, write, and compact share one thread. DuckDB has a one-writer-per-process constraint. Attempting to write from multiple threads causes contention. Running single-threaded avoids this entirely and keeps the code simple, however, comes with a throughput cost.

**At-least-once delivery.** Kafka offsets are committed only after a batch is successfully written. If the JVM crashes mid-batch, the next run re-reads from the last committed offset and re-processes those lines. 

**Periodic compaction.** The `--compact-interval` flag triggers an in-process compaction cycle. This keeps the live DuckDB file small, which matters because DuckDB WAL growth is proportional to uncompacted write volume.

**Graceful shutdown.** `SIGINT` triggers a shutdown hook: flush the in-flight batch, commit offsets, run one final compact, then exit. This prevents the system from dealing with data loss or half-written state.
  

---
## Reconstruction: Getting Back to Byte-Exact

Reconstruction is straightforward in the normal case. Given a template pattern and a parameter array:
  
1. Scan the pattern for `{slot_name}` placeholders.
2. Substitute each placeholder with the next value from the array.
3. Append `continuation_text` if present.

The reconstruction is done by `LogReconstructor`.
  
The tricky case is duplicate slot types. `TemplateNormalizer` assigns indexed names like `num`, `num_1`, `num_2`  during template creation. `LogReconstructor` matches them in order. 

Multiline entries are handled by storing the non-first-line content in `continuation_text` as a raw blob which DuckDB's zstd compression handles well enough.

---

Compression is by no way the only intention of Logslim. You don't need Logslim just to store logs in compressed Parquet. There are other methods, such as filesystem compression, to optimize log storage. Logslim instead focuses on extracting structure from repetitive, unstructured logs by converting them into reusable templates and parameterized events. This makes legacy logs easier to query, cluster, analyze, and reason about without requiring teams to first migrate to structured logging frameworks like OpenTelemetry. 

Once logs become template-aware, debugging improves because repeated noise collapses into identifiable patterns. Anomaly detection becomes easier because rare or previously unseen templates stand out immediately. The overall log hygiene improves because engineers can reason about systems at the level of events rather than raw text streams.

The code is at [github.com/mihirrd/logslim](https://github.com/mihirrd/logslim). Pull requests welcome — but open an issue first for large changes.