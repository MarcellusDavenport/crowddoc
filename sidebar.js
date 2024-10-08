document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('linkForm');
    const titleInput = document.getElementById('title');
    const linkInput = document.getElementById('link');
    const languageSelect = document.getElementById('language');
    const linksContainer = document.getElementById('linksContainer');
    const getCurrentUrlButton = document.getElementById('getCurrentUrlButton');

    // Elements for questions section
    const questionForm = document.getElementById('questionForm');
    const questionText = document.getElementById('questionText');
    const questionsContainer = document.getElementById('questionsContainer');

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

            // Load and display saved questions for the current URL
            chrome.storage.local.get([currentUrl + '_questions'], function(data) {
                const questions = data[currentUrl + '_questions'] || [];
                questions.forEach(questionObj => {
                    addQuestionToDisplay(questionObj.question, questionObj.answers, questionObj);
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
                
                // Load and display saved links and questions for the newly retrieved URL
                chrome.storage.local.get([activeTab.url], function(data) {
                    const links = data[activeTab.url] || [];
                    linksContainer.innerHTML = '';  // Clear previous entries
                    links.forEach(linkObj => {
                        addLinkToDisplay(linkObj.title, linkObj.link, linkObj.language);
                    });
                });

                chrome.storage.local.get([activeTab.url + '_questions'], function(data) {
                    const questions = data[activeTab.url + '_questions'] || [];
                    questionsContainer.innerHTML = '';  // Clear previous entries
                    questions.forEach(questionObj => {
                        addQuestionToDisplay(questionObj.question, questionObj.answers, questionObj);
                    });
                });
            }
        });
    });

    // Handle form submission for code samples
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

    // Handle form submission for questions
    questionForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const question = questionText.value.trim();
        const currentUrl = document.getElementById('url').textContent;

        if (question && currentUrl !== 'No URL available') {
            // Save new question under the current URL
            chrome.storage.local.get([currentUrl + '_questions'], function(data) {
                const questions = data[currentUrl + '_questions'] || [];
                questions.push({ question, answers: [] });
                chrome.storage.local.set({ [currentUrl + '_questions']: questions }, function() {
                    console.log('Question saved:', question);
                    addQuestionToDisplay(question, [], questions[questions.length - 1]);
                });
            });

            // Clear form
            questionText.value = '';
        }
    });

    function addLinkToDisplay(title, link, language) {
        const entry = document.createElement('div');
        entry.className = 'entry';
        entry.innerHTML = `<a href="${link}" target="_blank">${title}</a> <br> <small>Language: ${language}</small>`;
        linksContainer.appendChild(entry);
    }

    // Display the questions and their answers in a more appealing format
    function addQuestionToDisplay(question, answers, questionObj) {
        const entry = document.createElement('div');
        entry.className = 'entry';
        
        // Display the question
        let htmlContent = `<p style="font-size: 18px">${question}</p>`;

        // Count the number of answers and display it with correct singular/plural
        const answerCount = answers ? answers.length : 0;
        const answerText = answerCount === 1 ? 'Answer' : 'Answers';
        htmlContent += `<p class="answer-heading"><strong>${answerCount} ${answerText}</strong></p>`;

        
        // Loop through the answers array and display each answer as a list item
        if (answers && answers.length > 0) {
            htmlContent += `<ul class="answer-list">`;
            answers.forEach(answerObj => {
                htmlContent += `
                    <li>
                        <p>${answerObj.answer}</p>
                    </li>
                `;
            });
            htmlContent += `</ul>`;
        }
        
        // Add answer button and input field for new answers
        htmlContent += `
            <button class="answerButton">Add Answer</button>
            <div class="answerField" style="display: none;">
                <textarea class="answerInput" placeholder="Enter your answer"></textarea>
                <button class="submitAnswerButton">Submit</button>
                <button class="cancelAnswerButton" style="background-color: #c0392b;margin-left: 10px;">Cancel</button>
            </div>
        `;
        
        entry.innerHTML = htmlContent;
        
        const answerButton = entry.querySelector('.answerButton');
        const answerField = entry.querySelector('.answerField');
        const submitAnswerButton = entry.querySelector('.submitAnswerButton');
        const cancelAnswerButton = entry.querySelector('.cancelAnswerButton');
        const answerInput = entry.querySelector('.answerInput');
        
        // Show the answer field when the "Answer" button is clicked
        answerButton.addEventListener('click', function() {
            answerField.style.display = 'block'; // Show the answer field
            answerButton.style.display = 'none'; // Hide the answer button while answering
        });
        
        // Handle answer submission
        submitAnswerButton.addEventListener('click', function() {
            const answerText = answerInput.value.trim();
            const currentUrl = document.getElementById('url').textContent;
        
            if (answerText !== "" && currentUrl !== 'No URL available') {
                chrome.storage.local.get([currentUrl + '_questions'], function(data) {
                    const questions = data[currentUrl + '_questions'] || [];
                    const index = questions.findIndex(q => q.question === question);
                    
                    if (index !== -1) {
                        if (!questions[index].answers) {
                            questions[index].answers = [];
                        }
        
                        questions[index].answers.push({ answer: answerText });
        
                        chrome.storage.local.set({ [currentUrl + '_questions']: questions }, function() {
                            console.log('Answer saved:', answerText);
        
                            const answerDisplay = document.createElement('li');
                            answerDisplay.innerHTML = `<p>${answerText}</p>`;
                            entry.querySelector('.answer-list').appendChild(answerDisplay);
        
                            // Hide the answer field after submission
                            answerField.style.display = 'none';
                            answerButton.style.display = 'block'; // Show the answer button again
        
                            // Optionally, you can clear the answer input field
                            answerInput.value = '';
                        });
                    }
                });
            }
        });
        
    
        // Handle cancel button click to hide the answer field and show the answer button again
        cancelAnswerButton.addEventListener('click', function() {
            answerField.style.display = 'none'; // Hide the answerField div when "Cancel" is clicked
            answerButton.style.display = 'block'; // Show the answer button again
        });
        
        questionsContainer.appendChild(entry);
    }
});
