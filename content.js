console.log("Content script loaded");

////////////////////////////////////////////////////////////////////////////
// Hidden reload button 
////////////////////////////////////////////////////////////////////////////

// // Hidden reload button
const hiddenResetButton = document.createElement("div");
hiddenResetButton.setAttribute("id", "reload");
document.body.append(hiddenResetButton); 

// Function to visually see the reload button
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.message) {
        const makeVisable = document.getElementById('reload');
        makeVisable.classList.toggle('isVisible');
        console.log('Reveal!');
    }
});

// Reload page when clicked
document.getElementById('reload')
.addEventListener('click', () => {
    // window.location.reload(true);

    chrome.storage.local.get(["userInput"], (result) => {
        let userInput = result.userInput;
        console.log("User input is " + userInput);

        if (userInput) {
            if (userInput.trim() !== '') {
                window.location.assign(userInput); // Redirect to the specified URL
            } else {
                window.location.reload(true); // Reload the current page
            }
        } else {
            window.location.reload(true); // Reload the current page if no userInput is stored
        }
    });
});








////////////////////////////////////////////////////////////////////////////
// Timeout functions to reset page after 'X' amount of seconds
////////////////////////////////////////////////////////////////////////////

// Variables for timeout function
let timeoutID;
let timeLeft = 10;
let timeOutTotalTime = 60000; 
let intervalId = null;


// Creating modal elements
const modalBackground = document.createElement("div");
modalBackground.setAttribute("id", "modalBackground");

const timeoutModal = document.createElement("div");
timeoutModal.setAttribute("id", "timerWrapper");

const copy = document.createElement("h3");
copy.setAttribute("id", "headerCopy");
copy.textContent = "Are you still there?";

const timer = document.createElement("span");
timer.setAttribute("id", "timer");

const continueButton = document.createElement("button");
continueButton.setAttribute("id", "continue");
continueButton.textContent = 'Continue';


// activity that keeps the page live
function setup() {
    window.addEventListener("onClick", resetTimer, false);
    window.addEventListener("mousedown", resetTimer, false);
    window.addEventListener("keypress", resetTimer, false);
    window.addEventListener("DOMMouseScroll", resetTimer, false);
    window.addEventListener("mousewheel", resetTimer, false);
    window.addEventListener("touchmove", resetTimer, false);
    window.addEventListener("MSPointerMove", resetTimer, false);
    startTimer();
    console.log("Setup function");
}
setup();

// main timeout function
function startTimer() {
    timeoutID = setTimeout(goInactive, timeOutTotalTime); 
    console.log("StartTimer fuction");
}

// clear modal and reset timer
function resetTimer() {
    timeoutModal.style.display = 'none';
    timer.style.display = 'none';
    modalBackground.style.display = 'none';

    console.log("ResetTimer function");

    clearInterval(intervalId);
    clearTimeout(timeoutID);
    startTimer();
}


// modal pop up and will reset the page if no activity
function goInactive() {
     document.body
        .appendChild(timeoutModal)
        .appendChild(copy)
        .appendChild(continueButton);

        document.body.appendChild(timer);
        document.body.appendChild(modalBackground);
        timeoutModal.classList.add('fadeInModal'); 
    
    intervalId = setInterval(() => {   
        console.log("goInactive function");

        // Display the elements
        timeoutModal.style.display = 'block';
        timer.style.display = 'table';
        continueButton.style.display = 'block';
        modalBackground.style.display = 'block';

        timer.innerHTML = String(timeLeft);
        timeLeft--;

        if (timeLeft === 0) {
            chrome.storage.local.get(["userInput"], (result) => {
                let userInput = result.userInput;
                console.log("User input is " + userInput);
        
                if (userInput) {
                    if (userInput.trim() !== '') {
                        window.location.assign(userInput); // Redirect to the specified URL
                    } else {
                        window.location.reload(true); // Reload the current page
                    }
                } else {
                    window.location.reload(true); // Reload the current page if no userInput is stored
                }
            });
        }
        
    }, 1000);
    timeLeft = 10;
}




















////////////////////////////////////////////////////////////////////////////
// Radio buttons for positioning
////////////////////////////////////////////////////////////////////////////

// // Save radio button state to local storage
// const reloadButton = document.getElementById("reload");
// const radioButtons = document.querySelectorAll('input[name="selectHiddenButtonPositioning"]');

// // Function to save the selected radio button state and button position to chrome storage
// // function saveSettings() {
// //     let selectedPosition = document.querySelector('input[name="selectHiddenButtonPositioning"]:checked');
// //     if (selectedPosition) {
// //         chrome.storage.local.set({ 'selectedPosition': selectedPosition.value });
// //         chrome.storage.local.set({ 'buttonPosition': reloadButton.className });
// //     }
// // }

// // Add event listener to handle messages from the popup
// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//     if (request.selectedPosition) {
//         updateButtonStyle(request.selectedPosition);
//         console.log('Content event listener -  Gate 5');
//     }
// });



// // Function to load the selected radio button state and button position from chrome storage
// function loadSettings() {
//     chrome.storage.local.get(['selectedPosition', 'buttonPosition'], function(result) {
//         let selectedPosition = result.selectedPosition;
//         let buttonPosition = result.buttonPosition;
//         if (selectedPosition && buttonPosition) {
//             document.getElementById(selectedPosition).checked = true;
//             let reloadButton = document.getElementById("reload");
//             reloadButton.className = buttonPosition; // Set the class name of the reload button
//             console.log("Selected position: " + selectedPosition);
//             console.log("Button position: " + buttonPosition);
//         }
//     });
// }

// // Function to update button style based on selected position
// function updateButtonStyle(selectedPosition) {
//     let reloadButton = document.getElementById("reload");

//     // Remove all previous positioning classes
//     reloadButton.classList.remove("hiddenResetButtonTopLeft", "hiddenResetButtonTopRight", "hiddenResetButtonBottomLeft", "hiddenResetButtonBottomRight");

//     // Apply appropriate positioning class based on the selected position
//     switch (selectedPosition) {
//         case 'topLeft':
//             reloadButton.classList.add("hiddenResetButtonTopLeft");
//             console.log('Content switch - Gate 1');
//             break;
//         case 'topRight':
//             reloadButton.classList.add("hiddenResetButtonTopRight");
//             console.log('Content switch - Gate 2');
//             break;
//         case 'bottomLeft':
//             reloadButton.classList.add("hiddenResetButtonBottomLeft");
//             console.log('Content switch - Gate 3');
//             break;
//         case 'bottomRight':
//             reloadButton.classList.add("hiddenResetButtonBottomRight");
//             console.log('Content switch - Gate 4');
//             break;
//         default:
//             // Default case if no position is selected
//             break;
//     }
//     // Save the button position to Chrome storage
//     chrome.storage.local.set({ 'buttonPosition': reloadButton.className });
// }

