document.getElementById('submitBtn').addEventListener('click', function () {
    let input = document.getElementById('linkInput').value;
  
    // Retrieve the selected text from storage
    chrome.storage.local.get(['selectedText'], function (result) {
      let selectedText = result.selectedText;
  
      if (input && selectedText) {
        // Store the link and the associated selected text together
        chrome.storage.local.set({ link: input, selectedText: selectedText }, function () {
          console.log('[popup.js] Link and selected text saved:', { link: input, selectedText: selectedText });
          
          // Clear the stored selected text
          //chrome.storage.local.remove('selectedText');
  
          // Close the popup after submission
          window.close();
        });
      }
    });
  });
  