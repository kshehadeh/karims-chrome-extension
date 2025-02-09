# Karim's Chrome Extension

## Adding to Chrome (or any Chromium-based browser)

1. Clone this repository to your local machine
2. Open Chrome and go to `chrome://extensions/`
3. Enable Developer Mode by clicking the toggle switch in the top right corner
4. Click on the "Load unpacked" button
5. Navigate to the directory where you cloned this repository and select the folder
6. The extension should now be installed - there is no UI for this extension yet.

## Copy Current Tab URL

This is a simple feature that copies the current tab URL to the clipboard. It is useful when you want to share the URL with someone or save it for later.  Because it's setup as a command, you can setup a keyboard shortcut for this command by going to the chrome extensions management page and follow these steps:

1. In the sidebar, you should see a "Keyboard shortcuts" link. Click on it
2. Find the "Copy Current Tab URL" command and click on the input field
3. Enter the keyboard shortcut you want to use (e.g. `Ctrl+Shift+C`)
4. Test it out by opening a new tab and going to a URL then pressing the keyboard shortcut
5. The URL should be copied to the clipboard

<video controls src="docs/img/setting-keyboard-shortcut.mp4" title="Title"></video>

## Close Tabs That Haven't Been Accessed In An Hour

This feature closes tabs that haven't been accessed in an hour. It is useful when you have a lot of tabs open and you want to close the ones you haven't used in a while. 

There is no customization on this yet so it will just close any tab that **hasn't been accessed in 24 hours** and it will **check every hour**.
