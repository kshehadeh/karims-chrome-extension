const MAX_TAB_AGE = 12 * 60 * 60 * 1000; // 24 hours in milliseconds

export async function getOptions() {
    return await chrome.storage.sync.get(["tabAge", "autoCloseTabsToggle"]);
}

export async function showNotification(
    type,
    title,
    message,
    iconUrl,
    items = undefined,
    imageUrl = undefined,
) {
    if (["basic", "list", "image", "progress"].indexOf(type) === -1) {
        type = "basic";
    }

    var opt = {
        type,
        title,
        message,
        items,
        iconUrl,
        imageUrl,
    };


    const result = await chrome.notifications.create("karims-extension-tab-closer", opt);    
    console.log(result);
}

export async function setupAutoTabCloser() {
    console.log("[Karim's Extension] Setting up auto tab closer");

    const { tabAge, autoCloseTabsToggle } = await getOptions();

    if (!autoCloseTabsToggle) {
        console.log("[Karim's Extension] Auto close tabs is disabled");
        return;
    }

    console.log(
        `[Karim's Extension] Auto close tabs is enabled with tab age of ${tabAge} hours`,
    );

    // Check for old tabs every hour
    const tabAgeInMilleseconds = parseInt(tabAge, 10) * 60 * 60 * 1000;

    // Close old tabs on startup
    closeOldTabs(tabAgeInMilleseconds);

    setInterval(() => {
        closeOldTabs(tabAgeInMilleseconds);
    }, 1000 * 60 * 60);
}

export async function closeOldTabs(ageOfTabsInMilliseconds = MAX_TAB_AGE) {
    console.log(
        `[Karim's Extension] Closing tabs older than ${ageOfTabsInMilliseconds} milliseconds`,
    );

    const closeStats = {
        closedForAge: 0,
        closedForFrozen: 0,
        closedForDiscarded: 0,
        skipped: 0,
        total: 0,
    };

    const tabs = await chrome.tabs.query({});
    closeStats.skipped = closeStats.total = tabs.length;
    const now = Date.now();
    tabs.forEach((tab) => {
        if (
            tab.lastAccessed &&
            now - tab.lastAccessed > ageOfTabsInMilliseconds
        ) {
            closeStats.closedForAge++;
            closeStats.skipped--;
            chrome.tabs.remove(tab.id, () => {
                console.log(
                    `[Karim's Extension] Closed tab with id: ${tab.id} due to inactivity.`,
                );
            });
        }

        if (tab.discarded) {
            closeStats.closedForDiscarded++;
            closeStats.skipped--;
            chrome.tabs.remove(tab.id, () => {
                console.log(
                    `[Karim's Extension] Closed tab with id: ${tab.id} due to being discarded.`,
                );
            });
        }

        if (tab.frozen) {
            closeStats.closedForFrozen++;
            closeStats.skipped--;
            chrome.tabs.remove(tab.id, () => {
                console.log(
                    `[Karim's Extension] Closed tab with id: ${tab.id} due to being frozen.`,
                );
            });
        }
    })        

    if (closeStats.total - closeStats.skipped > 0) {
        showNotification("basic", "Closed Tabs", `${closeStats.total - closeStats.skipped} tabs were closed`, "./img/logo.png");
    }

    const activeTab = await chrome.tabs.query({
        active: true,
        currentWindow: true,
    });

    if (activeTab && activeTab?.[0]?.id) {
        chrome.tabs.sendMessage(activeTab[0].id, {
            type: "tabsClosedStats",
            ...closeStats,
        });
    }
}

export default function setup() {
    chrome.runtime.onInstalled.addListener(() => {
        setupAutoTabCloser();
    });

    chrome.runtime.onStartup.addListener(() => {
        setupAutoTabCloser();
    });

    chrome.commands.onCommand.addListener(async (command) => {
        if (command === "close_old_tabs") {
            const { tabAge } = await getOptions();
            const tabAgeInMilleseconds = parseInt(tabAge, 10) * 60 * 60 * 1000;
            await closeOldTabs(tabAgeInMilleseconds);
        }
    });
}
