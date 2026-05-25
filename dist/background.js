chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "save-note",
    title: "Save to Jozve",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "save-note") {
    chrome.storage.local.set({
      pendingCapture: {
        selectedText: info.selectionText || "",
        pageTitle: tab?.title || "",
        pageUrl: tab?.url || ""
      }
    });

    chrome.action.openPopup();
  }
});