'use strict';

import { storage } from './storage.js'

let list_div = document.getElementById('list');

function readList() {
  let blocked = [];
  for (let div of list_div.children) {
    let toggle = div.children[0];
    let input = div.children[1];
    blocked.push({pattern: input.value.trim(), enabled: toggle.checked});
  }
  return blocked;
}

function saveState() {
  let blocked = readList();
  return storage.setRules(blocked);
}

function addField(rule) {
  let input_div = document.createElement('div');
  let toggle = document.createElement('input');
  let input = document.createElement('input');
  let remove = document.createElement('button');
  toggle.type = 'checkbox';
  toggle.checked = rule.enabled;
  toggle.title = "If checked, the extension blocks this URL pattern."
  toggle.addEventListener('change', saveState);
  input.value = rule.pattern;
  input.addEventListener('change', saveState);
  remove.innerText = 'Delete';
  remove.onclick = function(element) {
    list_div.removeChild(input_div);
    saveState();
  }
  input_div.appendChild(toggle);
  input_div.appendChild(input);
  input_div.appendChild(remove);
  list_div.appendChild(input_div);
}

add.onclick = function(element) {
  addField({pattern: "", enabled: false});
  saveState();
}

function resetAllFields(rules) {
  while (list_div.firstChild) {
    list_div.removeChild(list_div.lastChild);
  }
  rules.forEach(addField);
}

storage.getRules()
  .then(resetAllFields)
  .catch(() => {resetAllFields([]);});
storage.addListener(resetAllFields);
