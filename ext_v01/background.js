chrome.runtime.onInstalled.addListener(() => {
  // console.log("Extension Installed");

  // Create context menu items
  chrome.contextMenus.create({
    id: "sendToClaims",
    title: "Send to Claims",
    contexts: ["selection"],
  });

  chrome.contextMenus.create({
    id: "sendToIngredients",
    title: "Send to Ingredients",
    contexts: ["selection"],
  });
});

// Handling context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "sendToClaims") {
    chrome.storage.local.set({ claim: info.selectionText });
  }

  if (info.menuItemId === "sendToIngredients") {
    chrome.storage.local.set({ ingredients: info.selectionText });
  }
});

// Listening for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "saveClaim") {
    chrome.storage.local.set({ claim: request.data }, () => {
      sendResponse({ status: "success" });
    });
    return true; // Keeps the message channel open for sendResponse
  }

  if (request.action === "saveIngredients") {
    chrome.storage.local.set({ ingredients: request.data }, () => {
      sendResponse({ status: "success" });
    });
    return true; // Keeps the message channel open for sendResponse
  }
});
