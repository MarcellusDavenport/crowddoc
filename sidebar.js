document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('linkForm');
    const titleInput = document.getElementById('title');
    const linkInput = document.getElementById('link');
    const languageSelect = document.getElementById('language');
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
                    addLinkToDisplay(linkObj.title, linkObj.link, linkObj.language);
                });
            });
        }
    });

    // Handle form submission
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const title = titleInput.value.trim();
        const link = linkInput.value.trim();
        const language = languageSelect.value;
        const currentUrl = document.getElementById('url').textContent;

        if (title && link && language && currentUrl !== 'No URL available') {
            // Save new link under the current URL
            chrome.storage.local.get([currentUrl], function(data) {
                const links = data[currentUrl] || [];
                links.push({ title, link, language });
                chrome.storage.local.set({ [currentUrl]: links }, function() {
                    console.log('Link saved:', title, link, language);
                    addLinkToDisplay(title, link, language);
                });
            });

            // Clear form
            titleInput.value = '';
            linkInput.value = '';
            languageSelect.value = '';
        }
    });

    function addLinkToDisplay(title, link, language) {
        const entry = document.createElement('div');
        entry.className = 'entry';
        entry.innerHTML = `<a href="${link}" target="_blank">${title}</a> <br> <small>Language: ${language}</small>`;
        linksContainer.appendChild(entry);
    }
});
