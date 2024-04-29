console.log('content.js startup');

// Hidden reload button
const hiddenResetButton = document.createElement("div");
hiddenResetButton.setAttribute("id", "reload");
document.body.append(hiddenResetButton); 


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.message) {
        const makeVisable = document.getElementById('reload');
        makeVisable.classList.toggle('hiddenResetButtonVisualCheck');
        console.log('Reveal!');
    }
});




