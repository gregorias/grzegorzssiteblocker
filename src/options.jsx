"use strict";

import React from "react";

import { createRoot } from "react-dom/client";
import { storage } from "./storage.mts";
import { Rule } from "./rule";
import { RuleList } from "./RuleList.tsx";

const react_list_div = document.getElementById("react-list");
const react_list_root = createRoot(react_list_div);

function setupReactRuleList() {
  let rules = [{ enabled: false, pattern: "" }];
  renderRuleList(react_list_root, rules);
}

function renderRuleList(root, rules) {
  root.render(
    <RuleList
      rules={rules}
      onRulesChange={(newRules) => {
        saveState(newRules);
        renderRuleList(root, newRules);
      }}
      onAddRule={() => {
        let newRules = [...rules, new Rule(false, "")];
        saveState(newRules);
        renderRuleList(root, newRules);
      }}
    />,
  );
}

setupReactRuleList();

function saveState(rules) {
  return storage.setRules(rules);
}

storage
  .getRules()
  .then((rules) => {
    renderRuleList(react_list_root, rules);
  })
  .catch(() => {
    renderRuleList(react_list_root, []);
  });
storage.addListener((rules) => {
  renderRuleList(root, rules);
});
window.addEventListener("beforeunload", saveState);
