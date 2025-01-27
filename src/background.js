import { setupAutoTabCloser } from "./lib/tab-closer.js";
import { copyToClipboard } from "./lib/copy-url.js";

const welcomePage = "src/sidebar/welcome-sb.html";
const mainPage = "src/sidebar/main-sb.html";

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

chrome.runtime.onInstalled.addListener(() => {
    setupAutoTabCloser();
});

chrome.runtime.onStartup.addListener(() => {
    setupAutoTabCloser();
}); 

chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .then(() => console.log("Sidebar behavior set"))
    .catch((error) => console.error(error));

chrome.commands.onCommand.addListener(async (command) => {
    if (command === "copy_tab_url") {
        try {
            const [tab] = await chrome.tabs.query({
                active: true,
                lastFocusedWindow: true,
            });
            if (tab && tab.url) {
                copyToClipboard(tab);
                console.log(`[Karim's Extension] Copied URL to clipboard: ${tab.url}`);
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

