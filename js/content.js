// console.log("Content script loaded");

// ////////////////////////////////////////////////////////////////////////////
// // Hidden reload button 
// ////////////////////////////////////////////////////////////////////////////

// const hiddenResetButton = document.createElement("div");
// hiddenResetButton.setAttribute("id", "reload");
// document.body.append(hiddenResetButton);

// // Function to visually see the reload button
// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//     if (request.message) {
//         const makeVisible = document.getElementById('reload');
//         makeVisible.classList.toggle('isVisible');
//         console.log('Reveal!');
//     }
    
//     // Handle timeout enable/disable messages
//     if (request.type === "toggleTimeout") {
//         console.log("Timeout toggle received:", request.disabled);
//         handleTimeoutToggle(request.disabled);
//     }
    
//     // Handle button styling updates
//     if (request.type === "updateButtonStyling") {
//         console.log("Button styling update received:", request.styling);
//         updateButtonStyling(request.styling);
//     }
    
//     // Handle corner radius updates
//     if (request.type === "updateCornerRadius") {
//         console.log("Corner radius update received:", request.cornerRadius);
//         updateButtonCornerRadius(request.cornerRadius);
//     }
// });

// // Reload page when the hidden button is clicked
// document.getElementById('reload').addEventListener('click', () => {
//     reloadPageOrRedirect();
// });

// ////////////////////////////////////////////////////////////////////////////
// // Function to reload page or redirect based on user input
// ////////////////////////////////////////////////////////////////////////////
// function reloadPageOrRedirect() {
//     chrome.storage.local.get(["userInput"], (result) => {
//         let userInput = result.userInput;
//         console.log("Root URL: " + userInput);

//         if (userInput) {
//             if (userInput.trim() !== '') {
//                 window.location.assign(userInput); 
//             } else {
//                 window.location.reload(true); 
//             }
//         } else {
//             window.location.reload(true); 
//         }
//     });
// }

// ////////////////////////////////////////////////////////////////////////////
// // Timeout functions to reset page after 'X' amount of seconds
// ////////////////////////////////////////////////////////////////////////////

// let timeoutID;
// let timeLeft = 10;
// let timeOutTotalTime = 60000;
// let intervalId = null;
// let timeoutDisabled = false;

// // Creating modal elements
// const modalBackground = document.createElement("div");
// modalBackground.setAttribute("id", "modalBackground");

// const timeoutModal = document.createElement("div");
// timeoutModal.setAttribute("id", "timerWrapper");

// const copy = document.createElement("h3");
// copy.setAttribute("id", "headerCopy");
// copy.textContent = "Are you still there?";

// const timer = document.createElement("span");
// timer.setAttribute("id", "timer");

// const continueButton = document.createElement("button");
// continueButton.setAttribute("id", "continue");
// continueButton.textContent = 'Continue';

// const restartButton = document.createElement("button");
// restartButton.setAttribute("id", "restart");
// restartButton.textContent = 'Restart';

// const imgEyes = document.createElement('img');
// imgEyes.setAttribute("id", "eyesImage");
// imgEyes.src = chrome.runtime.getURL('img/eyes.gif');

// // Append modal elements
// timeoutModal.appendChild(imgEyes);
// timeoutModal.appendChild(copy);
// timeoutModal.appendChild(continueButton);
// timeoutModal.appendChild(restartButton); 
// timeoutModal.appendChild(timer);
// document.body.appendChild(timeoutModal);
// document.body.appendChild(modalBackground);

// // Prevent click from triggering resetTimer
// restartButton.addEventListener('click', (event) => {
//     event.stopPropagation(); 
//     reloadPageOrRedirect();
// });

// // Activity that keeps the page live
// function setup() {
//     window.addEventListener("click", (event) => resetTimer(event), false);
//     window.addEventListener("mousedown", (event) => resetTimer(event), false);
//     window.addEventListener("keypress", (event) => resetTimer(event), false);
//     window.addEventListener("DOMMouseScroll", (event) => resetTimer(event), false);
//     window.addEventListener("mousewheel", (event) => resetTimer(event), false);
//     window.addEventListener("touchmove", (event) => resetTimer(event), false);
//     window.addEventListener("MSPointerMove", (event) => resetTimer(event), false);
//     startTimer();
//     console.log("Setup function");
// }

// // Function to update button styling
// function updateButtonStyling(styling) {
//     continueButton.style.backgroundColor = styling.continueBgColor;
//     continueButton.style.color = styling.continueTextColor;
//     restartButton.style.backgroundColor = styling.restartBgColor;
//     restartButton.style.color = styling.restartTextColor;
// }

// // Function to update button corner radius
// function updateButtonCornerRadius(radiusValue) {
//     const continueBtn = document.getElementById('continue');
//     const restartBtn = document.getElementById('restart');
    
//     if (continueBtn) {
//         continueBtn.style.borderRadius = `${radiusValue}px`;
//         console.log(`Updated continue button border radius to ${radiusValue}px`);
//     }
    
//     if (restartBtn) {
//         restartBtn.style.borderRadius = `${radiusValue}px`;
//         console.log(`Updated restart button border radius to ${radiusValue}px`);
//     }
// }

// // Function to handle timeout toggle
// function handleTimeoutToggle(disabled) {
//     timeoutDisabled = disabled;
    
//     if (disabled) {
//         // Clear any existing timers
//         clearTimeout(timeoutID);
//         clearInterval(intervalId);
        
//         // Hide the modal if it's showing
//         timeoutModal.style.display = 'none';
//         timer.style.display = 'none';
//         modalBackground.style.display = 'none';
        
//         console.log("Timeout disabled - timers cleared");
//     } else {
//         // Re-enable timeout by starting the timer
//         startTimer();
//         console.log("Timeout enabled - timer started");
//     }
// }

// // Initialize timeout based on stored setting
// chrome.storage.local.get(['disableTimeout', 'buttonStyling', 'cornerRadius'], (result) => {
//     // Default to false (timeout enabled) if no setting exists
//     timeoutDisabled = result.disableTimeout === true;
    
//     // Apply button styling from storage or use defaults
//     const styling = result.buttonStyling || {
//         continueBgColor: '#007bff',
//         continueTextColor: '#ffffff',
//         restartBgColor: '#dc3545',
//         restartTextColor: '#ffffff'
//     };
//     updateButtonStyling(styling);
    
//     // Apply saved corner radius
//     const savedRadius = result.cornerRadius || 0;
//     updateButtonCornerRadius(savedRadius);

//     if (!timeoutDisabled) {
//         setup();
//     } else {
//         console.log("Timeout is disabled by user setting.");
//     }
// });

// // Main timeout function
// function startTimer() {
//     if (timeoutDisabled) {
//         console.log("Timer not started - timeout is disabled");
//         return;
//     }
    
//     timeoutID = setTimeout(goInactive, timeOutTotalTime);
//     console.log("StartTimer function");
// }

// // Clear modal and reset timer
// function resetTimer(event) {
//     if (event && event.target.id === 'restart') {
//         return; 
//     }

//     timeoutModal.style.display = 'none';
//     timer.style.display = 'none';
//     modalBackground.style.display = 'none';

//     console.log("ResetTimer function");

//     clearInterval(intervalId);
//     clearTimeout(timeoutID);
    
//     // Only restart timer if timeout is not disabled
//     if (!timeoutDisabled) {
//         startTimer();
//     }
// }

// function goInactive() {
//     if (timeoutDisabled) {
//         console.log("goInactive called but timeout is disabled");
//         return;
//     }
    
//     timer.style.display = 'table';
//     timeoutModal.classList.add('fadeInModal');
//     timeLeft = 10;  
  
//     intervalId = setInterval(() => {
//         // Display the elements - Set them here to make sure the counter displays on the first interval 
//         timeoutModal.style.display = 'block';
//         timer.style.display = 'table';
//         continueButton.style.display = 'block';
//         restartButton.style.display = 'block';
//         modalBackground.style.display = 'block';

//         timer.innerHTML = String(timeLeft);
//         console.log("Countdown: " + timeLeft);
//         timeLeft--;

//         if (timeLeft < 0) {
//             clearInterval(intervalId);
//             reloadPageOrRedirect();
//         }
//     }, 1000);
// }






console.log("Content script loaded");

////////////////////////////////////////////////////////////////////////////
// Hidden reload button 
////////////////////////////////////////////////////////////////////////////

const hiddenResetButton = document.createElement("div");
hiddenResetButton.setAttribute("id", "reload");
document.body.append(hiddenResetButton);

// Function to visually see the reload button
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.message) {
        const makeVisible = document.getElementById('reload');
        makeVisible.classList.toggle('isVisible');
        console.log('Reveal!');
    }
    
    // Handle timeout enable/disable messages
    if (request.type === "toggleTimeout") {
        console.log("Timeout toggle received:", request.disabled);
        handleTimeoutToggle(request.disabled);
    }
    
    // Handle button styling updates
    if (request.type === "updateButtonStyling") {
        console.log("Button styling update received:", request.styling);
        updateButtonStyling(request.styling);
    }
    
    // Handle corner radius updates
    if (request.type === "updateCornerRadius") {
        console.log("Corner radius update received:", request.cornerRadius);
        updateButtonCornerRadius(request.cornerRadius);
    }
    
    // Handle timeout duration updates
    if (request.type === "updateTimeoutDuration") {
        console.log("Timeout duration update received:", request.timeoutDuration);
        updateTimeoutDuration(request.timeoutDuration);
    }
});

// Reload page when the hidden button is clicked
document.getElementById('reload').addEventListener('click', () => {
    reloadPageOrRedirect();
});

////////////////////////////////////////////////////////////////////////////
// Function to reload page or redirect based on user input
////////////////////////////////////////////////////////////////////////////
function reloadPageOrRedirect() {
    chrome.storage.local.get(["userInput"], (result) => {
        let userInput = result.userInput;
        console.log("Root URL: " + userInput);

        if (userInput && userInput.trim() !== '') {
            // Ensure the URL has a protocol
            let finalUrl = userInput.trim();
            
            // If it doesn't start with http:// or https://, add https://
            if (!finalUrl.match(/^https?:\/\//i)) {
                finalUrl = 'https://' + finalUrl;
            }
            
            console.log("Redirecting to: " + finalUrl);
            window.location.href = finalUrl;
        } else {
            console.log("No URL set, reloading current page");
            window.location.reload(true); 
        }
    });
}

////////////////////////////////////////////////////////////////////////////
// Timeout functions to reset page after 'X' amount of seconds
////////////////////////////////////////////////////////////////////////////

let timeoutID;
let timeLeft = 10;
let timeOutTotalTime = 60000;
let intervalId = null;
let timeoutDisabled = false;

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

const restartButton = document.createElement("button");
restartButton.setAttribute("id", "restart");
restartButton.textContent = 'Restart';

const imgEyes = document.createElement('img');
imgEyes.setAttribute("id", "eyesImage");
imgEyes.src = chrome.runtime.getURL('img/eyes.gif');

// Append modal elements
timeoutModal.appendChild(imgEyes);
timeoutModal.appendChild(copy);
timeoutModal.appendChild(continueButton);
timeoutModal.appendChild(restartButton); 
timeoutModal.appendChild(timer);
document.body.appendChild(timeoutModal);
document.body.appendChild(modalBackground);

// Prevent click from triggering resetTimer
restartButton.addEventListener('click', (event) => {
    event.stopPropagation(); 
    reloadPageOrRedirect();
});

// Activity that keeps the page live
function setup() {
    window.addEventListener("click", (event) => resetTimer(event), false);
    window.addEventListener("mousedown", (event) => resetTimer(event), false);
    window.addEventListener("keypress", (event) => resetTimer(event), false);
    window.addEventListener("DOMMouseScroll", (event) => resetTimer(event), false);
    window.addEventListener("mousewheel", (event) => resetTimer(event), false);
    window.addEventListener("touchmove", (event) => resetTimer(event), false);
    window.addEventListener("MSPointerMove", (event) => resetTimer(event), false);
    startTimer();
    console.log("Setup function");
}

// Function to update button styling
function updateButtonStyling(styling) {
    continueButton.style.backgroundColor = styling.continueBgColor;
    continueButton.style.color = styling.continueTextColor;
    restartButton.style.backgroundColor = styling.restartBgColor;
    restartButton.style.color = styling.restartTextColor;
}

// Function to update button corner radius
function updateButtonCornerRadius(radiusValue) {
    const continueBtn = document.getElementById('continue');
    const restartBtn = document.getElementById('restart');
    
    if (continueBtn) {
        continueBtn.style.borderRadius = `${radiusValue}px`;
        console.log(`Updated continue button border radius to ${radiusValue}px`);
    }
    
    if (restartBtn) {
        restartBtn.style.borderRadius = `${radiusValue}px`;
        console.log(`Updated restart button border radius to ${radiusValue}px`);
    }
}

// Function to update timeout duration
function updateTimeoutDuration(durationSeconds) {
    timeOutTotalTime = durationSeconds * 1000; // Convert seconds to milliseconds
    console.log(`Updated timeout duration to ${durationSeconds} seconds (${timeOutTotalTime}ms)`);
    
    // If timer is currently running, restart it with new duration
    if (!timeoutDisabled) {
        clearTimeout(timeoutID);
        startTimer();
    }
}

// Function to handle timeout toggle
function handleTimeoutToggle(disabled) {
    timeoutDisabled = disabled;
    
    if (disabled) {
        // Clear any existing timers
        clearTimeout(timeoutID);
        clearInterval(intervalId);
        
        // Hide the modal if it's showing
        timeoutModal.style.display = 'none';
        timer.style.display = 'none';
        modalBackground.style.display = 'none';
        
        console.log("Timeout disabled - timers cleared");
    } else {
        // Re-enable timeout by starting the timer
        startTimer();
        console.log("Timeout enabled - timer started");
    }
}

// Initialize timeout based on stored setting
chrome.storage.local.get(['disableTimeout', 'buttonStyling', 'cornerRadius', 'timeoutDuration'], (result) => {
    // Default to false (timeout enabled) if no setting exists
    timeoutDisabled = result.disableTimeout === true;
    
    // Apply button styling from storage or use defaults
    const styling = result.buttonStyling || {
        continueBgColor: '#007bff',
        continueTextColor: '#ffffff',
        restartBgColor: '#dc3545',
        restartTextColor: '#ffffff'
    };
    updateButtonStyling(styling);
    
    // Apply saved corner radius
    const savedRadius = result.cornerRadius || 0;
    updateButtonCornerRadius(savedRadius);
    
    // Apply saved timeout duration (default 60 seconds)
    const savedDuration = result.timeoutDuration || 60;
    timeOutTotalTime = savedDuration * 1000; // Convert to milliseconds
    console.log(`Loaded timeout duration: ${savedDuration} seconds`);

    if (!timeoutDisabled) {
        setup();
    } else {
        console.log("Timeout is disabled by user setting.");
    }
});

// Main timeout function
function startTimer() {
    if (timeoutDisabled) {
        console.log("Timer not started - timeout is disabled");
        return;
    }
    
    timeoutID = setTimeout(goInactive, timeOutTotalTime);
    console.log("StartTimer function");
}

// Clear modal and reset timer
function resetTimer(event) {
    if (event && event.target.id === 'restart') {
        return; 
    }

    timeoutModal.style.display = 'none';
    timer.style.display = 'none';
    modalBackground.style.display = 'none';

    console.log("ResetTimer function");

    clearInterval(intervalId);
    clearTimeout(timeoutID);
    
    // Only restart timer if timeout is not disabled
    if (!timeoutDisabled) {
        startTimer();
    }
}

function goInactive() {
    if (timeoutDisabled) {
        console.log("goInactive called but timeout is disabled");
        return;
    }
    
    timer.style.display = 'table';
    timeoutModal.classList.add('fadeInModal');
    timeLeft = 10;  
  
    intervalId = setInterval(() => {
        // Display the elements - Set them here to make sure the counter displays on the first interval 
        timeoutModal.style.display = 'block';
        timer.style.display = 'table';
        continueButton.style.display = 'block';
        restartButton.style.display = 'block';
        modalBackground.style.display = 'block';

        timer.innerHTML = String(timeLeft);
        console.log("Countdown: " + timeLeft);
        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(intervalId);
            reloadPageOrRedirect();
        }
    }, 1000);
}