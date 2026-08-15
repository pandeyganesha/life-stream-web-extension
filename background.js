console.log("Background script loaded.");

TIME_SPENT_MAP = new Map();

let previous_site = null;
let previous_site_start_time = null;

function update_time_spent_map(active_site) {
    
    // do not calculate again, if old and new sites are same
    if (active_site === previous_site)
        return;

    // Save timestamp when the site started
    active_site_start_time = Date.now();
    
    // Set the key in map if not present
    if (!TIME_SPENT_MAP.has(active_site)) {
        TIME_SPENT_MAP.set(active_site, 0);
    }

    // Calculate time spent for previous tab
    if (previous_site !== null) {
        const previous_time = TIME_SPENT_MAP.get(previous_site);
        const time_spent = Date.now() - previous_site_start_time;
        TIME_SPENT_MAP.set(previous_site, previous_time + time_spent);
    }

    // active site becomes previous site ( eventually )
    previous_site = active_site
    previous_site_start_time = active_site_start_time;
}

async function get_url_from_tab_id(tab_id) {
    const tab = await browser.tabs.get(tab_id);
    const raw_url = tab.url || "";
    const url = new URL(raw_url);
    return url.hostname ? url.hostname : "Empty-Tab";
}

browser.tabs.onActivated.addListener(async (active_info) => {
    console.log("On Activated")
    update_time_spent_map(await get_url_from_tab_id(active_info.tabId))
    console.log("TIME_SPENT_MAP:", TIME_SPENT_MAP);

});

browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    console.log("On Updated")
    update_time_spent_map(await get_url_from_tab_id(tabId))
    console.log("TIME_SPENT_MAP:", TIME_SPENT_MAP);
});