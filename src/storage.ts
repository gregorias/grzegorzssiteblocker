"use strict";

// This module implements a storage API on top of `chrome.storage`.

export { storage };

import { Rule } from "./rule";

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

// The listener accepted by `storage.addListener`.
type StorageListener = (newRules: Rule[]) => void;
// The listener accepted by `chrome.storage.onChanged.addListener`.
type ChromeListener = (
  changes: { [key: string]: chrome.storage.StorageChange },
  areaName: string,
) => void;

class Storage {
  clientListenersAndChromeListeners: Array<[StorageListener, ChromeListener]> =
    [];

  async setRules(rules: Rule[]): Promise<void> {
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

  async getRules(): Promise<Rule[]> {
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

  /**
   * Adds a change listener.
   *
   * @param {StorageListener} listener
   */
  addListener(listener: StorageListener) {
    let chromeListener: ChromeListener = (changes, areaName) => {
      if (areaName != "sync") return;
      if (!changes.blocked) return;
      listener(deserialize(changes.blocked.newValue));
    };
    this.clientListenersAndChromeListeners.push([listener, chromeListener]);
    chrome.storage.onChanged.addListener(chromeListener);
  }

  /**
   * Removes a change listener.
   *
   * @param {StorageListener} listener - [TODO:description]
   */
  removeListener(listener: StorageListener) {
    let index = this.clientListenersAndChromeListeners.length;
    while (index > 0) {
      index -= 1;
      if (this.clientListenersAndChromeListeners[index][0] === listener) {
        let chromeListener = this.clientListenersAndChromeListeners[index][1];
        chrome.storage.onChanged.removeListener(chromeListener);
        this.clientListenersAndChromeListeners.splice(index, 1);
      }
    }
  }
}

const storage = new Storage();
