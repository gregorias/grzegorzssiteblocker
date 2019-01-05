'use strict';

function getBlockedWithEmptyDefault(callback) {
  chrome.storage.sync.get('blocked', function(data) {
    if (chrome.runtime.lastError) callback([]);
    else if (!Array.isArray(data.blocked)) callback([]);
    else callback(data.blocked);
  });
}

let blocked_textarea = document.getElementById('blocked');
let save = document.getElementById('save');

getBlockedWithEmptyDefault(function(blocked) {
  blocked_textarea.value = blocked.join(",\n");
});
save.onclick = function(element) {
  let trim = function(str) { return str.trim(); };
  let blocked = blocked_textarea.value.split(',').map(trim);
  for (let url of blocked) {
    if (!url.match(new RegExp("^\\*://.*/\\*$"))) {
      alert("Invalid URL: " + url);
      return;
    }
  }
  chrome.storage.sync.set({blocked: blocked}, function() {
    console.log("Set the blocked list to " + blocked.toString() + ".");
  });
};
