console.log("Content script loaded");

////////////////////////////////////////////////////////////////////////////
// Hidden reload button 
////////////////////////////////////////////////////////////////////////////

const hiddenResetButton = document.createElement("div");
hiddenResetButton.setAttribute("id", "reload93451");
document.body.append(hiddenResetButton);

// Function to visually see the reload button
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.message) {
        const makeVisible = document.getElementById('reload93451');
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

// reload page when the hidden button is clicked
document.getElementById('reload93451').addEventListener('click', () => {
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
modalBackground.setAttribute("id", "modalBackground993451");

const timeoutModal = document.createElement("div");
timeoutModal.setAttribute("id", "timerWrapper93451");

const copy = document.createElement("h3");
copy.setAttribute("id", "headerCopy93451");
copy.textContent = "Are you still there?";

const timer993451 = document.createElement("span");
timer993451.setAttribute("id", "timer993451");

const continueButton = document.createElement("button");
continueButton.setAttribute("id", "continue993451");
continueButton.textContent = 'Continue';

const restartButton = document.createElement("button");
restartButton.setAttribute("id", "restart993451");
restartButton.textContent = 'Restart';

const imgEyes = document.createElement('img');
imgEyes.setAttribute("id", "eyesImage93451");
imgEyes.src = chrome.runtime.getURL('img/eyes.gif');

// Append modal elements
timeoutModal.appendChild(imgEyes);
timeoutModal.appendChild(copy);
timeoutModal.appendChild(continueButton);
timeoutModal.appendChild(restartButton); 
timeoutModal.appendChild(timer993451);
document.body.appendChild(timeoutModal);
document.body.appendChild(modalBackground);

// Restart button reloads page or redirects
restartButton.addEventListener('click', (event) => {
    event.stopPropagation(); 
    reloadPageOrRedirect();
});

// Activity that keeps the page live
function setup() {
    window.addEventListener("click", resetTimer, false);
    window.addEventListener("mousedown", resetTimer, false);
    window.addEventListener("keypress", resetTimer, false);
    window.addEventListener("DOMMouseScroll", resetTimer, false);
    window.addEventListener("mousewheel", resetTimer, false);
    window.addEventListener("touchmove", resetTimer, false);
    window.addEventListener("MSPointerMove", resetTimer, false);
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
    const continueBtn = document.getElementById('continue993451');
    const restartBtn = document.getElementById('restart993451');
    
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
    timeOutTotalTime = durationSeconds * 1000; 
    console.log(`Updated timeout duration to ${durationSeconds} seconds (${timeOutTotalTime}ms)`);
    
    if (!timeoutDisabled) {
        clearTimeout(timeoutID);
        startTimer();
    }
}

// Function to handle timeout toggle
function handleTimeoutToggle(disabled) {
    timeoutDisabled = disabled;
    
    if (disabled) {
        clearTimeout(timeoutID);
        clearInterval(intervalId);
        
        timeoutModal.style.display = 'none';
        timer993451.style.display = 'none';
        modalBackground.style.display = 'none';
        
        console.log("Timeout disabled - timers cleared");
    } else {
        startTimer();
        console.log("Timeout enabled - timer started");
    }
}

// Initialize timeout based on stored setting
chrome.storage.local.get(['disableTimeout', 'buttonStyling', 'cornerRadius', 'timeoutDuration'], (result) => {
    timeoutDisabled = result.disableTimeout === true;
    
    const styling = result.buttonStyling || {
        continueBgColor: '#007bff',
        continueTextColor: '#ffffff',
        restartBgColor: '#dc3545',
        restartTextColor: '#ffffff'
    };
    updateButtonStyling(styling);
    
    const savedRadius = result.cornerRadius || 0;
    updateButtonCornerRadius(savedRadius);
    
    const savedDuration = result.timeoutDuration || 60;
    timeOutTotalTime = savedDuration * 1000; 
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
    if (event && event.target.id === 'restart993451') {
        return; 
    }

    timeoutModal.style.display = 'none';
    timer993451.style.display = 'none';
    modalBackground.style.display = 'none';

    console.log("ResetTimer function");

    clearInterval(intervalId);
    clearTimeout(timeoutID);
    
    if (!timeoutDisabled) {
        startTimer();
    }
}

function goInactive() {
    if (timeoutDisabled) {
        console.log("goInactive called but timeout is disabled");
        return;
    }
    
    timer993451.style.display = 'table';
    timeoutModal.classList.add('fadeInModal993451');
    timeLeft = 10;  
  
    intervalId = setInterval(() => {
        timeoutModal.style.display = 'block';
        timer993451.style.display = 'table';
        continueButton.style.display = 'block';
        restartButton.style.display = 'block';
        modalBackground.style.display = 'block';

        timer993451.innerHTML = String(timeLeft);
        console.log("Countdown: " + timeLeft);
        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(intervalId);
            reloadPageOrRedirect();
        }
    }, 1000);
}
