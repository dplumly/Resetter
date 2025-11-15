// console.log('popup.js loaded');

////////////////////////////////////////////////////////////////////////////
// Single Home URL Management (Redirect + Exclusion)
////////////////////////////////////////////////////////////////////////////

// Save home URL (serves both purposes)
document.getElementById('saveButton').addEventListener('click', () => {
    let homeUrl = document.getElementById('homeUrlField').value.trim();
    
    if (homeUrl !== '') {
        chrome.storage.local.set({ 'homeUrl': homeUrl }, () => {
            document.getElementById('storedHomeUrl').textContent = homeUrl;
            document.getElementById('inputStatus').textContent = 'Home URL saved successfully.';
            
            // Notify content script to check if timeout should be disabled
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { type: "checkHomeStatus" });
            });
        });
    } else {
        document.getElementById('inputStatus').textContent = 'Please enter a home URL.';
    }
});

// Remove home URL
document.getElementById('removeButton').addEventListener('click', () => {
    chrome.storage.local.remove('homeUrl', () => {
        console.log('Home URL removed successfully');
        document.getElementById('inputStatus').textContent = 'Home URL removed';
        document.getElementById('storedHomeUrl').textContent = '';
        document.getElementById('homeUrlField').value = '';
        
        // Notify content script to re-enable timeout
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { type: "checkHomeStatus" });
        });
    });
});

// Load home URL on popup open
chrome.storage.local.get('homeUrl', (result) => {
    let homeUrl = result.homeUrl;
    if (homeUrl) {
        document.getElementById('storedHomeUrl').textContent = homeUrl;
        document.getElementById('homeUrlField').value = homeUrl;
    } else {
        document.getElementById('inputStatus').textContent = 'No home URL stored';
    }
});

////////////////////////////////////////////////////////////////////////////
// Modal Button Styling Settings
////////////////////////////////////////////////////////////////////////////

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
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                type: "updateButtonStyling",
                styling: buttonStyling
            });
        });
    });
});

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
// Timeout Duration Slider
////////////////////////////////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', () => {
    let timeoutDurationSlider = document.getElementById('timeoutDuration');
    let timeoutValueDisplay = document.getElementById('timeoutValue');

    if (timeoutDurationSlider && timeoutValueDisplay) {
        chrome.storage.local.get(['timeoutDuration'], (result) => {
            const savedDuration = result.timeoutDuration || 60;
            timeoutDurationSlider.value = savedDuration;
            timeoutValueDisplay.textContent = savedDuration;
        });

        timeoutDurationSlider.addEventListener('input', () => {
            const durationValue = parseInt(timeoutDurationSlider.value);
            timeoutValueDisplay.textContent = durationValue;
            chrome.storage.local.set({timeoutDuration: durationValue});

            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    type: "updateTimeoutDuration",
                    timeoutDuration: durationValue
                });
            });
        });

        timeoutDurationSlider.addEventListener('change', () => {
            const durationValue = parseInt(timeoutDurationSlider.value);
            chrome.storage.local.set({timeoutDuration: durationValue});
        });
    }
});

////////////////////////////////////////////////////////////////////////////
// Corner Radius Slider for Modal Buttons
////////////////////////////////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', () => {
    let cornerRadiusSlider = document.getElementById('cornerRadius');
    let radiusDisplay = document.getElementById('radiusDisplay');

    if (cornerRadiusSlider && radiusDisplay) {
        chrome.storage.local.get(['cornerRadius'], (result) => {
            const savedRadius = result.cornerRadius || 0;
            cornerRadiusSlider.value = savedRadius;
            radiusDisplay.textContent = `${savedRadius}px`;
        });

        cornerRadiusSlider.addEventListener('input', () => {
            const radiusValue = parseInt(cornerRadiusSlider.value);
            radiusDisplay.textContent = `${radiusValue}px`;
            chrome.storage.local.set({cornerRadius: radiusValue});

            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    type: "updateCornerRadius",
                    cornerRadius: radiusValue
                });
            });
        });

        cornerRadiusSlider.addEventListener('change', () => {
            const radiusValue = parseInt(cornerRadiusSlider.value);
            radiusDisplay.textContent = `${radiusValue}px`;
            chrome.storage.local.set({cornerRadius: radiusValue});
        });
    }
});

////////////////////////////////////////////////////////////////////////////
// Hidden reload button visibility toggle
////////////////////////////////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', () => {
    let sendMessageBtn = document.getElementById('toggleVisibility');

    sendMessageBtn.addEventListener('click', () => {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {message: true});
        });
    });
});

////////////////////////////////////////////////////////////////////////////
// Timeout toggle functionality
////////////////////////////////////////////////////////////////////////////

document.getElementById('disableTImeout').addEventListener('change', (event) => {
    const disabled = event.target.checked;
    chrome.storage.local.set({ 'disableTimeout': disabled }, () => {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                type: "toggleTimeout",
                disabled: disabled
            });
        });
    });
});

chrome.storage.local.get('disableTimeout', (result) => {
    const disabled = result.disableTimeout === true;
    document.getElementById('disableTImeout').checked = disabled;
});