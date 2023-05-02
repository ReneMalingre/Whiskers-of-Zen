// get submit button
const submitButton = document.getElementById('submit-button');
// add event listener to submit button
submitButton.addEventListener('click', submitForm);
const achievementsSelector=document.getElementById('itHadBetterWorkThisTime');

function submitForm() {
  // get form data here
  // pass form data to query string
  // pass this query string to load app.html
  const queryString = 'dogs=4&cats=4&mood=1&name=Bob';
  window.location.href = `app.html?${queryString}`;
}

//music function
let audioClass = new Audio('./assets/music/Mandeville.mp3');


 const toggleMusic = document.querySelector('#toggle-music');

 toggleMusic.addEventListener('change', () => {
  console.log('change event fired');
  if (toggleMusic.checked) {
    console.log('checked = true');
    audioClass.play();
  } else {
    console.log('checked = false');
    audioClass.pause();
  }
 }); 

