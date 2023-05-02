// create store for UI data, with defaults
const landingData = {
  dogs: 2,
  cats: 2,
  mood: 3,
};

// Load your Furry Friends Button to take to app page
const submitButton = document.getElementById('submit-button');
submitButton.addEventListener('click', () => {
// create querystring
  landingData.cats=document.getElementById('image-number-cats').value;
  landingData.dogs=document.getElementById('image-number-dogs').value;
  landingData.mood=document.getElementById('zen-level').value;
  const queryString = new URLSearchParams(landingData).toString();
  console.log(queryString);
  window.location.href = 'app.html?' + queryString;
});