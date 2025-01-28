// Saves options to chrome.storage
const saveOptions = () => {
    const tabAge = document.getElementById("tab-age").value;
    const autoCloseTabsToggle = document.getElementById("auto-close-tabs").checked;

    chrome.storage.sync.set(
        { tabAge, autoCloseTabsToggle },
        () => {
            // Update status to let user know options were saved.
            const status = document.getElementById("status");
            status.textContent = "Options saved.";
            setTimeout(() => {
                status.textContent = "";
            }, 750);
        },
    );
};

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
const restoreOptions = () => {
    chrome.storage.sync.get(
        { tabAge: "12", autoCloseTabsToggle: true },
        (items) => {
            document.getElementById("tab-age").value = items.tabAge;
            document.getElementById("auto-close-tabs").checked = items.autoCloseTabsToggle;
        },
    );
};


document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("save").addEventListener("click", saveOptions);
document.getElementById("copy-url-open-shortcut-settings").addEventListener("click", () => {
    chrome.tabs.create({ url: "chrome://extensions/shortcuts" });
});