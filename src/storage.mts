"use strict";

// This module implements a storage API on top of `chrome.storage`.

export { storage };

interface Rule {
  enabled: boolean;
  pattern: string;
}

/**
 * Serializes a list of rules into a list of pairs.
 *
 * @param rules - Rules to serialize.
 * @returns The serializable rules.
 */
function serialize(rules: Rule[]): Array<[string, boolean]> | null {
  try {
    return rules.map((rule: Rule) => [rule.pattern, rule.enabled]);
  } catch (e) {
    return null;
  }
}

function deserialize(data: Array<[string, boolean]>): Rule[] {
  return data.map((pair) => {
    return { enabled: pair[1], pattern: pair[0] };
  });
}

/**
 * @return {Promise<Array<Rule>>}
 */
async function getRules(): Promise<Rule[]> {
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

async function setRules(rules: Rule[]): Promise<void> {
  return new Promise(function (resolve, reject) {
    let data = serialize(rules);
    if (data == null) {
      reject(null);
      return;
    }
    chrome.storage.sync.set({ blocked: serialize(rules) }, function (): void {
      if (chrome.runtime.lastError) {
        reject();
        return;
      }
      resolve();
    });
  });
}

function addListener(listener: (arg: Rule[]) => void) {
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
