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

        if (userInput) {
            if (userInput.trim() !== '') {
                window.location.assign(userInput); 
            } else {
                window.location.reload(true); 
            }
        } else {
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
setup();

// Main timeout function
function startTimer() {
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
    startTimer();
}


function goInactive() {
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














