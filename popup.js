document.getElementById('submitBtn').addEventListener('click', function () {
    let input = document.getElementById('linkInput').value;
    if (input) {
      chrome.storage.local.set({ link: input }, function () {
        console.log('Link saved:', input);
        // Close the popup after submission
        window.close();
      });
    }
  });
  