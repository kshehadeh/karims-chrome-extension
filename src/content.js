
async function loadFeature(pathToFile) {
    const f = chrome.runtime.getURL(pathToFile);
    const feature = await import(f);
    feature.default();
}

;(async () => {
    await loadFeature("src/content/features/copy-url/index.js")
    await loadFeature("src/content/features/tab-closer/index.js")
})();
