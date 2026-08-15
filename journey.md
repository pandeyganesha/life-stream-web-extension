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

Actually the `replay` feature is something that we won't use much often, hence it can be slower, but how much time I have spent where is something that I will need moer often, hence it must be fast.

---
I have figured two ways to store our data.

$$
\forall t \in T:\quad
S_t = \left[(s_i, e_i, p_i)\right]_{i=0}^{k_t-1}
$$

Where:

- $T$ = set of all tabs
- $t$ = index of a tab in $T$
- $S_t$ = list of sessions belonging to tab $t$
- $s_i$ = start timestamp of session $i$
- $e_i$ = end timestamp of session $i$
- $p_i$ = pointer to the next session
- $i$ = index of a session within $S_t$
- $k_t$ = number of sessions in $S_t$

Each pointer is a pair:

$$
p_i = (t', j)
$$

where:

- $t'$ = index of the tab containing the next session
- $j$ = index of that session within $S_{t'}$

### Example

Suppose:

$$
T = \{0,1,2\}
$$

and:

$$
S_0 =
[
(10{:}00, 10{:}05, (1,0)),
(10{:}10, 10{:}15, (2,0))
]
$$

The first session of tab $0$ points to:

$$
(1,0)
$$

meaning:

> Go to tab $1$, session $0$.

Therefore, the history can be reconstructed by following these pointers:

$$
(0,0)
\rightarrow
(1,0)
\rightarrow
(2,0)
\rightarrow \cdots
$$

This effectively forms a **linked history**, where each session points to the session that became active next.

- We can easily create history and we can easily compute time spent by iterating over the list of the tab only, which wont be too long in one day for a modern processor to compute. Also later we might add caching system.

Another model was improvisation of this model, but Then i started to re-evaluate my need to create history for now. I might need it in future, might not. Should I not just implement what I want for now?
Will it be too tough to change it later when I need? I don't think so, as it is already too simple, nothing too complicated.
We surely have a way to implement history as shown above, but is it worth it? Will I be really using that?

Or even development wise, should I not first have working prototype and then improve upon it? Also it is small personal project, hence too much planning is also not needed it seems to me.

Hence let me first simply start with simple map where we don't store history and only time spent for each website.

---
15 Aug 2026 | 16:02

One lesson I got today is, that we should try to avoid writing code around the buisness logic. Instead the code should (or must, idk ) be written around the data-structures and the Data Strucutres should be created around the Buisness Logic.

In our case, when I wrote methods like update_time_spent_for_site, it was directly operating with things like active_site, previous_site and their time stamps.
Then I added more listeners on window change event and had to change the code and it all became a mess. Same vars being changed by different entities at different times.

Hence I refactored the code and create a new Data Structure that stores all the data I want, and the functions I am now writing are just stratifying the data from the strucutre and presenting/modifying however I want.
