// Enable format to array
const landingData = {
  dogs: 5,
  cats: 5,
  mood: 3,
};

// Save Mood to Local storage
const initialMood = document.getElementById('zen-level');
initialMood.addEventListener('change', (event) => {
  landingData.mood = event.target.value;
  console.log(landingData.mood);
});

// Save dropdown for number of dogs go local storage
const dogNumber = document.getElementById('image-number-dogs');
dogNumber.addEventListener('change', () => {
  landingData.dogs = event.target.value;
  console.log(landingData.dogs);
});

// Save dropdown for number of cats to local storage
const catNumber = document.getElementById('image-number-cats');
catNumber.addEventListener('change', () => {
  landingData.cats = event.target.value;
  console.log(landingData.cats);
});

// Load your Furry Friends Button to take to app page
const submitButton = document.getElementById('submit-button');
submitButton.addEventListener('click', () => {
// create querystring
  const queryString = new URLSearchParams(landingData).toString();
  console.log(queryString);
  window.location.href = 'app.html?' + queryString;
});
