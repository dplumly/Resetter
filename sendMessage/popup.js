console.log('popup.js startup');


document.addEventListener('DOMContentLoaded', () => {
    let sendMessageBtn = document.getElementById('hiddenResetButtonSizeCheck');

    sendMessageBtn.addEventListener('click', () => {
        let messageToSend = true;
        
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {message: messageToSend}, function(response) {
                console.log("Message sent from popup script");
            });
        });
    });
});















