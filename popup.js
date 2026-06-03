// popup.js
document.getElementById('open-side').addEventListener('click', async () => {
  if (chrome.sidePanel && typeof chrome.sidePanel.open === 'function') {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab) {
      chrome.sidePanel.open({ windowId: tab.windowId });
      window.close(); // Close popup
    }
  } else {
    alert("您的浏览器不支持 Side Panel API，建议点击下方的 '在独立网页中打开'。");
  }
});
