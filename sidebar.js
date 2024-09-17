document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('linkForm');
    const titleInput = document.getElementById('title');
    const linkInput = document.getElementById('link');
    const linksContainer = document.getElementById('linksContainer');

    // Retrieve the current URL from storage
    chrome.storage.local.get('currentUrl', function(data) {
        const currentUrl = data.currentUrl || 'No URL available';
        document.getElementById('url').textContent = currentUrl;

        // Load and display saved links for the current URL
        if (currentUrl !== 'No URL available') {
            chrome.storage.local.get([currentUrl], function(data) {
                const links = data[currentUrl] || [];
                links.forEach(linkObj => {
                    addLinkToDisplay(linkObj.title, linkObj.link);
                });
            });
        }
    });

    // Handle form submission
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const title = titleInput.value.trim();
        const link = linkInput.value.trim();
        const currentUrl = document.getElementById('url').textContent;

        if (title && link && currentUrl !== 'No URL available') {
            // Save new link under the current URL
            chrome.storage.local.get([currentUrl], function(data) {
                const links = data[currentUrl] || [];
                links.push({ title, link });
                chrome.storage.local.set({ [currentUrl]: links }, function() {
                    console.log('Link saved:', title, link);
                    addLinkToDisplay(title, link);
                });
            });

            // Clear form
            titleInput.value = '';
            linkInput.value = '';
        }
    });

    function addLinkToDisplay(title, link) {
        const entry = document.createElement('div');
        entry.className = 'entry';
        entry.innerHTML = `<a href="${link}" target="_blank">${title}</a>`;
        linksContainer.appendChild(entry);
    }
});
