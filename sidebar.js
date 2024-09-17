document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('linkForm');
    const titleInput = document.getElementById('title');
    const linkInput = document.getElementById('link');
    const languageSelect = document.getElementById('language');
    const linksContainer = document.getElementById('linksContainer');
    const getCurrentUrlButton = document.getElementById('getCurrentUrlButton');
    
    // Elements for tab navigation
    const codeSamplesTab = document.getElementById('codeSamplesTab');
    const questionsTab = document.getElementById('questionsTab');
    const codeSamplesSection = document.getElementById('codeSamplesSection');
    const questionsSection = document.getElementById('questionsSection');

    // Function to switch to the "Code Samples" view
    function showCodeSamples() {
        codeSamplesTab.classList.add('active');
        questionsTab.classList.remove('active');
        codeSamplesSection.classList.add('active');
        questionsSection.classList.remove('active');
    }

    // Function to switch to the "Questions" view
    function showQuestions() {
        codeSamplesTab.classList.remove('active');
        questionsTab.classList.add('active');
        codeSamplesSection.classList.remove('active');
        questionsSection.classList.add('active');
    }

    // Event listeners for the tabs
    codeSamplesTab.addEventListener('click', showCodeSamples);
    questionsTab.addEventListener('click', showQuestions);

    // Retrieve the current URL when the page loads
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

    // Add event listener for the "Get Current URL" button
    getCurrentUrlButton.addEventListener('click', function() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            const activeTab = tabs[0];
            if (activeTab && activeTab.url) {
                document.getElementById('url').textContent = activeTab.url;
                chrome.storage.local.set({ currentUrl: activeTab.url });
                
                // Load and display saved links for the newly retrieved URL
                chrome.storage.local.get([activeTab.url], function(data) {
                    const links = data[activeTab.url] || [];
                    linksContainer.innerHTML = '';  // Clear previous entries
                    links.forEach(linkObj => {
                        addLinkToDisplay(linkObj.title, linkObj.link, linkObj.language);
                    });
                });
            }
        });
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
