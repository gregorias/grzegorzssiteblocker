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

async function blockedUrlsToRules(blockedUrls) {
  let rules = [];
  let cid = 1;
  for (let [urlToBlock, enabled] of blockedUrls) {
    if (!enabled) continue;
    // Empty URL filters are disallowed by Chrome's API.
    if (!urlToBlock) continue;

    let isRegexSupportedResult = await chrome.declarativeNetRequest.isRegexSupported({regex: urlToBlock});
    let condition = isRegexSupportedResult.isSupported ? {regexFilter: urlToBlock} : {urlFilter: "*://" + urlToBlock};
    condition.resourceTypes = ["main_frame", "sub_frame", "xmlhttprequest", "websocket", "other"];
    rules.push(
      {
        id: cid,
        action: {
          type: "block"
        },
        condition: condition
      }
    );
    cid += 1;
  }
  return rules
}

async function setUrlBlocks(blockedUrls) {
  let old_rules = await chrome.declarativeNetRequest.getDynamicRules()
  let new_rules = await blockedUrlsToRules(blockedUrls)
  return chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: old_rules.map(rule => rule.id),
    addRules: new_rules
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
