---
title: 'The Timezone Turbulence'
subtitle: "A Programmer's guide to Timekeeping"
date: '2025-03-30'
peek: 'In programming, the one thing you would either never come across (if everything goes well) or learn pretty much the hard way is handling Timezones and date calculations.'
---

![images/timezones](/images/timezones.png)

_Time is an illusion. Lunchtime doubly so._ <br/>
_-Douglas Adams, the Hitchhiker’s guide to the Galaxy._

In programming, the one thing you would either never come across (if everything goes well) or learn pretty much the hard way is handling Timezones and date calculations. A newly elected government in some country might suddenly announce that they are turning the clock ahead by 1 hour, and all your cron-jobs, automations, transactions, data reports could go haywire if things are not handled carefully. Let me break this to you, it’s not even a hypothetical situation. In 2013, Libya had announced that they were no longer going to turn the clock back after DST with only a few days notice. In 2019, Brazil announced that they were discontinuing DST altogether and stick to the original time. AND TO TOP  IT ALL, there’s a concept of a *Leap Second* which basically is an additional second added to the clock to cope up with the irregularities in the Earth’s rotation. In this article, I will share some good practices that you can follow that could save you from this nightmare.

![images/timezones](/images/dst.png)

But first, a little history of the inception of Timezones.

### Getting things around

Before the late 1800s, individual towns commonly set their own local time, which residents adjusted their watches or clocks to match. As a result, traveling between towns often required resetting one’s watch upon arrival. Around the world, many clock towers were built to keep track of the local time.

Italian mathematician Quirico Filopanti proposed a global system of time zones. He suggested dividing the world into 24 hourly time zones, which he referred to as "longitudinal days," with the first centered on the meridian of Rome. In 1900s, almost all places on Earth adopted a standard time zone, but only some of them used an hourly offset from GMT. Many applied the time at a local astronomical observatory to an entire country, without any reference to GMT. It took many decades before all time zones were based on some standard offset from GMT or Coordinated Universal Time (UTC)

### The Dawn of the Time

![images/timezones](/images/dk.png)

In the late 1960s, Ken Thompson and Dennis Ritchie at Bell Labs were working on a new operating system that later came to be about as Unix. One of the challenges they faced was creating a simple and efficient way to represent time within the system. The team decided to count the number of seconds that had passed since January 1, 1970, 00:00:00 UTC. This moment, known as the Unix epoch, became the foundation for Unix time, which computers use for date arithmetic.

### Timekeeping in programming

Now that we know the foundational information, here are some things I learned about keeping up with the time in programming.

- Do not, I repeat, DO NOT try to maintain timezone offsets on your own. Do not reinvent the wheel. Use IANAtimezones, also known as the tz database. It contains the code and data that represent the history of local time for many representative locations around the globe. It is updated periodically to reflect changes made by political bodies to time zone boundaries, UTC/GMT offsets, and Daylight-Saving rules.
- Make sure you are using the latest IANATimezones if you’re storing it locally.
- Always store timestamps in UTC in your database. This provides a consistent reference point and handles edge cases like leap seconds. Only convert to local timezones when displaying times to users. Any date/time calculations should be performed in UTC to avoid timezone-related bugs.
- Maintain a clearly defined and documented list of supported timezones in your application. This ensures that if a timezone gets deprecated, users can be easily migrated to an alternative and ensure ****users are properly informed if such a migration occurs.

Over the past couple of years, one important thing I have learnt is that building software products that users love has a lot more dimensions than a software developer might think. The realisation and a deep understanding of these dimensions perhaps sets apart a good _Product Engineer_ from a Software Engineer.