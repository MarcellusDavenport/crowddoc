// Copyright 2023 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

chrome.runtime.onInstalled.addListener(function () {

  let selectionContext = "selection";
  let title = "Add link to code sample";
  chrome.contextMenus.create({
    title: title,
    contexts: [selectionContext],
    id: selectionContext
  });

  // Intentionally create an invalid item, to show off error checking in the
  // create callback.
  chrome.contextMenus.create(
    { title: 'Oops', parentId: 999, id: 'errorItem' },
    function () {
      if (chrome.runtime.lastError) {
        console.log('[main.js] Got expected error: ' + chrome.runtime.lastError.message);
      }
    }
  );
});

// Add listener to handle context menu click
chrome.contextMenus.onClicked.addListener(function (info, tab) {
    if (info.menuItemId === 'selection') {
      // Get the selected text
      let selectedText = info.selectionText;
  
      // Send message to popup.js to store the selected text
      chrome.storage.local.set({ selectedText: selectedText }, function () {
        console.log('[main.js] Selected text saved:', selectedText);
        // Open the popup to allow the user to enter the link
        chrome.action.openPopup();
      });
    }
  });