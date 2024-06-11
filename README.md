Chrome extension with two purposes. 

1. Timeout function. After 60 secs a modal appears with a 10 sec countdown.
2. Invisible reset button to reload the page manually.

The extension includes an input to save a URL using Chrome local storage in case you need it to go back to the root URL and not the current page. This works both with the invisible reset button and the timeout function. 
<br>
<br>

To load the extension go to Chrome, Brave, Edge... <strong>"Extensions"</strong> page and turn on <strong>"Developer Mode"</strong> then, click <strong>"load unpacked"</strong>.
<br>

<img src="./assets/loading.png">
<br>
<br>

Here is the popup UI. There are a few things to do here.  
<br>

- See where the reset button is located. This can also be changed in the main.css.
- Add a <strong>"Root"</strong> URL to ensure when the reload happens manually or automatically it goes back to the root URL. 
<br>

<img src="./assets/popup.png">
<br>
<br>

Image of the reset button enabled.
<br>

<img src="./assets/resetButton.png">
<br>
<br>

Here is the timeout function. It is set for 10 seconds. This can be changed in the content.js. The styles can be changed in the main.css
<br>

<img src="./assets/timeout.png">
