// get submit button
const submitButton = document.getElementById('submit-button');
// add event listener to submit button
submitButton.addEventListener('click', submitForm);

function submitForm() {
  // get form data here
  // pass form data to query string
  // pass this query string to load app.html
  const queryString = 'dogs=4&cats=4&mood=1&name=Bob';
  window.location.href = `app.html?${queryString}`;
}


// W3 dropdown menu

function myFunction() {
  var x = document.getElementById("Demo");
  if (x.className.indexOf("w3-show") == -1) { 
    x.className += " w3-show";
  } else {
    x.className = x.className.replace(" w3-show", "");
  }
}