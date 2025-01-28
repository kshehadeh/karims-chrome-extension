
export async function copyToClipboard(tab) {
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
        console.log("[Karim's Extension] Copied URL to clipboard:", url);
    } else {
        console.error("[Karim's Extension] Failed to copy URL to clipboard:", url);
    }
}


export default function setup() {
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
    });
}