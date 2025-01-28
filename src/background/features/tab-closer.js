const MAX_TAB_AGE = 12 * 60 * 60 * 1000; // 24 hours in milliseconds

export async function setupAutoTabCloser() {
    console.log("[Karim's Extension] Setting up auto tab closer");

    const {tabAge,autoCloseTabsToggle} = await chrome.storage.sync.get(["tabAge","autoCloseTabsToggle"]) || "12";

    if (!autoCloseTabsToggle) {
        console.log("[Karim's Extension] Auto close tabs is disabled");
        return;
    }

    console.log(`[Karim's Extension] Auto close tabs is enabled with tab age of ${tabAge} hours`);

    // Check for old tabs every hour
    const tabAgeInMilleseconds = parseInt(tabAge, 10) * 60 * 60 * 1000

    // Close old tabs on startup
    closeOldTabs(tabAgeInMilleseconds);

    setInterval(() => {
        closeOldTabs(tabAgeInMilleseconds);
    }, 1000 * 60 * 60);
}

export function closeOldTabs(ageOfTabsInMilliseconds = MAX_TAB_AGE) {
    chrome.tabs.query({}, (tabs) => {
        const now = Date.now();
        tabs.forEach((tab) => {
            if (tab.lastAccessed && now - tab.lastAccessed > ageOfTabsInMilliseconds) {
                chrome.tabs.remove(tab.id, () => {
                    console.log(
                        `[Karim's Extension] Closed tab with id: ${tab.id} due to inactivity.`,
                    );
                });
            }
        });
    });
}

export default function setup() {
    chrome.runtime.onInstalled.addListener(() => {
        setupAutoTabCloser();
    });
    
    chrome.runtime.onStartup.addListener(() => {
        setupAutoTabCloser();
    });    
}