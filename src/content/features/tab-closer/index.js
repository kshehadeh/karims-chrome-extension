function showClosedOverlay(closedStats) {
    // Create an element to hold the "URL Copied!" message
    const popup = document.createElement("div");
    popup.innerHTML = `
<strong>${closedStats.closedForAge}</strong> closed because of age,
<br/><strong>${closedStats.closedForFrozen}</strong> closed because they were frozen,
<br/><strong>${closedStats.closedForDiscarded}</strong> closed they were discarded
<br/><strong>${closedStats.skipped}</strong> skipped
`;

    // Style it so it looks like a small toast-like overlay
    popup.style.position = "fixed";
    popup.style.top = "20px";
    popup.style.right = "20px";
    popup.style.padding = "10px 15px";
    popup.style.backgroundColor = "black";
    popup.style.color = "white";
    popup.style.fontFamily = "sans-serif";
    popup.style.borderRadius = "4px";
    popup.style.zIndex = "9999";
    popup.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";

    // Add the popup to the DOM
    document.body.appendChild(popup);

    // Remove the popup after 2 seconds
    setTimeout(() => {
        document.body.removeChild(popup);
    }, 2000);
}

export default function setup() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.type === "tabsClosedStats") {
            showClosedOverlay(message);
            sendResponse({ success: true });
        }
    });
}
