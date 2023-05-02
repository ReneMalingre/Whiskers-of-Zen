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


// add event listener to submit button
//submitButton.addEventListener('click', submitForm);
const achievementsSelector=document.getElementById('itHadBetterWorkThisTime');

function submitForm() {
  // get form data here
  // pass form data to query string
  // pass this query string to load app.html
  const queryString = 'dogs=4&cats=4&mood=1&name=Bob';
  window.location.href = `app.html?${queryString}`;
}

//music function
const songs = [
 new Audio('./assets/music/Del Rio Bravo.mp3'),
 new Audio('./assets/music/Ethereal Relaxation.mp3'),
 new Audio('./assets/music/Maccary Bay.mp3'),
 new Audio('./assets/music/Mandeville.mp3'),
 new Audio('./assets/music/No Frills Salsa.mp3'),
 new Audio('./assets/music/one.mp3'),
 new Audio('./assets/music/Thief in the Night.mp3'),
]; 

 let currentSong = 0;

const playButton = document.querySelector('#play-button');
const pauseButton = document.querySelector('#pause-button');
const nextButton = document.querySelector('#next-button')

playButton.addEventListener('click', () => {
  songs[currentSong].play();
});

pauseButton.addEventListener('click', () => {
  songs[currentSong].pause();
});

nextButton.addEventListener('click', () => {
  songs[currentSong].pause();
  currentSong = (currentSong + 1) % songs.length;
  songs[currentSong].play();
});

playButton.addEventListener('click', () => {
  //audio.play()
  if (playButton.checked) {
    console.log('checked = true');
    audioClass.play();
  } else {
    console.log('checked = false');
    audioClass.pause();
  }
});

=======
submitButton.addEventListener('click', () => {
// create querystring
  const queryString = new URLSearchParams(landingData).toString();
  console.log(queryString);
  window.location.href = 'app.html?' + queryString;
});

