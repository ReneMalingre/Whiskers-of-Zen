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


