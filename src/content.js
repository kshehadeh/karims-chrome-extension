function copyToClipboardClient(text, html) {
    const listener = function (ev) {
        ev.preventDefault();
        ev.clipboardData.setData("text/html", html);
        ev.clipboardData.setData("text/plain", text);
    };
    document.addEventListener("copy", listener);
    document.execCommand("copy");
    document.removeEventListener("copy", listener);

    showCopiedOverlay();
}

function showCopiedOverlay() {
    // Create an element to hold the "URL Copied!" message
    const popup = document.createElement('div');
    popup.innerText = 'URL Copied!';
    
    // Style it so it looks like a small toast-like overlay
    popup.style.position = 'fixed';
    popup.style.top = '20px';
    popup.style.right = '20px';
    popup.style.padding = '10px 15px';
    popup.style.backgroundColor = 'black';
    popup.style.color = 'white';
    popup.style.fontFamily = 'sans-serif';
    popup.style.borderRadius = '4px';
    popup.style.zIndex = '9999';
    popup.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
  
    // Add the popup to the DOM
    document.body.appendChild(popup);
  
    // Remove the popup after 2 seconds
    setTimeout(() => {
      document.body.removeChild(popup);
    }, 2000);
  }

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "copyToClipboard") {
      copyToClipboardClient(message.text, message.html);
    }
});
