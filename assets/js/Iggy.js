//=========================
   //INDEXSCRIPTPAGE
//=========================

// Get the slider
const slider = document.getElementById("slider");
// Save the slider value to local storage on change
slider.addEventListener("change", function() {
  const rating = this.value;
  localStorage.setItem("rating", rating);
});


//Save Mood to Local storage
const initialmood = document.getElementById('user-level');
initialmood.addEventListener('change', (event) => {
const imood = event.target.value;
console.log(imood);
});
//Believe this should also hold the emojis consistent with App page as opposed to the aww

//Save dropdown for number of dogs go local storage
const dognumber = document.getElementById("image-number-dogs");
dognumber.addEventListener('change', () => {
  const dognum = event.target.value;
  console.log(dognum);
});

//Save dropdown for number of cats to local storage
const catnumber = document.getElementById("image-number-cats");
catnumber.addEventListener('change', () => {
  const catnum = event.target.value;
  console.log(catnum);
});

//Generate Button to take to app page
const submitbutton = document.getElementById('submit-button');
submittbutton.addEventListener('click', () => {
  window.location.href = 'app.html';
  //const queryString = 'dogs=4&cats=4&mood=1&name=Bob'; Unsure of functionality of this line
});


//================================
  //APPSCRIPT PAGE
//===============================

//TODO Display number coding to reference catnum and dognum

  //Save comments et all
  //const form = document.querySelector('form');
//const input = document.querySelector('input[type="text"]');
//const submitButton = document.querySelector('button[type="submit"]');

//submitButton.addEventListener('click', (event) => {
  //event.preventDefault(); // prevent the form from submitting
  //const inputValue = input.value;
 // console.log(inputValue);
//});

//Existing code from appscript attempting to utilise
function addPulsingButtonEventListener(parentElement) {
  // Check if the current element has the class pulsing-button
  if (parentElement.classList && parentElement.classList.contains('pulsing-button')) {
    // Add the event listener to the pulsing-button element
    parentElement.addEventListener('click', function(event) {
      // console.log('pulsing-button clicked');
      event.preventDefault();
      parentElement.classList.remove('pulsing-button');
      // TODO - get the user selections and add them to the right dogImage or catImage object
      // get the id of the button that was clicked
      // this will be 'submit-dog-image-0 or submit-cat-image-0
      const buttonClicked= event.target;
      const idValue = buttonClicked.id;
      // ! For Iggy - this is where you need to get the slider value etc and add it to the dogImage or catImage object
      if(idValue.includes('dog')) {
       dogImage[i].isFavourite=true;
      dogImage[i].cuteRating = sliderElement.value;
      dogimage[i].
      } else {
 catImage[i].isFavourite=true;
 catImage[i].cuteRating = sliderElement.value
/      }


    });
  }
}

//So the coding to submit button will need to iterate from 0 cat and 0 dog, save and then show 1 cat and 1 dog, then continue to 2 cat and 2 dog etc.

//Save dog rating - if selected
//Save zen/mood impact
//Save comments
//Save favourites


//dog-image-i
//aww-level-dog-image-i
const Awwdogslider = [];
  for (let i = 1; i <= dognum; i++) {
    // Add a change event listener to each slider input
    const dogsliderInput = document.getElementById(`aww-level-dog-image-${i}`);
    dogsliderInput.addEventListener('change', function() {
      // Update the corresponding value in the sliderValues array
      Awwdogslider[i - 1] = dogsliderInput.value;
      console.log(`AWW dog slider new value ${i}: ${Awwdogslider[i - 1]}`);
    });
  }
//mood-level-dog-image-i
const Mooddogslider = [];
  for (let i = 1; i <= dognum; i++) {
    // Add a change event listener to each slider input
    const MdogsliderInput = document.getElementById(`mood-level-dog-image-${i}`);
    MdogsliderInput.addEventListener('change', function() {
      // Update the corresponding value in the sliderValues array
      Mdogslider[i - 1] = MdogsliderInput.value;
      console.log(`MOOD dog slider new value ${i}: ${Mooddogslider[i - 1]}`);
    });
  }
//user-comment-dog-image-i


//fav-btn-dog-image-i (needs event listener to change status and additionally flag to carry into next page

// All fav buttons of iteration "fav-btn-dog-image-i"
//const favoriteButtons = document.querySelectorAll('[id^="fav-btn-dog-image-"]');

// loop through all and add event listener to each
//favoriteButtons.forEach(function(button) {
 // button.addEventListener('click', function() {
    // toggle the button's "favorite" status
  //  this.classList.toggle('is-favorite');
    // get the current status of the button
   // const isFavorite = this.classList.contains('is-favorite');
    // get the ID of the associated dog image
   // const dogImageId = this.dataset.dogImageId;
    // save data (need to add to array)
    //console.log(`Favorite button for dog image ${dogImageId} status:`, isFavorite);
// });
//});

//But with iterations of dog ID already known we should have

// All fave buttons "fav-btn-dog-image-i"
const favoriteButtons = document.querySelectorAll('[id^="fav-btn-dog-image-"]');
// loop through all and add event listener to each
favoriteButtons.forEach(function(button, i) {
  button.addEventListener('click', function() {
    // toggle the button's "favorite" status
    this.classList.toggle('is-favorite');
    // get the current status of the button
    const isFavorite = this.classList.contains('is-favorite');
    //Change the icon type
    classList.add('fa-duotone');
   style.setProperty('--fa-primary-color', '#e63b7a');
   style.setProperty('--fa-secondary-color', '#e63b7a');
    //get the ID of the associated dog image
    const dogImageId = `dog image-${i+1}`;
    //save data (need to add to array)
    console.log(`Favorite button for ${dogImageId} status:`, isFavorite);
  });
});

//download-dog-image-i

  // Event listener to download-dog-image
  for (let i = 1; i <= dognum; i++) {
    const downloadButton = document.getElementById(`download-dog-image-${i}`);
    downloadButton.addEventListener('click', function() {
      // Get URL
      const dogImage = document.getElementById(`dog-image-${i}`);
      const imageUrl = dogImage.src;
      // Link Download creation (needs testing think prompt is outside window)
      const link = document.createElement('a');
      link.download = `dog-image-${i}.jpg`;
      link.href = imageUrl;
      link.click();
    });
  }
/////////////////////////////////////////////////
//facebook-dog-image-i
//   // Initialize Facebook API
//   window.fbAsyncInit = function() {
//     FB.init({
//       appId      : 'YOUR_APP_ID',
//       xfbml      : true,
//       version    : 'v13.0'
//     });
//   };
//   (function(d, s, id) {
//     var js, fjs = d.getElementsByTagName(s)[0];
//     if (d.getElementById(id)) return;
//     js = d.createElement(s); js.id = id;
//     js.src = "https://connect.facebook.net/en_US/sdk.js";
//     fjs.parentNode.insertBefore(js, fjs);
//   }(document, 'script', 'facebook-jssdk'));

//  // Add Event Listener to all
//  for (let i = 1; i <= dognum; i++) {
//   const dogfacebookButton = document.getElementById(`facebook-dog-image-${i}`);
//   dogfacebookButton.addEventListener('click', function() {
//     // Get the URL of dog image
//     const FBdogImage = document.getElementById(`dog-image-${i}`);
//     const FBDdogimageUrl = FBdogImage.src;
//     // Open the Facebook share using url
//     FB.ui({
//       method: 'share',
//       href: FBdogimageUrl
//     }, function(response){});
//   })}
///////////////////////////////////////

//twitter-dog-image-i
for (let i = 1; i <= dognum; i++) {
  const dogtwitterButton = document.getElementById(`twitter-dog-image-${i}`);
  dogtwitterButton.addEventListener('click', function() {
    // Get the URL of dog image
    const TwitdogImage = document.getElementById(`dog-image-${i}`);
    const TwitdogimageUrl = TwitdogImage.src;
    // Construct the tweet text and URL
    const twitText = `Aww so cute I had to tweet the doge`;
    const twitUrl = TwitdogimageUrl;
    // Open the Twitter share dialog with the tweet text and URL
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitText)}&url=${encodeURIComponent(twitUrl)}&hashtags=cute,doge,javascriptrulz`;
    window.open(twitterUrl, '_blank');
  });
}

//submit-dog-image-i
var dogcomments = {}
for (let i = 1; i <= dognum; i++) {
  const submitdogButton = document.getElementById(`submit-dog-image-${i}`);
  submitdogButton.addEventListener('click', function() {
    event.preventDefault();
    // Get the comment
    var commentInput = this.parentNode.querySelector(`#user-comment-dog-image-${dogImageId}`);
    var comment = commentInput.value;
    // Save the comment to the comments object using the dog image ID as the key
    dogcomments[dogImageId] = comment;
    console.log(`Dog comments ${dogImageId}:`, comments[dogImageId]);
  });
}


//cat-image-i
//aww-level-cat-image-i
//mood-level-cat-image-i
//user-comment-cat-image-i
//fav-btn-cat-image-i (needs event listener to change status)
//download-cat-image-i

//facebook-cat-image-i
// window.fbAsyncInit = function() {
//   FB.init({
//     appId      : 'YOUR_APP_ID',
//     xfbml      : true,
//     version    : 'v13.0'
//   });
// };
// (function(d, s, id) {
//   var js, fjs = d.getElementsByTagName(s)[0];
//   if (d.getElementById(id)) return;
//   js = d.createElement(s); js.id = id;
//   js.src = "https://connect.facebook.net/en_US/sdk.js";
//   fjs.parentNode.insertBefore(js, fjs);
// }(document, 'script', 'facebook-jssdk'));

// // Add Event Listener to all
// for (let i = 1; i <= dognum; i++) {
// const facebookButton = document.getElementById(`facebook-cat-image-${i}`);
// facebookButton.addEventListener('click', function() {
//   // Get the URL of cat image
//   const FBcatimage = document.getElementById(`cat-image-${i}`);
//   const FBcatimageUrl = FBcatimage.src;
//   // Open the Facebook share using url
//   FB.ui({
//     method: 'share',
//     href: FBcatimageUrl
//   }, function(response){});
// })}

//twitter-cat-image-i
for (let i = 1; i <= catnum; i++) {
  const cattwitterButton = document.getElementById(`twitter-cat-image-${i}`);
  cattwitterButton.addEventListener('click', function() {
    // Get the URL of cat image
    const TwitcatImage = document.getElementById(`cat-image-${i}`);
    const TwitcatimageUrl = TwitcatImage.src;
    // Construct the tweet text and URL
    const twitText = `Floof so cute I had to tweet the kitteh`;
    const twitUrl = TwitcatimageUrl;
    // Open the Twitter share dialog with the tweet text and URL
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitText)}&url=${encodeURIComponent(twitUrl)}&hashtags=cute,icanhazcheezburger,javascriptrulz`;
    window.open(twitterUrl, '_blank');
  });
}

//submit-cat-image-i



//Download button functionality
//Facebook button functionality
//Twitter button functionality
//Submit button functionality - loop in dog rating, zen/mood impact and comments
//Save cat rating - if selected
//Save zen/mood impact
//Save comments
//Save favourites
//Download button functionality
//Facebook button functionality
//Twitter button functionality
//Submit button functionality - loop in dog rating, zen/mood impact and comments
//On both Save rating buttons been pressed, unhide next two and scroll to page
//Repeat above for next two until final
//If all save rating buttons pressed (hide/unhide irrelevant then move to next page)

//========================
//Ending page
//========================
//Number of animals viewed

//Determine points

//Determine badge criteria

//Display initial mood rating - quote per rating
//Average mood rating - quote per rating to show afterwards
//Display Cutest
//Display Ugliest
//Display Most Zen
//Display Least zen
//Include option to refavourite

//=======================
//Favourites page
//=======================
//All favourited cats or dogs need to search flag of favourite
// Create an empty array to store the isFavourite values
var favouritedog = [];
// Loop through all dogs
for (var i = 0; i < dogImageIds.length; i++) {
  var dogImageId = dogImageIds[i];
  var isFavourite = checkFavouriteStatus(dogImageId);
  
console.log(`Favourited dog ${dogImageId} status:`, isFavourite);
// Add the isFavorite value to the favourite array and pull out true
  favouritedog.push(isFavorite);
}
var favouriteTrue = favouriteStatuses.filter(function(status) {
  return status === true;
});
console.log('Favourite dog images:', favouriteTrue);
//But then how to display associated image - throw to existing display coding? Ie unhide existing?

// Loop through all cats now
for (var i = 0; i < catImageIds.length; i++) {
  var catImageId = catImageIds[i];
  var isFavorite = checkFavouriteStatus(catImageId);
  
  console.log(`Favourited cat ${catImageId} status:`, isFavourite);
  
// Add the isFavorite value to the favourite array and pull out true
  favouritecat.push(isFavourite);
}
var favouriteTrue = favouriteStatuses.filter(function(status) {
  return status === true;
});
console.log('Favourite cat images:', favouriteTrue);
//But then how to display associated image - throw to existing display coding? Ie unhide existing?

////Below buttons should retain functionality from previous cards
//Unsave favourites TODO align toggle to allow backwards move
//Download button functionality
//Facebook button functionality
//Twitter button functionality





