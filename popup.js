console.log('popup.js loaded');


////////////////////////////////////////////////////////////////////////////
// Saving data to chrome storage for setting the root URL so after reload goes to current location or root
////////////////////////////////////////////////////////////////////////////

// Save Data to Storage:
document.getElementById('saveButton').addEventListener('click', () => {
    let userInput = document.getElementById('userInputField').value.trim();
    console.log('button saved clicked');

    if (userInput !== '') {
        chrome.storage.local.set({ 'userInput': userInput }, () => {
            console.log('Input saved successfully ' + userInput);
            document.getElementById('storedHomepage').textContent = userInput;
            document.getElementById('inputStatus').textContent = 'Input saved successfully.';
        });
    } else {
        document.getElementById('inputStatus').textContent = 'Please enter some input.';
    }
});


// Remove Data from Storage:
document.getElementById('removeButton').addEventListener('click', () => {
    console.log('button removed clicked');

    chrome.storage.local.remove('userInput', () => {
        console.log('Input removed successfully');
        document.getElementById('inputStatus').textContent = 'Input removed';
        document.getElementById('storedHomepage').textContent = '';
        document.getElementById('userInputField').value = '';
    });
});

// Retrieve Data from Storage 
chrome.storage.local.get('userInput', (result) => {
    let userInput = result.userInput;
    if (userInput) {
        document.getElementById('storedHomepage').textContent = userInput;
    } else {
        document.getElementById('inputStatus').textContent = 'No input stored';
    }
});


////////////////////////////////////////////////////////////////////////////
// Sending message to content.js to toggle hidden reload button's visibility
////////////////////////////////////////////////////////////////////////////

// //Hidden Reload Button Visability
document.addEventListener('DOMContentLoaded', () => {
    let sendMessageBtn = document.getElementById('toggleVisibility');
    console.log("Gate 1");

    sendMessageBtn.addEventListener('click', () => {
        let messageToSend = true;
        console.log("Gate 2");
        
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {message: messageToSend}, function(response) {
                console.log("Message sent from popup script");
            });
        });
    });
});






