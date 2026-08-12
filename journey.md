12 Aug 2026 | 10:18
I came to know that when a url is matched, firefox would inject the website page with my content_scripts.
Each tab would get its own content_scripts. Hence they should not be used to maintain states as their lifecycle ends with the tab.

So we need background script, which runs on browser level and can be shared by other content_scripts. It persists its session across tab creation and deleteion.

Hence each content_scipts should send data to this script to maintain the state and it can finally save the data into database as well.

---
Another things I got to know is to look at Page > Inspect > console for content_scripts logs.
But for background.js, i need to go to `about:debugging` page > this firefox > inspect > console

Logs for both will be visible on different places.