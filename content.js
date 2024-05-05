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

////////////////////////////////////////////////////////////////////////////
// Timeout functions to reset page after 'X' amount of seconds
////////////////////////////////////////////////////////////////////////////

// Variables for timeout function and creating elements
let timeoutID;
let timeLeft = 35;
let timeOutTotalTime = 1000; 
let intervalId = null;

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
    timeLeft = 35;
}

