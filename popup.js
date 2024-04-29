 ////////////////////////////////////////////////////////////////////////////
// Send message to content.js - https://stackoverflow.com/questions/29926598/sendmessage-from-popup-to-content-js-not-working-in-chrome-extension




// (async () => {
//     const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
//     const response = await chrome.tabs.sendMessage(tab.id, {greeting: "hello"});
//     // do something with response here, not outside the function
//     console.log(response);
//   })();







 // Retrieve stored input from localStorage (if any)
 document.getElementById('storedHomepage').textContent = localStorage.getItem('userInput') || 'No input stored';

 let userInput;

 document.getElementById('removeButton').addEventListener('click', () => {
    localStorage.removeItem('userInput');
    document.getElementById('inputStatus').textContent = 'Input removed';
    document.getElementById('storedHomepage').textContent = '';
    userInput = null;
    localStorage.clear();
    document.getElementById('userInputField').value = '';

    console.log('removed function');
});


 document.getElementById('saveButton').addEventListener('click', () => {
    userInput = document.getElementById('userInputField').value;

    localStorage.setItem('userInput', userInput);
    document.getElementById('storedHomepage').textContent = userInput;

    console.log(userInput);

      if (userInput.trim() !== '') {
        localStorage.setItem('userInput', userInput);
        
        document.getElementById('storedHomepage').textContent = userInput;
        document.getElementById('inputStatus').textContent = 'Input saved successfully.';

    } else {
        document.getElementById('inputStatus').textContent = 'Please enter some input.';
        window.location.reload(true);
    }
});


////////////////////////////////////////////////////////////////////////////

// //Hidden Reload Button Visability
const selectHiddenButton = document.getElementById('hiddenResetButtonSizeCheck');
selectHiddenButton.addEventListener('click', () => {
    const makeVisable = document.getElementById('reload');
    makeVisable.classList.toggle('hiddenResetButtonVisualCheck');
    console.log('Reveal!');
});


// Hidden reload button
const hiddenResetButton = document.createElement("div");
hiddenResetButton.setAttribute("id", "reload");
document.body.append(hiddenResetButton); 


// Reload page when clicked
document.getElementById('reload')
.addEventListener('click', () => {
    window.location.reload(true);
});


////////////////////////////////////////////////////////////////////////////

// Save radio button state to local storage
const reloadButton = document.getElementById("reload");
const radioButtons = document.querySelectorAll('input[name="selectHiddenButtonPositioning"]');

// Function to save the selected radio button state and button position to local storage
function saveSettings() {
    let selectedPosition = document.querySelector('input[name="selectHiddenButtonPositioning"]:checked');
    if (selectedPosition) {
        localStorage.setItem('selectedPosition', selectedPosition.value);
        localStorage.setItem('buttonPosition', reloadButton.className);
    }
}

// Function to load the selected radio button state and button position from local storage
function loadSettings() {
    let selectedPosition = localStorage.getItem('selectedPosition');
    let buttonPosition = localStorage.getItem('buttonPosition');
    if (selectedPosition) {
        document.getElementById(selectedPosition).checked = true;
        reloadButton.className = buttonPosition;
        updateButtonStyle(selectedPosition);
        console.log("Selected position: " + selectedPosition);
        console.log("Button position: " + buttonPosition);
    }
}

// Function to update button style based on selected position
function updateButtonStyle(selectedPosition) {
    reloadButton.classList.remove("hiddenResetButtonTopLeft", "hiddenResetButtonBottomLeft", "hiddenResetButtonBottomRight", "hiddenResetButtonTopRight");
    switch (selectedPosition) {
        case 'topLeft':
            reloadButton.classList.add("hiddenResetButtonTopLeft");
            console.log('top left popup');
            break;
        case 'bottomLeft':
            reloadButton.classList.add("hiddenResetButtonBottomLeft");
            console.log('bottom left popup');
            break;
        case 'bottomRight':
            reloadButton.classList.add("hiddenResetButtonBottomRight");
            console.log('bottom right popup');
            break;
        case 'topRight':
            reloadButton.classList.add("hiddenResetButtonTopRight");
            console.log('top right popup');
    }
}

// Add event listeners to radio buttons
radioButtons.forEach(function(radio) {
    radio.addEventListener('change', function() {
        saveSettings();
        updateButtonStyle(this.value);
    });
});

// Load selected position and button position when the page loads
window.addEventListener('load', function() {
    loadSettings();
});
