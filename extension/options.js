'use strict';

function getBlockedWithEmptyDefault(callback) {
  chrome.storage.sync.get('blocked', function(data) {
    if (chrome.runtime.lastError) callback([]);
    else if (!Array.isArray(data.blocked)) callback([]);
    else callback(data.blocked);
  });
}

let list_div = document.getElementById('list');
let save = document.getElementById('save');

function readList() {
  let blocked = [];
  for (let div of list_div.children) {
    let toggle = div.children[0];
    let input = div.children[1];
    blocked.push([input.value.trim(), toggle.checked]);
  }
  return blocked;
}

function addField(value, enabled) {
  let input_div = document.createElement('div');
  let toggle = document.createElement('input');
  let input = document.createElement('input');
  let remove = document.createElement('button');
  toggle.type = 'checkbox';
  toggle.checked = enabled;
  toggle.title = "If checked, the extension blocks this URL pattern."
  input.value = value;
  remove.innerText = 'Delete';
  input_div.appendChild(toggle);
  input_div.appendChild(input);
  input_div.appendChild(remove);
  list_div.appendChild(input_div);
  remove.onclick = function(element) {
    list_div.removeChild(input_div);
  }
}
getBlockedWithEmptyDefault(function(blocked) {
  for (let [regexp_str, enabled] of blocked) {
    addField(regexp_str, enabled);
  }
});
add.onclick = function(element) {
  addField("", false);
}
save.onclick = function(element) {
  let blocked = readList();
  chrome.storage.sync.set({blocked: blocked}, function() {
    console.log("Set the blocked list to " + blocked.toString() + ".");
  });
};
