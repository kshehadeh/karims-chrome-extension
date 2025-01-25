const welcomePage = 'src/sidebar/welcome-sb.html';
const mainPage = 'src/sidebar/main-sb.html';

chrome.runtime.onInstalled.addListener(() => {
    chrome.sidePanel.setOptions({ path: welcomePage });
  });

  chrome.tabs.onActivated.addListener(async ({ tabId }) => {
    const { path } = await chrome.sidePanel.getOptions({ tabId });
    if (path === welcomePage) {
      chrome.sidePanel.setOptions({ path: mainPage });
    }
  });  

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "toggle_sidebar",
        title: "Open sidebar",
        contexts: ["all"],
    });
});

chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .then(() => console.log("Sidebar behavior set"))
    .catch((error) => console.error(error));

async function copyToClipboard(tab) {
    if (!tab || !tab.id) {
        return;
    }

    const url = tab.url;
    const result = await chrome.tabs.sendMessage(tab.id, {
        type: "copyToClipboard",
        text: url,
        html: "<a href='" + url + "'>" + url + "</a>",
    });

    if (result && result.success) {
        console.log("Copied URL to clipboard:", url);
    } else {
        console.error("Failed to copy URL to clipboard:", url);
    }
}

chrome.commands.onCommand.addListener(async (command) => {
    if (command === "copy_tab_url") {
        try {
            const [tab] = await chrome.tabs.query({
                active: true,
                lastFocusedWindow: true,
            });
            if (tab && tab.url) {
                copyToClipboard(tab);
                console.log(`Copied URL to clipboard: ${tab.url}`);
            }
        } catch (error) {
            console.error("Failed to copy URL:", error);
        }
    }

    if (command == "toggle_sidebar") {
        const [tab] = await chrome.tabs.query({
            active: true,
            lastFocusedWindow: true,
        });
        chrome.sidePanel.open({ windowId: tab.windowId });
    }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "toggle_sidebar") {
        // Open the sidebar in all the tabs of the current window.
        chrome.sidePanel.open({ windowId: tab.windowId });
    }
});

const MAX_TAB_AGE = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

function closeOldTabs() {
    chrome.tabs.query({}, (tabs) => {
        const now = Date.now();
        tabs.forEach((tab) => {
            if (tab.lastAccessed && (now - tab.lastAccessed) > MAX_TAB_AGE) {
                chrome.tabs.remove(tab.id, () => {
                    console.log(`Closed tab with id: ${tab.id} due to inactivity.`);
                });
            }
        });
    });
}

// Check for old tabs every hour
setInterval(closeOldTabs, 1000*60*60);
