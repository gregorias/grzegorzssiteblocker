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

function block(details) {
  return {cancel: true}
};

function blockDomainsToFilters(blocked) {
  let filters = [];
  for (let b of blocked) {
    filters.push("*://" + b);
  }
  return filters;
}

let opt_extraInfoSpec = ["blocking"];

function getBlockedWebsites(blockedWithToggle) {
  let blockedUrls = []
  for (let [url, enabled] of blockedWithToggle) {
    if (enabled)
      blockedUrls.push(url);
  }
  return blockedUrls;
}

chrome.storage.sync.get('blocked', function(data) {
  if (chrome.runtime.lastError) return;
  if (!Array.isArray(data.blocked)) return;
  let blockedUrls = getBlockedWebsites(data.blocked);
  // Empty filter.urls is interpreted as all URLs are allowed, so we don't set
  // the listener in that case.
  if (blockedUrls.length == 0) return;
  let filter = {urls: blockDomainsToFilters(blockedUrls)};
  chrome.webRequest.onBeforeRequest.addListener(
      block, filter, opt_extraInfoSpec);
});

chrome.storage.onChanged.addListener(function(changes, areaName) {
  if (areaName != "sync") return;
  if (!changes.blocked) return;

  chrome.webRequest.onBeforeRequest.removeListener(block);

  let blockedUrls = getBlockedWebsites(changes.blocked.newValue);
  // Empty filter.urls is interpreted as all URLs are allowed, so we don't set
  // the listener in that case.
  if (blockedUrls.length == 0) return;

  let filter = {urls: blockDomainsToFilters(blockedUrls)};
  chrome.webRequest.onBeforeRequest.addListener(
      block, filter, opt_extraInfoSpec);
});
