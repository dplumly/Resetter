console.log("Content script loaded");

////////////////////////////////////////////////////////////////////////////
// Hidden reload button 
////////////////////////////////////////////////////////////////////////////
const hiddenResetButton = document.createElement("div");
hiddenResetButton.setAttribute("id", "reload93451");
document.body.append(hiddenResetButton);

chrome.runtime.onMessage.addListener(function(request) {
    if (request.message) {
        const makeVisible = document.getElementById('reload93451');
        makeVisible.classList.toggle('isVisible');
        console.log('Reveal!');
    }

    if (request.type === "toggleTimeout") {
        handleTimeoutToggle(request.disabled);
    }

    if (request.type === "updateButtonStyling") {
        updateButtonStyling(request.styling);
    }

    if (request.type === "updateCornerRadius") {
        updateButtonCornerRadius(request.cornerRadius);
    }

    if (request.type === "updateTimeoutDuration") {
        updateTimeoutDuration(request.timeoutDuration);
    }

    if (request.type === "checkHomepageStatus") {
        checkAndUpdateTimeoutStatus();
    }
});

document.getElementById('reload93451').addEventListener('click', () => {
    reloadPageOrRedirect();
});

////////////////////////////////////////////////////////////////////////////
// URL Change Monitoring
////////////////////////////////////////////////////////////////////////////
let currentUrl = window.location.href;

function startURLMonitoring() {
    setInterval(() => {
        const newUrl = window.location.href;
        if (currentUrl !== newUrl) {
            console.log("URL changed:", currentUrl, "→", newUrl);
            currentUrl = newUrl;
            setTimeout(() => checkAndUpdateTimeoutStatus(), 500);
        }
    }, 250);
}
startURLMonitoring();

////////////////////////////////////////////////////////////////////////////
// Homepage check
////////////////////////////////////////////////////////////////////////////
function isCurrentPageHomepage(storedHomepage) {
    if (!storedHomepage) return false;

    const currentUrl = window.location.href;
    const homepageUrl = storedHomepage.trim();

    console.log("=== EXACT URL COMPARISON ===");
    console.log("Current URL:", currentUrl);
    console.log("Homepage URL:", homepageUrl);
    console.log("Identical?", currentUrl === homepageUrl);
    console.log("===========================");

    return currentUrl === homepageUrl; // strict match
}

function checkAndUpdateTimeoutStatus() {
    chrome.storage.local.get(['homepageUrl', 'disableTimeout'], (result) => {
        const storedHomepage = result.homepageUrl;
        const globalDisable = result.disableTimeout === true;

        if (globalDisable) {
            handleTimeoutToggle(true);
            return;
        }

        if (storedHomepage && isCurrentPageHomepage(storedHomepage)) {
            console.log("Current page IS homepage → disable timeout");
            handleTimeoutToggle(true);
        } else {
            console.log("Current page is NOT homepage → enable timeout");
            handleTimeoutToggle(false);
        }
    });
}

////////////////////////////////////////////////////////////////////////////
// Reload or redirect
////////////////////////////////////////////////////////////////////////////
function reloadPageOrRedirect() {
    chrome.storage.local.get(["userInput"], (result) => {
        let userInput = result.userInput;

        if (userInput && userInput.trim() !== '') {
            let finalUrl = userInput.trim();
            if (!finalUrl.match(/^https?:\/\//i)) {
                finalUrl = 'https://' + finalUrl;
            }
            console.log("Redirecting to:", finalUrl);
            window.location.href = finalUrl;
        } else {
            console.log("Reloading current page");
            window.location.reload(true);
        }
    });
}

////////////////////////////////////////////////////////////////////////////
// Timeout logic
////////////////////////////////////////////////////////////////////////////
let timeoutID;
let timeLeft = 10;
let timeOutTotalTime = 60000;
let intervalId = null;
let timeoutDisabled = false;

const modalBackground = document.createElement("div");
modalBackground.id = "modalBackground993451";

const timeoutModal = document.createElement("div");
timeoutModal.id = "timerWrapper93451";

const copy = document.createElement("h3");
copy.id = "headerCopy93451";
copy.textContent = "Are you still there?";

const timer993451 = document.createElement("span");
timer993451.id = "timer993451";

const continueButton = document.createElement("button");
continueButton.id = "continue993451";
continueButton.textContent = 'Continue';

const restartButton = document.createElement("button");
restartButton.id = "restart993451";
restartButton.textContent = 'Restart';

const imgEyes = document.createElement('img');
imgEyes.id = "eyesImage93451";
imgEyes.src = chrome.runtime.getURL('img/eyes.gif');

timeoutModal.appendChild(imgEyes);
timeoutModal.appendChild(copy);
timeoutModal.appendChild(continueButton);
timeoutModal.appendChild(restartButton); 
timeoutModal.appendChild(timer993451);
document.body.appendChild(timeoutModal);
document.body.appendChild(modalBackground);

restartButton.addEventListener('click', (event) => {
    event.stopPropagation(); 
    reloadPageOrRedirect();
});

continueButton.addEventListener('click', (event) => {
    event.stopPropagation();

    // Hide modal
    timeoutModal.style.display = 'none';
    modalBackground.style.display = 'none';
    timer993451.style.display = 'none';
    continueButton.style.display = 'none';
    restartButton.style.display = 'none';

    // Reset timers
    clearInterval(intervalId);
    clearTimeout(timeoutID);

    if (!timeoutDisabled) {
        startTimer();  // start a fresh timeout
    }

    console.log("Continue clicked → timer reset");
});


let eventListenersAdded = false;
function setup() {
    if (!eventListenersAdded) {
        ["click","mousedown","keypress","DOMMouseScroll","mousewheel","touchmove","MSPointerMove"]
            .forEach(evt => window.addEventListener(evt, resetTimer, false));
        eventListenersAdded = true;
    }
    startTimer();
}

function updateButtonStyling(styling) {
    continueButton.style.backgroundColor = styling.continueBgColor;
    continueButton.style.color = styling.continueTextColor;
    restartButton.style.backgroundColor = styling.restartBgColor;
    restartButton.style.color = styling.restartTextColor;
}

function updateButtonCornerRadius(radiusValue) {
    continueButton.style.borderRadius = `${radiusValue}px`;
    restartButton.style.borderRadius = `${radiusValue}px`;
}

function updateTimeoutDuration(durationSeconds) {
    timeOutTotalTime = durationSeconds * 1000; 
    if (!timeoutDisabled) {
        clearTimeout(timeoutID);
        startTimer();
    }
}

function handleTimeoutToggle(disabled) {
    timeoutDisabled = disabled;
    if (disabled) {
        clearTimeout(timeoutID);
        clearInterval(intervalId);

        timeoutModal.style.display = 'none';
        modalBackground.style.display = 'none';
        timer993451.style.display = 'none';
        continueButton.style.display = 'none';
        restartButton.style.display = 'none';
    } else {
        startTimer();
    }
}


chrome.storage.local.get(['disableTimeout', 'buttonStyling', 'cornerRadius', 'timeoutDuration', 'homepageUrl'], (result) => {
    const globalDisabled = result.disableTimeout === true;
    const storedHomepage = result.homepageUrl;

    const onHomepage = storedHomepage && isCurrentPageHomepage(storedHomepage);
    timeoutDisabled = globalDisabled || onHomepage;

    const styling = result.buttonStyling || {
        continueBgColor: '#007bff',
        continueTextColor: '#ffffff',
        restartBgColor: '#dc3545',
        restartTextColor: '#ffffff'
    };
    updateButtonStyling(styling);

    updateButtonCornerRadius(result.cornerRadius || 0);

    const savedDuration = result.timeoutDuration || 60;
    timeOutTotalTime = savedDuration * 1000; 

    if (!timeoutDisabled) setup();
});

function startTimer() {
    if (timeoutDisabled) return;
    timeoutID = setTimeout(goInactive, timeOutTotalTime);
}

function resetTimer(event) {
    if (event && event.target.id === 'restart993451') return; 

    // Hide modal + elements
    timeoutModal.style.display = 'none';
    modalBackground.style.display = 'none';
    timer993451.style.display = 'none';
    continueButton.style.display = 'none';
    restartButton.style.display = 'none';

    clearInterval(intervalId);
    clearTimeout(timeoutID);

    if (!timeoutDisabled) startTimer();
}


function goInactive() {
    if (timeoutDisabled) return;

    timeLeft = 10;

    intervalId = setInterval(() => {
        timeoutModal.style.display = 'block';
        modalBackground.style.display = 'block';

        timer993451.style.display = 'inline-block';
        continueButton.style.display = 'inline-block';
        restartButton.style.display = 'inline-block';

        timer993451.innerHTML = String(timeLeft);
        console.log("Countdown:", timeLeft);

        if (timeLeft <= 0) {
            clearInterval(intervalId);   // stop countdown
            reloadPageOrRedirect();      // redirect once
            return;                      // exit so it doesn’t keep ticking
        }

        timeLeft--;
    }, 1000);
}


