 ////////////////////////////////////////////////////////////////////////////
// Send message to content.js - https://stackoverflow.com/questions/29926598/sendmessage-from-popup-to-content-js-not-working-in-chrome-extension
console.log('popup.js loaded');

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

// Retrieve Data from Storage (optional, to display stored data when the extension is loaded):
// This code should be placed inside a function that runs when the extension popup is opened or when needed.
chrome.storage.local.get('userInput', (result) => {
    let userInput = result.userInput;
    if (userInput) {
        document.getElementById('storedHomepage').textContent = userInput;
    } else {
        document.getElementById('inputStatus').textContent = 'No input stored';
    }
});















// document.getElementById('saveButton').addEventListener('click', () => {
//     userInput = document.getElementById('userInputField').value.trim();

//     if (userInput !== '') {
//         localStorage.setItem('userInput', userInput);
//         document.getElementById('storedHomepage').textContent = userInput;
//         document.getElementById('inputStatus').textContent = 'Input saved successfully.';

//         console.log(userInput);
//         // Remove the user input
//         document.getElementById('removeButton').addEventListener('click', () => {
//                 localStorage.removeItem('userInput');
//                 document.getElementById('inputStatus').textContent = 'Input removed';
//                 document.getElementById('storedHomepage').textContent = '';
//                 userInput = null;
//                 localStorage.clear();
//                 document.getElementById('userInputField').value = '';
//                 console.log('removed function');
//             });
//     }
// });

// document.getElementById('saveButton').addEventListener('click', () => {
//     userInput = document.getElementById('userInputField').value.trim();

//     if (userInput !== '') {
//         localStorage.setItem('userInput', userInput);
//         document.getElementById('storedHomepage').textContent = userInput;
//         document.getElementById('inputStatus').textContent = 'Input saved successfully.';

//         console.log(userInput);
//         // Remove the user input
//         document.getElementById('removeButton').addEventListener('click', () => {
//                 localStorage.removeItem('userInput');
//                 document.getElementById('inputStatus').textContent = 'Input removed';
//                 document.getElementById('storedHomepage').textContent = '';
//                 userInput = null;
//                 localStorage.clear();
//                 document.getElementById('userInputField').value = '';
//                 console.log('removed function');
//             });
//     }
// });







