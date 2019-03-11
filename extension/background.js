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

chrome.storage.sync.get('blocked', function(data) {
  if (chrome.runtime.lastError) return;
  if (!Array.isArray(data.blocked)) return;
  // Empty filter.urls is interpreted as all URLs are allowed, so we don't set
  // the listener in that case.
  if (data.blocked.length == 0) return;
  let filter = {urls: blockDomainsToFilters(data.blocked)};
  chrome.webRequest.onBeforeRequest.addListener(
      block, filter, opt_extraInfoSpec);
});

chrome.storage.onChanged.addListener(function(changes, areaName) {
  if (areaName != "sync") return;
  if (!changes.blocked) return;

  chrome.webRequest.onBeforeRequest.removeListener(block);

  // Empty filter.urls is interpreted as all URLs are allowed, so we don't set
  // the listener in that case.
  if (changes.blocked.newValue.length == 0) return;

  let filter = {urls: blockDomainsToFilters(changes.blocked.newValue)};
  chrome.webRequest.onBeforeRequest.addListener(
      block, filter, opt_extraInfoSpec);
});
