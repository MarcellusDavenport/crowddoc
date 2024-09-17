document.addEventListener('DOMContentLoaded', function() {
    // Retrieve the stored URL from local storage
    chrome.storage.local.get('currentUrl', function(data) {
        // Display the URL in the sidebar
        document.getElementById('url').textContent = data.currentUrl || 'No URL available';
    });
});
