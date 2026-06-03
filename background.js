// background.js
chrome.runtime.onInstalled.addListener(() => {
  console.log("Optical Toolkit extension installed.");
});

// Configure the side panel to open on action click
if (chrome.sidePanel && typeof chrome.sidePanel.setPanelBehavior === 'function') {
  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error("Error setting panel behavior:", error));
}
