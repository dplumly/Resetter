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
// Modal Button Styling Settings
////////////////////////////////////////////////////////////////////////////

// Save button styling settings
document.getElementById('saveButtonStyling').addEventListener('click', () => {
    const continueBgColor = document.getElementById('continueButtonBgColor').value;
    const continueTextColor = document.getElementById('continueButtonTextColor').value;
    const restartBgColor = document.getElementById('restartButtonBgColor').value;
    const restartTextColor = document.getElementById('restartButtonTextColor').value;
    
    const buttonStyling = {
        continueBgColor,
        continueTextColor,
        restartBgColor,
        restartTextColor
    };
    
    chrome.storage.local.set({ 'buttonStyling': buttonStyling }, () => {
        console.log('Button styling saved:', buttonStyling);
        
        // Send message to content script to update button styling
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                type: "updateButtonStyling",
                styling: buttonStyling
            }, function(response) {
                console.log("Button styling update message sent to content script");
            });
        });
    });
});

// Load button styling settings on popup open
chrome.storage.local.get('buttonStyling', (result) => {
    const styling = result.buttonStyling;
    if (styling) {
        document.getElementById('continueButtonBgColor').value = styling.continueBgColor || '#007bff';
        document.getElementById('continueButtonTextColor').value = styling.continueTextColor || '#ffffff';
        document.getElementById('restartButtonBgColor').value = styling.restartBgColor || '#dc3545';
        document.getElementById('restartButtonTextColor').value = styling.restartTextColor || '#ffffff';
    }
});

////////////////////////////////////////////////////////////////////////////
// Corner Radius Slider for Modal Buttons
////////////////////////////////////////////////////////////////////////////

// Save slider state and send to content script
document.addEventListener('DOMContentLoaded', () => {
    let cornerRadiusSlider = document.getElementById('cornerRadious');
    
    if (cornerRadiusSlider) {
        console.log("Corner radius roundness - Gate 1");

        // Load saved value when popup opens
        chrome.storage.local.get(['cornerRadius'], (result) => {
            if (result.cornerRadius !== undefined) {
                cornerRadiusSlider.value = result.cornerRadius;
            }
        });

        // Listen for slider changes
        cornerRadiusSlider.addEventListener('input', () => {
            const radiusValue = parseInt(cornerRadiusSlider.value);
            console.log("Corner radius roundness - Gate 2, Value:", radiusValue);
            
            // Save the value to storage
            chrome.storage.local.set({cornerRadius: radiusValue});
            
            // Send message to content script
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    type: "updateCornerRadius",
                    cornerRadius: radiusValue
                }, function(response) {
                    if (chrome.runtime.lastError) {
                        console.log("Error sending message:", chrome.runtime.lastError);
                    } else {
                        console.log("Corner radius update sent to content.js");
                    }
                });
            });
        });

        // Also trigger on 'change' for final value
        cornerRadiusSlider.addEventListener('change', () => {
            const radiusValue = parseInt(cornerRadiusSlider.value);
            chrome.storage.local.set({cornerRadius: radiusValue});
        });
    }
});

////////////////////////////////////////////////////////////////////////////
// Sending message to content.js to toggle hidden reload button's visibility
////////////////////////////////////////////////////////////////////////////

// Hidden Reload Button Visibility
document.addEventListener('DOMContentLoaded', () => {
    let sendMessageBtn = document.getElementById('toggleVisibility');
    console.log("Hidden button visibility - Gate 1");

    sendMessageBtn.addEventListener('click', () => {
        let messageToSend = true;
        console.log("Hidden button visibility - Gate 2");
        
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {message: messageToSend}, function(response) {
                console.log("Hidden button visibility - Message sent from popup script");
            });
        });
    });
});

////////////////////////////////////////////////////////////////////////////
// Timeout toggle functionality
////////////////////////////////////////////////////////////////////////////

// Save checkbox state and notify content script
document.getElementById('disableTImeout').addEventListener('change', (event) => {
    const disabled = event.target.checked;
    chrome.storage.local.set({ 'disableTimeout': disabled }, () => {
        console.log('disableTimeout set to', disabled);
        
        // Send message to content script to toggle timeout immediately
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                type: "toggleTimeout",
                disabled: disabled
            }, function(response) {
                console.log("Timeout toggle message sent to content script");
            });
        });
    });
});

// Load checkbox state on popup open
chrome.storage.local.get('disableTimeout', (result) => {
    // Default to false (unchecked/enabled) if no setting exists
    const disabled = result.disableTimeout === true;
    document.getElementById('disableTImeout').checked = disabled;
});