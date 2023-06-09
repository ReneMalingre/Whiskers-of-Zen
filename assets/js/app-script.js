let dogImages = []; // array of DogImage objects
let catImages = []; // array of CatImage objects
let totalImagesLoaded; // total number of images loaded, recorded by the load event
let totalImagesFailed; // total number of images that failed to load
let loadingPlaceholders = false; // flag to indicate if the placeholders are being loaded
let loadingImages = false; // flag to indicate if the images are being loaded
let appRowMax = 0;
const polaroidImageHeight = 360; // height of the polaroid image in pixels
const imageLoadTimer = new LoadTimer; // timer to check if all the images have loaded
let initialZenLevel = 0; // initial zen level from the loading screen
// set standards for acceptable image size and aspect ratio
const minimumImageHeight = 200;
const minimumImageAspectRatio = 0.95;
const maximumImageAspectRatio = 1.61;

// get the query string from the URL
let dogImageCount= 0;
let catImageCount = 0;
window.addEventListener('load', () => {
  const queryString = window.location.search;
  const searchParams = new URLSearchParams(queryString);
  dogImageCount = parseInt(searchParams.get('dogs')); // Output: value1
  catImageCount = parseInt(searchParams.get('cats')); // Output: value2
  // get the initial zen level from the query string and set it to 3 if it is not present
  initialZenLevel = searchParams.get('mood'); // Output: value2
  if (!initialZenLevel) {
    initialZenLevel = 3;
  } else {
    initialZenLevel = parseInt(initialZenLevel);
  }
  // set the zen level on the end input
  document.getElementById('zen-level').value=initialZenLevel;
  // save the initial zen level to local storage
  localStorage.setItem('initialZenLevel', initialZenLevel);

  // add the modal to the DOB
  addInfoModalToDOM();
  addImageModalToDOM();
  createAndPopulateAppElements();
});

// add the empty img to the DOM to prepare for the image to be added later
// this allows event listeners to be added to the image before they are populated
function addEmptyAppCardsToDom(dogImagesTally, catImagesTally, parentElement) {
  // create random array to determine which images are dogs and which are cats
  const dogsArray = Array(dogImagesTally).fill(1);
  const combinedArray = dogsArray.concat(Array(catImagesTally).fill(2));
  // shuffle the array
  randomizeArray(combinedArray);

  // create the empty App cards
  let dogIndex = 0;
  let catIndex = 0;
  let id;
  let index;
  let newRow;
  let appCardRow;
  let appRow = -1;
  for (let i=0; i < combinedArray.length; i++) {
    if (i % 2 === 0) {
      appRow++;
      newRow = document.createElement('div');
      newRow.classList.add('app-card-row');
      newRow.id = 'app-card-row-'+ appRow;
      if (appRow !== 0) {
        newRow.classList.add('invisible-element');
      }
      // add an affirmation to the row
      const affirmation = randomAffirmation();
      // add a div to contain the affirmation
      const affirmationDiv = document.createElement('div');
      affirmationDiv.innerHTML = `<h3 class="w3-sans-serif affirmation">${affirmation}</h4>`;
      newRow.appendChild(affirmationDiv);
      // add a div to contain the images
      appCardRow = document.createElement('div');
      appCardRow.classList.add('app-row');
    }

    // if the value is 1, then it is a dog image
    if (combinedArray[i] === 1) {
      index=dogIndex;
      id= 'dog-image';
      dogIndex++;
    } else {
      index=catIndex;
      id= 'cat-image';
      catIndex++;
    }
    // construct the image template
    const imageTemplate= emptyAppCardHTML(id, index, appRow, appRow);
    // create a temporary div element to contain the image
    const newDiv = document.createElement('div');
    newDiv.innerHTML = imageTemplate;
    // get the new elements from the div
    const imageElement = newDiv.firstChild;
    // add the new elements to the parent element (the row div)
    appCardRow.appendChild(imageElement);
    // add the new row to the parent element after the odd number image or the last one regardless
    if (i % 2 === 1 || i === combinedArray.length - 1) {
      newRow.appendChild(appCardRow);
      parentElement.appendChild(newRow);
    }
  }
  appRowMax = appRow;
}


async function getFreshImages(dogImagesTally, catImagesTally, parentElement) {
  if (loadingImages) {
    // if the images are already being loaded, do nothing
    return;
  }
  loadingImages = true; // set the flag to indicate that the images are being loaded
  dogImages = []; // empty the global dog array
  catImages = []; // empty the global cat array
  const dogImageStore = []; // array to store the dog images retrieved from the API
  const catImageStore = []; // array to store the cat images retrieved from the API
  // clear old images from the DOM

  // delete all child elements (old images) of the image store
  while (parentElement.firstChild) {
    parentElement.removeChild(parentElement.firstChild);
  }
  // get dog breed info
  await getDogBreeds();

  // create a div to contain the new images
  const newDiv = document.createElement('div');
  // add class 'grid' to the div
  //   newDiv.classList.add('w3-container');
  // create empty images in the DOM to put the images into
  loadingPlaceholders = true; // set the flag to indicate that the placeholders are being loaded
  addEmptyAppCardsToDom(dogImagesTally, catImagesTally, newDiv);
  // add the new div to the DOM
  parentElement.appendChild(newDiv);
  randomlyRotatePolaroids();

  // add event listeners to the UI elements
  addImageLoadedEventListener(parentElement);
  addPulsingButtonEventListener(parentElement);
  addAnimalInfoURLEventListener(parentElement);
  addEventListenerToDOMBranch(parentElement, 'polaroid-img', 'click', animalImageClicked);
  addEventListenerToDOMBranch(parentElement, 'favourite-button', 'click', handleFavouriteButtonClicked);
  // call function to get images from APIs
  // and add them to the dogImages and catImages arrays
  await getFreshCatImages(catImagesTally, catImageStore);
  await getFreshDogImages(dogImagesTally, dogImageStore);
  // copy the dogImageStore array to the global dogImages array
  dogImages = dogImageStore.slice(0, dogImagesTally);
  // copy the catImageStore array to the global catImages array
  catImages = catImageStore.slice(0, catImagesTally);
  loadingPlaceholders = false; // set the flag to indicate that the placeholders are no longer being loaded

  // replace the placeholders with the candidate images
  for (let i = 0; i < catImages.length; i++) {
    // add them to the DOM in the img elements via the AnimalImage class
    catImages[i].addURLAndAltToImgByID(`cat-image-${i}`);
    // catImages[i].addCaptionToImgByID(`animal-caption-cat-image-${i}`);
    catImages[i].addInfoURLByID(`animal-info-url-cat-image-${i}`);
    addImageToLoadingRow(catImages[i].url);
  };
  for (let i = 0; i < dogImages.length; i++) {
    // add them to the DOM in the img elements via the AnimalImage class
    dogImages[i].addURLAndAltToImgByID(`dog-image-${i}`);
    // dogImages[i].addCaptionToImgByID(`animal-caption-dog-image-${i}`);
    dogImages[i].addInfoURLByID(`animal-info-url-dog-image-${i}`);
    addImageToLoadingRow(dogImages[i].url);
  };

  // start the timer to check if all the images have loaded
  if (totalImagesLoaded < dogImagesTally + catImagesTally) {
    // if there are still images to load, start the timer
    imageLoadTimer.startTimer();
  } else {
    loadingImages = false; // set the flag to indicate that the images are no longer being loaded
    signalGoodToGo(); // signal that the page is ready to go
  }
}

async function getFreshDogImages(imageCount, dogImageStore) {
  // create array for the new dogImages
  let newDogs = [];

  // call API to get dog images
  // get max number of images to request
  const maxImagesRequest = DogAPICall.preferredMaxCount();

  // work out how many are yet to be fetched
  const imagesYetToFetch = imageCount - dogImageStore.length;
  if (imagesYetToFetch <= 0) {
    // all images have been fetched
    return;
  }

  // calculate how many images to request
  let currentImagesRequest;
  if (imagesYetToFetch > maxImagesRequest) {
    currentImagesRequest = maxImagesRequest;
  } else {
    // get a buffer of 30% more than needed to allow for some images not meeting the criteria
    currentImagesRequest = Math.round( imagesYetToFetch * 1.3);
    if (currentImagesRequest > maxImagesRequest) {
      currentImagesRequest = maxImagesRequest;
    }
  }

  // get dog image data from the APIs
  const apiCall = new DogAPICall(currentImagesRequest);
  const returnData = new DogData(await apiCall.callAPI());
  // if API call was successful
  if (returnData.apiReturn.responseStatus === 200) {
    // save dog images object to array
    newDogs = returnData.dataToArray();
  } else {
    // if API call was not successful
    // display error message
    showCustomAlert(`Could not retrieve dog url collection data: ${returnData.apiReturn.errorMessage}`);
    return;
  }
  for (let i = 0; i < newDogs.length; i++) {
    const url = newDogs[i].url;
    // ensure they are jpg or png
    if (!isValidImageType(url)) {
      continue;
    }

    // ensure they are unique in the final dogImageStore array
    if (dogImageStore.some((obj) => obj.url === url)) {
      continue;
    }

    dogImageStore.push(newDogs[i]);

    // check if we have enough images
    if (dogImageStore.length == imageCount) {
      // all images have been fetched
      return;
    }
  }

  if (dogImageStore.length < imageCount) {
    // call this function again to get more images
    await getFreshDogImages(imageCount, dogImageStore);
  } else {
    // all images have been fetched
    return;
  }
}

// ==================================================================
// Get Cat images
// ==================================================================
async function getFreshCatImages(imageCount, catImageStore) {
  let newCats = [];

  // call API to get cat images
  // get max number of images to request
  const getCatBreed = true;
  const maxImagesRequest = CatAPICall.preferredMaxCount(getCatBreed);

  // work out how many are yet to be fetched
  const imagesYetToFetch = imageCount - catImageStore.length;
  if (imagesYetToFetch <= 0) {
    // all images have been fetched
    return;
  }

  // calculate how many images to request
  let currentImagesRequest;
  if (imagesYetToFetch > maxImagesRequest) {
    currentImagesRequest = maxImagesRequest;
  } else {
    // get a buffer of 30% more than needed to allow for some images not meeting the criteria
    currentImagesRequest = Math.round( imagesYetToFetch * 1.3);
    if (currentImagesRequest > maxImagesRequest) {
      currentImagesRequest = maxImagesRequest;
    }
  }

  // get cat image data from the APIs
  const apiCall = new CatAPICall(currentImagesRequest, getCatBreed);
  const returnData = new CatData(await apiCall.callAPI()); // this is an APIReturn object with response status, error message and JSON data
  // if API call was successful
  if (returnData.apiReturn.responseStatus === 200) { 
    // save cat images object to array
    newCats=returnData.dataToArray(); // this returns an array of CatImage objects
  } else {
    // if API call was not successful
    // display error message
    showCustomAlert(`Could not retrieve cat url collection data: ${returnData.apiReturn.errorMessage}`);
    return;
  }
  for (let i = 0; i < newCats.length; i++) {
    const url = newCats[i].url;
    // ensure they are jpg or png
    if (!isValidImageType(url)) {
      continue;
    }

    // ensure they are unique in the final catImages array
    if (catImageStore.some((obj) => obj.url === url)) {
      continue;
    }

    // cats come with a width and height, so we can check the aspect ratio and minimum size
    // ensure that the image is the correct aspect ratio and minimum size
    if (!isValidImageSize(newCats[i].width, newCats[i].height)) {
      // move to the next one as it doesn't meet the criteria
      continue;
    }

    // all done, add to catImages array
    if (!newCats[i].hasBreed) {
      newCats[i].description = randomAffirmation();
    }
    catImageStore.push(newCats[i]);

    // check if we have enough images
    if (catImageStore.length == imageCount) {
      // all images have been fetched
      return;
    }
  }

  if (catImageStore.length < imageCount) {
    // call this function again to get more images
    await getFreshCatImages(imageCount, catImageStore);
  } else {
    // all images have been fetched
    return;
  }
}
// attach event handlers to all img elements,
// that recognise that an image has loaded or errored
function addImageLoadedEventListener(parentElement) {
  // Check if the current element is an img element
  if (parentElement.tagName && parentElement.tagName.toLowerCase() === 'img') {
    // Add the event listener to the img element
    parentElement.addEventListener('load', imageLoadedHandler);
    parentElement.addEventListener('error', imageErrorHandler);
  }

  // Traverse the child elements recursively
  if (parentElement.children && parentElement.children.length > 0) {
    for (const child of parentElement.children) {
      addImageLoadedEventListener(child);
    }
  }
}

function addPulsingButtonEventListener(parentElement) {
  // Check if the current element has the class pulsing-button
  if (parentElement.classList && parentElement.classList.contains('pulsing-button')) {
    // Add the event listener to the pulsing-button element
    parentElement.addEventListener('click', function(event) {
      event.preventDefault();
      parentElement.classList.remove('pulsing-button');
      parentElement.classList.add('invisible-element');

      // Button variables reference utility code
      const buttonClicked= event.target;
      // get the id of the button
      const idValue = buttonClicked.id;
      // convert the id into animal type and array index
      const animalType = getAnimalImageTypeFromID(idValue);
      const arrayIndex = getAnimalImageIndexFromID(idValue);
      // see which row we are currently on
      let appRow = buttonClicked.getAttribute('data-approw');
      // choose all buttons on this row to see if they have been clicked yet
      const selectorQuery = `[data-approw = "${appRow}"]`;
      const allMatchingPulsatingButtons = document.querySelectorAll(selectorQuery);
      let allHaveBeenPressed=true;
      // test the buttons to see if they have been clicked
      for (let i=0; i < allMatchingPulsatingButtons.length; i++) {
        const buttonElement = allMatchingPulsatingButtons[i];
        if (buttonElement.classList.contains('pulsing-button')) {
          allHaveBeenPressed=false;
          break;
        }
      }
      // if all of the buttons have been pressed, either show the end elements,
      // or show the next row of images
      if (allHaveBeenPressed) {
        if (parseInt(appRow) === parseInt(appRowMax)) {
        // Flag hidden submit button and show
          const nextRow = document.getElementById('final-zen-query');
          // remove the css class that makes the row invisible
          nextRow.classList.remove('invisible-element');
        } else {
        // show the next row of cute animals
        // first add 1 to the row that we are currently on
          appRow = parseInt(appRow)+1;
          // now get the div element that holds the next images
          const nextRow = document.getElementById('app-card-row-' + appRow);
          // remove the css class that makes the row invisible
          nextRow.classList.remove('invisible-element');
        }
      }

      // Poll for if dog vs cat and pull appropriate array info
      if (animalType === 'dog-image') {
        dogImages[arrayIndex].zenRating = document.getElementById('zen-level-dog-image-'+ arrayIndex).value;
        dogImages[arrayIndex].cuteRating = document.getElementById('aww-level-dog-image-'+ arrayIndex).value;
        dogImages[arrayIndex].userComment = document.getElementById('user-comment-dog-image-'+ arrayIndex).value.trim();
        dogImages[arrayIndex].isFavourite = document.getElementById('fav-btn-dog-image-'+ arrayIndex).classList.contains('favourited');
      } else if (animalType === 'cat-image') {
        catImages[arrayIndex].zenRating = document.getElementById('zen-level-cat-image-'+ arrayIndex).value;
        catImages[arrayIndex].cuteRating = document.getElementById('aww-level-cat-image-'+ arrayIndex).value;
        catImages[arrayIndex].userComment = document.getElementById('user-comment-cat-image-'+ arrayIndex).value.trim();
        catImages[arrayIndex].isFavourite = document.getElementById('fav-btn-cat-image-'+ arrayIndex).classList.contains('favourited');
      }
    });
  }
  // Traverse the child elements recursively
  if (parentElement.children && parentElement.children.length > 0) {
    for (const child of parentElement.children) {
      addPulsingButtonEventListener(child);
    }
  }
}


// get event handler that recognises that an image has loaded
function imageLoadedHandler(event) {
  if (loadingPlaceholders) return;
  const imageOfConcern = event.target;
  const imageAltText = imageOfConcern.alt;
  if (imageAltText === 'placeholder') return;
  const idValue = imageOfConcern.id;

  if (idValue === undefined || idValue.length === 0) return;
  totalImagesLoaded++;
  const width = imageOfConcern.naturalWidth;
  const height = imageOfConcern.naturalHeight;
  const imageType = idValue.substring(0, 10);
  const idNumber = parseInt(idValue.substring(10));
  const isValid = isValidImageSize(width, height);
  if (!isValid) {
    totalImagesFailed++;
    if (imageType === 'dog-image-') {
    // set error flag for dog image
      const dogImage = dogImages[idNumber];
      dogImage.invalidImage = true;
    } else if (imageType === 'cat-image-') {
    // set error flag for cat image
      const catImage = catImages[idNumber];
      catImage.invalidImage = true;
    }
  } else {
    if (imageType === 'dog-image-') {
      const dogImage = dogImages[idNumber];
      dogImage.width = width;
      dogImage.height = height;
      dogImage.invalidImage = false;
    } else if (imageType === 'cat-image-') {
      const catImage = catImages[idNumber];
      catImage.width = width;
      catImage.height = height;
      catImage.invalidImage = false;
    }
  }
}

// get event handler that recognises that an image has not loaded due to error
function imageErrorHandler(event) {
  if (loadingPlaceholders) return;
  const imageOfConcern = event.target;
  const imageAltText = imageOfConcern.alt;
  if (imageAltText === 'placeholder') return;
  const idValue = imageOfConcern.id;
  if (idValue === undefined || idValue.length === 0) return;
  totalImagesLoaded++;
  totalImagesFailed++;
  // determine which image failed to load by the id
  // get substring of id to determine which image failed to load
  const imageType = idValue.substring(0, 10);
  const idNumber = parseInt(idValue.substring(10));
  if (imageType === 'dog-image-') {
    // remove dog image from array
    dogImages[idNumber].invalidImage = true;
  } else if (imageType === 'cat-image-') {
    // remove cat image from array
    catImages[idNumber].invalidImage = true;
  }
}

async function replaceInvalidImages() {
  // count number of invalid dog images
  let invalidDogImages = 0;
  dogImages.forEach((dogImage) => {
    if (dogImage.invalidImage) {
      invalidDogImages++;
    }
  });
  // count number of invalid cat images
  let invalidCatImages = 0;
  catImages.forEach((catImage) => {
    if (catImage.invalidImage) {
      invalidCatImages++;
    }
  });
  totalImagesFailed = invalidCatImages + invalidDogImages;
  if (invalidDogImages === 0 && invalidCatImages === 0) {
    // no invalid images, so stop timer and set flag and return
    imageLoadTimer.stopTimer();
    loadingImages = false;
    signalGoodToGo();
    return;
  }
  // reset global values
  totalImagesLoaded = totalImagesLoaded - invalidDogImages - invalidCatImages;
  totalImagesFailed = 0;
  // call API to get new images
  const catImageStore = [];
  const dogImageStore = [];
  // replace invalid images in array and on page
  // loop through dog images and find invalid images, replace with new images
  loadingImageElement = document.getElementById('loading-img');
  if (invalidDogImages > 0) {
    await getFreshDogImages(invalidDogImages, dogImageStore);
    for (let i=0; i < dogImageStore.length; i++) {
      addImageToLoadingRow(dogImageStore[i].url);
    };
    let dogImageIndex = 0;
    for (let i = 0; i < dogImages.length; i++) {
      if (dogImages[i].invalidImage) {
        dogImages[i] = dogImageStore[dogImageIndex];
        dogImages[i].url = dogImageStore[dogImageIndex].url;
        dogImages[i].invalidImage = false;
        dogImages[i].description = dogImageStore[dogImageIndex].description;
        dogImages[i].addURLAndAltToImgByID(`dog-image-${i}`);
        dogImages[i].addInfoURLByID(`animal-info-url-dog-image-${i}`);
        dogImageIndex++;
        if (dogImageIndex > invalidDogImages - 1) {
          break;
        }
      }
    }
  }
  // loop through cat images and find invalid images, replace with new images
  if (invalidCatImages > 0) {
    await getFreshCatImages(invalidCatImages, catImageStore);
    let catImageIndex = 0;
    for (let i=0; i < catImageStore.length; i++) {
      addImageToLoadingRow(catImageStore[i].url);
    };
    for (let i = 0; i < catImages.length; i++) {
      if (catImages[i].invalidImage) {
        catImages[i] = catImageStore[catImageIndex];
        catImages[i] = catImageStore[catImageIndex];
        catImages[i].url = catImageStore[catImageIndex].url;
        catImages[i].invalidImage = false;
        catImages[i].description = randomAffirmation();
        catImages[i].width = catImageStore[catImageIndex].width;
        catImages[i].height = catImageStore[catImageIndex].height;
        catImages[i].addURLAndAltToImgByID(`cat-image-${i}`);
        catImages[i].addInfoURLByID(`animal-info-url-cat-image-${i}`);
        catImageIndex++;
        if (catImageIndex > invalidCatImages - 1) {
          break;
        }
      }
    }
  }
  // restart the timer to check if all the images have loaded
  imageLoadTimer.startTimer();
}

function addImageToLoadingRow(imageUrl) {
  const imageContainer = document.getElementById('loading-image-container');
  // Create a new img element
  const imgElement = document.createElement('img');
  // Set the src attribute and height of the img element
  imgElement.src = imageUrl;
  imgElement.style.height = '100px';
  // Add the img element to the image container
  imageContainer.appendChild(imgElement);
}

// function to get fresh dog and cat images
async function createAndPopulateAppElements() {
  // get the dog and cat images
  // and create the UI Cards and pair divs

  totalImagesLoaded = 0; // reset the counter
  totalImagesFailed = 0; // reset the counter

  // just in case the user or the page enters an invalid value
  if (dogImageCount === null || dogImageCount === undefined || Number.isNaN(dogImageCount)) {
    dogImageCount = 2;
  }
  if (catImageCount === null || catImageCount === undefined || Number.isNaN(catImageCount)) {
    catImageCount = 2;
  }

  // if both zero, default to 10 of each
  if (dogImageCount === 0 && catImageCount === 0) {
    dogImageCount = 2;
    catImageCount = 2;
  }

  // call function to call dog and cat APIs
  // get container element in the page
  const parentElement= document.getElementById('image-store');
  parentElement.classList.add('invisible-element');

  // dog and cat image count is valid, go to the remote servers and get the images!
  // most of this code is in the images.js file
  await getFreshImages(dogImageCount, catImageCount, parentElement);
}

// create the HTML for an empty animal card
function emptyAppCardHTML(id, i, appRow, appRow) {
  // construct the image template
  let placeHolder;
  let animalType;
  let compliment;
  if (id === 'dog-image') {
    placeHolder = './assets/img/dog-sml.png';
    animalType = 'dashing dog';
    compliment = 'awww-some';
  } else {
    placeHolder = './assets/img/cat-sml.png';
    animalType = 'cute cat';
    compliment = 'awww-dorable';
  }
  // classes for the favourite icon
  favouriteClass = 'non-favourited';
  favouriteIcon = 'far fa-heart';

  const imageTemplate= `<article class="app-card w3-col w3-padding" id="app-card-${id}-${i}">
  <div class="polaroid">
    <img id="${id}-${i}" class="polaroid-img" src="${placeHolder}" alt="placeholder" height=${polaroidImageHeight}>
    <!-- animal info (e.g. breed) -->
    <a href="" class="animal-info-url w3-cursive" id="animal-info-url-${id}-${i}"></a>
  </div>
  <!-- Aww slider -->
  <div>
      <p class="card-question w3-sans-serif w3-text-deep-purple">How ${compliment} is this ${id.substring(0, 3)}?</p>
      <div class="app-slider">
      <label for="aww-level-${id}-${i}">
          <span class="slider-emoji strong align-left">😕</span>
          <span class="slider-emoji strong align-center">😍</span>
          <span class="slider-emoji strong align-right">🥰</span>
      </label>
      </div>
      <input type="range" id="aww-level-${id}-${i}" name="aww-level" min="1" max="5" value="3">
  </div>
  <!-- Mood slider -->
  <div class="app-slider">
      <p class="card-question w3-sans-serif w3-text-deep-purple">Is this ${animalType} helping your Zen?</p>
      <label for="zen-level-${id}-${i}">
          <span class="slider-emoji strong align-left">😩</span>
          <span class="slider-emoji strong align-center">😐</span>
          <span class="slider-emoji strong align-right">😊</span>
      </label>
      <input type="range" id="zen-level-${id}-${i}" name="zen-level" min="1" max="5" value="3">
  </div>
  <!-- user comment -->
  <label for="user-comment-${id}-${i}">
      <input class="user-comment w3-input w3-border w3-border-deep-purple w3-text-deep-purple w3-sans-serif" type="text" id="user-comment-${id}-${i}" name="user-comment" placeholder="comment on this ${animalType}">
    </label>
  <!-- Buttons for various functions -->
  <div class="button-row">
   <a href="#" role="button" id="fav-btn-${id}-${i}" class="favourite-button ${favouriteClass} summary-button secondary outline w3-border-red"><i class="fav-icon ${favouriteIcon}"></i></a>
   <a href="#" data-approw = "${appRow}" role="button" id="submit-${id}-${i}" class="pulsing-button secondary outline w3-text-blue w3-sans-serif">Save Rating</a>
  </div>
   </article>`;

  return imageTemplate;
}

// check that the image is a valid size
function isValidImageSize(width, height) {
  if (width === undefined || height === undefined) {
    return false;
  }
  if (width === 0 || height === 0) {
    return false;
  }
  const aspectRatio = parseFloat( width) / parseFloat( height);
  return height >= minimumImageHeight && aspectRatio >= minimumImageAspectRatio && aspectRatio <= maximumImageAspectRatio;
}

// given a URL, determine if the image is a png or a jpg file
function isValidImageType(url) {
  return url.match(/\.(jpeg|jpg|png)$/) != null;
}

// ===================== Check if images have loaded =====================
// called by the timer tick event handler
// check if all images have loaded and replace any that failed to load or
// are not valid images (e.g. 404 error, or bad aspect ratio or resolution)
async function checkImageLoadStatus() {
  // check if all images have loaded
  if (parseInt(totalImagesLoaded) === dogImageCount + catImageCount || imageLoadTimer.totalTime >= 15000) {
    // all images have loaded or 15 seconds has passed
    // stop timer
    imageLoadTimer.stopTimer();
    // check if any images failed to load
    if (totalImagesFailed > 0) {
      // some images failed to load
      // replace invalid images in array and on page
      await replaceInvalidImages();
    } else {
      // all images loaded successfully, update ui and start the App!
      signalGoodToGo();
    }
  }
}
// ===================== End Check if images have loaded =====================

// ===================== Save Data to Local Storage =====================
function saveAnimals() {
  // save the dog and cat images to local storage
  saveAnimalsToLocalStorage('dog-images', '-app-run', dogImages);
  saveAnimalsToLocalStorage('cat-images', '-app-run', catImages);
}

// ===================== Event Handlers =====================
// custom event handlers
// handle the timer tick event to check that images have loaded
// or to trigger request for more images to replace invalid images
document.addEventListener('timerTick', checkImageLoadStatus);
// handle the event saying all images have loaded
document.addEventListener('goodToGo', goodToGoHandler);

// custom event handler that signifies that the acceptable dog and images have been retrieved
function goodToGoHandler() {
  document.getElementById('app-loading').classList.add('invisible-element');
  document.getElementById('image-store').classList.remove('invisible-element');
  document.getElementById('nav-burger').classList.remove('invisible-element');
  document.getElementById('app-title').classList.remove('invisible-element');
}

function signalGoodToGo() {
  loadingImages = false;
  const customEvent = new CustomEvent('goodToGo');
  document.dispatchEvent(customEvent);
}

// event handler for the button to save images
document.getElementById('save-images').addEventListener('click', (event) => {
  event.preventDefault();
  // save the final zen level to local storage
  localStorage.setItem('finalZenLevel', document.getElementById('zen-level').value);
  // save the images to local storage
  saveAnimals();
  // go to the ending page
  window.location.href = 'ending.html';
});

function addAnimalInfoURLEventListener(parentElement) {
  // Check if the current element has the class animal-info-url
  if (parentElement.classList && parentElement.classList.contains('animal-info-url')) {
    // Add the event listener to the info link element
    parentElement.addEventListener('click', showInfoModal);
  }

  // Traverse the child elements recursively
  if (parentElement.children && parentElement.children.length > 0) {
    for (const child of parentElement.children) {
      addAnimalInfoURLEventListener(child);
    }
  }
}

// toggle the favourite button
function handleFavouriteButtonClicked(event) {
  event.preventDefault();

  // NB event bubbling from icon to button, so may have to check parent element if no id
  let clickedElement = event.target;
  let id = clickedElement.id;
  if (!id) {
    clickedElement = clickedElement.parentElement;
    id = clickedElement.id;
  }

  if (id) {
    const animalType = getAnimalImageTypeFromID(id);
    const arrayIndex = parseInt( getAnimalImageIndexFromID(id));
    const favButton = document.getElementById('fav-btn-' + animalType + '-' + arrayIndex);
    favButton.classList.toggle('favourited');
    favButton.classList.toggle('non-favourited');
    if (animalType === 'cat-image') {
      catImages[arrayIndex].isFavourite = !catImages[arrayIndex].isFavourite;
    } else if (animalType === 'dog-image') {
      dogImages[arrayIndex].isFavourite = !dogImages[arrayIndex].isFavourite;
    }
  }
}

// event handler to show the info modal
function showInfoModal(event) {
  event.preventDefault();
  // display the modal
  const uiElement = event.target;
  const idValue = uiElement.id;
  const imageType = idValue.substring(16, 25);
  const idNumber = parseInt(idValue.substring(26));

  let infoURL;
  let modalTitle;
  let modalInfoText='';
  if (imageType === 'cat-image') {
    let catImage = new CatImage;
    catImage = catImages[parseInt(idNumber)];
    infoURL = catImage.infoURL;
    modalTitle = catImage.description;
  } else {
    let dogImage = new DogImage;
    dogImage = dogImages[parseInt(idNumber)];
    infoURL = dogImage.infoURL;
    modalTitle = dogImage.description;
    modalInfoText = getDogBreedInfo(dogImage.subBreed, dogImage.dogBreed);
  }
  if (infoURL === '') {
    return;
  }
  openModal(infoURL, modalTitle, modalInfoText);
}

// ===================== End Event Handlers =====================

// ===================== W3 Schools Sidebar =====================
function openSideBar() {
  document.getElementById('nav-burger').style.marginLeft = '25%';
  document.getElementById('app-sidebar').style.width = '25%';
  document.getElementById('app-sidebar').style.display = 'block';
  document.getElementById('open-nav').style.display = 'none';
}

function closeSideBar() {
  document.getElementById('nav-burger').style.marginLeft = '0%';
  document.getElementById('app-sidebar').style.display = 'none';
  document.getElementById('open-nav').style.display = 'inline-block';
}
// ===================== End W3 Schools Sidebar ===================