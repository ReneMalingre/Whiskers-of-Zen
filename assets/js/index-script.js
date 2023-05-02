//Enable format to array
const landingdata = {
  dogs: 5,
cats: 5,
mood: 3
};

//Save Mood to Local storage
const initialmood = document.getElementById('zen-level');
initialmood.addEventListener('change', (event) => {
landingdata.mood = event.target.value;
console.log(landingdata.mood);
});

//Save dropdown for number of dogs go local storage
const dognumber = document.getElementById("image-number-dogs");
dognumber.addEventListener('change', () => {
 landingdata.dogs = event.target.value;
  console.log(landingdata.dogs);
});

//Save dropdown for number of cats to local storage
const catnumber = document.getElementById("image-number-cats");
catnumber.addEventListener('change', () => {
  landingdata.cats = event.target.value;
  console.log(landingdata.cats);
});

//Load your Furry Friends Button to take to app page
const submitbutton = document.getElementById('submit-button');
submitbutton.addEventListener('click', () => {
// create querystring
const queryString = new URLSearchParams(landingdata).toString();
console.log(queryString);
window.location.href = 'app.html?' + queryString; 
});
