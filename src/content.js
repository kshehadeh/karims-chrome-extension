function copyToClipboardClient(text, html) {
    const listener = function (ev) {
        ev.preventDefault();
        ev.clipboardData.setData("text/html", html);
        ev.clipboardData.setData("text/plain", text);
    };
    document.addEventListener("copy", listener);
    document.execCommand("copy");
    document.removeEventListener("copy", listener);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "copyToClipboard") {
      copyToClipboardClient(message.text, message.html);
    }
});
