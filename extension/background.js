'use strict';

chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason == "install") {
    // Set blocked in storage.sync if unset.
    chrome.storage.sync.get('blocked', function(data) {
      if (chrome.runtime.lastError) return;
      if (Array.isArray(data.blocked)) return;
      chrome.storage.sync.set({blocked: []}, function() {
        console.log("Reset the blocked list.");
      });
    });
  }
});

function blockedUrlsToRules(blockedUrls) {
  let rules = [];
  let cid = 1;
  for (let [urlToBlock, enabled] of blockedUrls) {
    if (!enabled) continue;
    // Empty URL filters are disallowed by Chrome's API.
    if (!urlToBlock) continue;
    rules.push(
      {
        id: cid,
        action: {
          type: "block"
        },
        condition: {
          urlFilter: "*://" + urlToBlock,
          resourceTypes: [
            "main_frame",
            "sub_frame",
          ]
        }
      }
    );
    cid += 1;
  }
  return rules
}

async function setUrlBlocks(blockedUrls) {
  let rules = await chrome.declarativeNetRequest.getDynamicRules()
  return chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: rules.map(rule => rule.id),
    addRules: blockedUrlsToRules(blockedUrls)
  });
}

chrome.storage.sync.get('blocked', function(data) {
  if (chrome.runtime.lastError) return;
  if (!Array.isArray(data.blocked)) return;
  setUrlBlocks(data.blocked);
});

chrome.storage.onChanged.addListener(function(changes, areaName) {
  if (areaName != "sync") return;
  if (!changes.blocked) return;
  setUrlBlocks(changes.blocked.newValue);
});
