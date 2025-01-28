
;(async () => {
    const f = chrome.runtime.getURL("src/content/features/copy-url/index.js");
    const copyUrl = await import(f);
    copyUrl.default();
})();
