"use strict";

import { storage } from "./storage.mts";

async function myRulesToChromeNetRequestRules(myRules) {
  let rules = [];
  let cid = 1;
  for (let rule of myRules) {
    if (!rule.enabled) continue;
    // Empty URL filters are disallowed by Chrome's API.
    if (!rule.pattern) continue;

    let isRegexSupportedResult =
      await chrome.declarativeNetRequest.isRegexSupported({
        regex: rule.pattern,
      });
    let condition = isRegexSupportedResult.isSupported
      ? { regexFilter: rule.pattern }
      : { urlFilter: "*://" + rule.pattern };
    condition.resourceTypes = [
      "main_frame",
      "sub_frame",
      "xmlhttprequest",
      "websocket",
      "other",
    ];
    rules.push({
      id: cid,
      action: {
        type: "block",
      },
      condition: condition,
    });
    cid += 1;
  }
  return rules;
}

async function setUrlBlocks(rules) {
  let old_rules = await chrome.declarativeNetRequest.getDynamicRules();
  let new_rules = await myRulesToChromeNetRequestRules(rules);
  return chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: old_rules.map((rule) => rule.id),
    addRules: new_rules,
  });
}

function moveCurrentTabToWikipedia() {
  chrome.tabs.update(undefined, {
    url: "https://en.wikipedia.org/wiki/Akrasia",
  });
}

async function checkAndBlockCurrentSite() {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let rules = await storage.getRules();
  for (let rule of rules) {
    if (!rule.enabled) continue;
    try {
      let re = new RegExp(rule.pattern);
      if (tab.url.match(re)) moveCurrentTabToWikipedia();
    } catch (e) {}
  }
}

async function setUp() {
  storage.getRules().then(setUrlBlocks);
}
setUp();

storage.addListener(setUrlBlocks);
chrome.tabs.onActivated.addListener(checkAndBlockCurrentSite);
chrome.tabs.onUpdated.addListener(checkAndBlockCurrentSite);
