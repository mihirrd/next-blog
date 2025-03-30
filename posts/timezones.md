---
title: 'The Timezone Turbulence'
subtitle: "A Programmer's guide to Timekeeping"
date: '2025-03-30'
peek: 'In programming, the one thing you would either never come across (if everything goes well) or learn pretty much the hard way is handling Timezones and date calculations.'
---

![images/timezones](/images/timezones.png)

_Time is an illusion. Lunchtime doubly so._ <br/>
_- Douglas Adams, The Hitchhiker’s guide to The Galaxy._

In programming, the one thing you would either never come across (if everything goes well) or learn pretty much the hard way is handling Timezones and date calculations. A newly elected government in some country might suddenly announce that they are turning the clock ahead by 1 hour, and all your cron-jobs, automations, transactions, data reports could go haywire if things are not handled carefully. Let me break this to you, it’s not even a hypothetical situation. In 2013, Libya had announced that they were no longer going to turn the clock back after DST with only a few days notice. In 2019, Brazil announced that they were discontinuing DST altogether and stick to the original time. AND TO TOP  IT ALL, there’s a concept of a _Leap Second_ which basically is an additional second added to the clock to cope up with the irregularities in the Earth’s rotation.

Software internationalization means dealing with all sorts of timezone craziness in your code. In this article, I will share some good practices that you can follow that could save you from this nightmare.

![images/timezones](/images/dst.png)

But first, a little history of the inception of Timezones.

### Getting things around

Before the late 1800s, individual towns commonly set their own local time, which residents adjusted their watches or clocks to match. As a result, traveling between towns often required resetting one’s watch upon arrival. Around the world, many clock towers were built to keep track of the local time.

Italian mathematician Quirico Filopanti proposed a global system of time zones. He suggested dividing the world into 24 hourly time zones, which he referred to as "longitudinal days," with the first centered on the meridian of Rome. In 1900s, almost all places on Earth adopted a standard time zone, but only some of them used an hourly offset from GMT. Many applied the time at a local astronomical observatory to an entire country, without any reference to GMT. It took many decades before all time zones were based on some standard offset from GMT or Coordinated Universal Time (UTC)

### The Dawn of the Time

![images/timezones](/images/dk.png)

In the late 1960s, When Ken Thompson and Dennis Ritchie at Bell Labs were working on Unix, one of the challenges they faced was creating a simple and efficient way to represent time within the system. The team decided to count the number of seconds that had passed since January 1, 1970, 00:00:00 UTC. This moment, known as the Unix epoch, became the foundation for Unix time, which computers use for date arithmetic.

### Timekeeping in programming

Now that we know the foundational information, here are some things I learned about keeping up with the time in programming.

- Do not, I repeat, DO NOT try to maintain timezone offsets on your own. Do not reinvent the wheel. Use IANAtimezones, also known as the tz database. It contains the code and data that represent the history of local time for many representative locations around the globe. It is updated periodically to reflect changes made by political bodies to time zone boundaries, UTC/GMT offsets, and Daylight-Saving rules. Utilize APIs that use the latest IANATimezones by default.
- Be careful with timezone abbreviations in code as they're not standardized globally. For example, "EST" could mean Eastern Standard Time in the US or Eastern Standard Time in Australia. Always use full IANA timezone identifiers in your code (e.g., "America/New_York" rather than "EST").
- Always store timestamps in UTC in your database. This provides a consistent reference point and handles edge cases like leap seconds. Only convert to local timezones when displaying times to users. Any date/time calculations must be performed in UTC.
- For distributed systems, ensure all services and databases use the same timezone (UTC) to prevent synchronization issues when data moves between services.
- Consider cultural differences in date/time formatting. Some regions use DD/MM/YYYY while others use MM/DD/YYYY. Support internationalization standards for displaying dates and times.
- Maintain a clearly defined and documented list of supported timezones in your application. This ensures that if a timezone gets deprecated, users can be easily migrated to an alternative. Ensure users are properly informed if such a migration occurs.


Over the past couple of years, one important thing I have learnt is that building software products that users love has a lot more dimensions than a software developer might think. The realisation and a deep understanding of these dimensions perhaps sets apart a good _Product Engineer_ from a Software Engineer.