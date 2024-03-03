"use strict";

// This module implements a storage API on top of `chrome.storage`.

export { storage };

/**
 * @param {Array<Rule>} rules Rules to serialize.
 * @return {Array<[boolean, string]> | null}
 */
function serialize(rules) {
  try {
    return rules.map((rule) => [rule.pattern, rule.enabled]);
  } catch (e) {
    return null;
  }
}

/**
 * @param {Array<[boolean, string]>} data Pairs to deserialize.
 * @throws
 * @return {Array<Rule>}
 */
function deserialize(data) {
  return data.map((pair) => {
    return { enabled: pair[1], pattern: pair[0] };
  });
}

/**
 * @return {Promise<Array<Rule>>}
 */
async function getRules() {
  return new Promise(function (resolve, reject) {
    chrome.storage.sync.get("blocked", function (data) {
      if (chrome.runtime.lastError) {
        reject();
        return;
      }
      if (!data.blocked) {
        resolve([]);
        return;
      }
      try {
        let rules = deserialize(data.blocked);
        resolve(rules);
      } catch (e) {
        reject(e);
      }
    });
  });
}

async function setRules(rules) {
  return new Promise(function (resolve, reject) {
    let data = serialize(rules);
    if (data == null) {
      reject(null);
      return;
    }
    chrome.storage.sync.set({ blocked: serialize(rules) }, function (result) {
      if (chrome.runtime.lastError) {
        reject();
        return;
      }
      resolve(result);
    });
  });
}

function addListener(listener) {
  chrome.storage.onChanged.addListener(function (changes, areaName) {
    if (areaName != "sync") return;
    if (!changes.blocked) return;
    listener(deserialize(changes.blocked.newValue));
  });
}

const storage = {
  getRules: getRules,
  setRules: setRules,
  addListener: addListener,
};
