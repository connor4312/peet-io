---
title: 'inteviewing for vs code'
date: '2021-02-06'
---

I've had a few people ask me what the interview process was like at VS Code, and it is unique among 'interviews' I've done before, so here it is.

## A first chat

After sending an introductory email to Kai--the VS Code team lead in Redmond (the other half of our team is in Zurich)--I set up a time to talk in person. Ah, the memories of the Before Times. It's been a year and a half now and I don't remember specifics, but I recall it being an intimidating experience.

I love the direct communication style at VS Code. But my former product had a thick gilding of what my former manager called "social dynamics" (I called it politics), and I was not accustomed to hard questions being stated outright.

For example, another [amazing member](https://twitter.com/aechdub) of my former team had reached out as well, and one of the questions Kai asked us both was, given that he had the choice between the two of us, whom should he choose to hire? This was a good question and something that needed to be answered explicitly or implicitly, but it caught me off guard at the time.

## It's not an interview

The next phase was the Audition Project. VS Code doesn't do your standard 'interview with 6 people for an hour each'. Instead, a candidate spends two days working on one or more features or bugs in VS Code, alongside the area owner. These are mapped out ahead of time and we try to estimate two days of work, but this is rough of course.

My project was working with [Rob](https://twitter.com/roblourens) on the [VS Code Remote SSH](https://code.visualstudio.com/docs/remote/remote-overview) extension. The initial set of tasks I was given were:

- A small tweak to make SSH easier to test locally
- Fixed SSH being fragile/not working depending on the default terminal size
- Set default forwarded ports when opening a remote workspace
- Reopen forwarded ports if SSH reconnects

I finished these tasks on the first day, which I somehow managed to do without a solid mental model of how the VS Code remote extensions worked. Although remote is now something I use literally every day both for work and personal projects, I hadn't used it before and was in new waters.

Something I noticed while building and testing these was that the Remote SSH extension only connected to predefined hosts in your `ssh_config` file. This makes sense (they have to be stored somewhere, may as well store them somewhere standard) but it was awkward to me as someone who was used to typing ssh commands and didn't know how all my options mapped to the `ssh_config` file.

So on my second day, I added a `Add New SSH Host` command, which lets you specify your `ssh` command, then maps out all the options and saves it to your `ssh_config` file automatically. You can run this in VS Code today:

![Image of the input for "Add New SSH Host" command. The input box has a placeholder reading "ssh hello@microsoft.com -A"](/blog/0002/command.png)

I never asked, but I think the initiative for this feature was a big point in my favor. The VS Code team has an incredibly high degree of autonomy and values 'self-starters'. The development of the product is driven by the team. For example, we invested time in [JavaScript profiling](https://code.visualstudio.com/updates/v1_45#_new-javascript-debugger) because I made a case for it, and right now we are forming the 2021 roadmap based on suggestions and discussions with every team member.

## Thoughts on Auditions

It's widely known that the standard technical interview is a poor determinant of job performance and exercises a set of skills which are usually irrelevant (or, at least, of little import) to most software engineering positions. The audition project is a good alternative in that regard: you're doing the work you would _actually_ be doing on the team.

The downside is that it is, in a sense, less equitable. I am fortunate to have already had a good job where I could take two days off (which are repaid if you join the team) and do the project. Others might not be so lucky, especially if they are not currently in a coddled software engineer role.

On the other hand, day-long technical interviews are standard at most tech companies, and you generally only reach those after doing a couple hours of phone interviews or homework ahead of time. For instance in my job search, Zillow was a phone screen then all day interviews and Github was two third of a day with ~4 hours of homework/interview beforehand. And if you interview for two positions, then that's more than two days of time. So, while it's in one chunk, the total hours contributed is comparable to other positions.

Balancing that, you get to show off your real skillset--not how many hours you can grind LeetCode--and you get to see if the work and processes at VS Code are a good fit for you. If the job doesn't turn out to be something you enjoy, the audition project saves 'wasting' potentially weeks or months doing something you don't like.

It is a commitment, but I have yet to go through an interview process which I felt was more fair.

## (There are Actually Interviews)

Okay, sorry to bury the lead on this, but there is an interview component: on the second day, several team members chat with the candidate. These aren't your 'invert a binary tree': for me, they were fairly casual discussions about my work, background, why I wanted to join the team, and so on. I don't remember particulars on what we talked about. I do know that I asked each person what the best and worst part of working at VS Code was, and they struggled to answer the 'worst part'. A year and a half in, I'm in the same boat.

My interview with [SteVen](https://twitter.com/monekoluv/) was over a ping-pong table. I won, therefore I got the job :)

The point is, if you're interested in joining the team, don't stress about this part.

## That was That

The week after I completed the audition project, I got an email from Kai indicating they would like me to join the team. A month or two later, I did so.
