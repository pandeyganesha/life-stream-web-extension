console.log("Background script loaded.");

const TIME_SPENT_MAP = new Map();
let active_site = null;
let previous_site = null;
let last_focused_window_id;

async function get_url_from_tab_id(tab_id) {
    const tab = await browser.tabs.get(tab_id);
    const raw_url = tab.url || "";
    const url = new URL(raw_url);
    return url.hostname ? url.hostname : "Empty-Tab";
}

function set_start_timestamp_for(site){
    if (!TIME_SPENT_MAP.has(site)){
        TIME_SPENT_MAP.set(site, [])
    }
    TIME_SPENT_MAP.get(site).push({"start_time": Date.now()});
    console.log(`START: ${JSON.stringify([...TIME_SPENT_MAP], null, 2)}`);
}

function set_end_timestamp_for(site){
    TIME_SPENT_MAP.get(site).at(-1).end_time = Date.now();
    console.log(`START: ${JSON.stringify([...TIME_SPENT_MAP], null, 2)}`);
}

function get_time_spent_for(site){

}

function get_time_spent_summary(){

}

browser.tabs.onActivated.addListener(async (active_info) => {
    console.log("On Activated");
    active_site = await get_url_from_tab_id(active_info.tabId);
    set_start_timestamp_for(active_site);
    if (previous_site)
        set_end_timestamp_for(previous_site);

    previous_site = active_site;
});

browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    console.log("On Updated");
    let new_active_site = await get_url_from_tab_id(tabId);
    if (new_active_site === active_site)
        return;
    active_site = new_active_site;
    set_start_timestamp_for(active_site);
    set_end_timestamp_for(previous_site);
    previous_site = active_site;
});

browser.windows.onFocusChanged.addListener(async (windowId) => {
    console.log("On Window Focus Changed")

    if (windowId == -1){
        const [tab_to_update] = await browser.tabs.query({
            active: true,
            windowId: last_focused_window_id
        });
        set_end_timestamp_for(await get_url_from_tab_id(tab_to_update.id));
    }
    else {
        last_focused_window_id = (await browser.windows.getCurrent()).id;
        const [tab_to_update] = await browser.tabs.query({
            active: true,
            windowId: windowId
        });
        set_start_timestamp_for(await get_url_from_tab_id(tab_to_update.id));
    }
});