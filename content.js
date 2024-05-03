console.log("Content script loaded");





////////////////////////////////////////////////////////////////////////////

// // Hidden reload button
const hiddenResetButton = document.createElement("div");
hiddenResetButton.setAttribute("id", "reload");
document.body.append(hiddenResetButton); 


document.getElementById('reload')
.addEventListener('click', () => {
    window.location.reload(true);
});



////////////////////////////////////////////////////////////////////////////

// Variables for timeout function
let timeoutID;
let timeLeft = 35;
let timeOutTotalTime = 1000; 
let intervalId = null;




const modalBackground = document.createElement("div");
// modalBackground.className = "modal-background";
modalBackground.setAttribute("id", "modalBackground");


const timeoutModal = document.createElement("div");
// timeoutModal.className = "timerWrapper";
timeoutModal.setAttribute("id", "timerWrapper");


const copy = document.createElement("h3");
// copy.className = "headerCopy";
copy.setAttribute("id", "headerCopy");
copy.textContent = "Are you still there?";

const timer = document.createElement("span");
// timer.className = "timer";
timer.setAttribute("id", "timer");


const continueButton = document.createElement("button");
// continueButton.className = "continue";
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


// Function to reload the page based on user input
function reloadPage() {
    let userInput = localStorage.getItem('userInput');
    if (userInput) {
        if (userInput.trim() !== '') {
            window.location.assign(userInput); // Reload to the specified userInput page
        } else {
            window.location.reload(true); // Reload the current page
        }
    } else {
        window.location.reload(true); // Reload the current page if no userInput is stored
    }
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

        // Inside the goInactive function
        if (timeLeft === 0) {
            clearInterval(intervalId);
            clearTimeout(timeoutID);
            reloadPage(); // Call the function to reload the page based on user input
        }

    }, 1000);
    timeLeft = 35;
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

