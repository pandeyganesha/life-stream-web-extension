12 Aug 2026 | 10:18
I came to know that when a url is matched, firefox would inject the website page with my content_scripts.
Each tab would get its own content_scripts. Hence they should not be used to maintain states as their lifecycle ends with the tab.

So we need background script, which runs on browser level and can be shared by other content_scripts. It persists its session across tab creation and deleteion.

Hence each content_scipts should send data to this script to maintain the state and it can finally save the data into database as well.

---
Another things I got to know is to look at Page > Inspect > console for content_scripts logs.
But for background.js, i need to go to `about:debugging` page > this firefox > inspect > console

Logs for both will be visible on different places.

---

We don't actually need content_scripts as background.js can access browser level events like tab changed and browser went out of focus events. And that is all we need right now, although later, we might need content_scripts if we want to look inside the content of the tab. For now `background.js` will suffice.

---

I just realised that I do not need to store start_time and end_time for each tab. I can simply store start_time for each tab. Start Time for next tab is the end time of last tab.
The only extra case I need to handle when it is not true is that when the broswer itself goes out of foucs ( like if I switch to VLC ), in that case, start time for next tab is not the end time for last tab. So we can also know when the browser itself goes out of scope and we store that info as well.
So, when broswer goes our of scope, that time is the end time for the last tab.

But the problem I am facing right now is to choose correct data structure to store all this info.
We should first define the operations I want to perform on my data strucutre, then We will choose which structure is best suited for them.

- Histroy replay. I would ( might ) want to know which tab was opened when and then next and so on.
- Time spent website wise. I must easily get time spent on each website.
- I must be able to order them time wise i.e, most time spent website or least.

The first data struct that came in mind for first use case is a simple list of tuple. Ex:
[
    ("youtube.com", <time-stamp>),
    ("github.com", <time-stamp>),
    ("youtube.com", <time-stamp>),
    ...
]

But it is not allowing me to easily find how much time I have spent on "youtube.com".
Hence for second and third requirement we can either have another Map that simultanelously keep track of time spent website wise.

But first we must try to compose our strucuture that can handle both requirement instead of having two different structures, if we fail, we use this method.

