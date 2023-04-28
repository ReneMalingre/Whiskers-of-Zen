let dogImages = []; // array of DogImage objects
let catImages = []; // array of CatImage objects
let totalImagesLoaded; // total number of images loaded, recorded by the load event
let totalImagesFailed; // total number of images that failed to load
let loadingPlaceholders = false; // flag to indicate if the placeholders are being loaded
let loadingImages = false; // flag to indicate if the images are being loaded
const polaroidImageHeight = 360; // height of the polaroid image in pixels
const imageLoadTimer = new LoadTimer; // timer to check if all the images have loaded

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
  // console.log(searchParams.get('mood')); // Output: value3
  // console.log(searchParams.get('name')); // Output: value4
  createAppElements();
});

// add the empty img to the DOM to prepare for the image to be added later
// this allows event listeners to be added to the image before they are populated
function addEmptyAppCardsToDom(dogImagesTally, catImagesTally, parentElement) {
  // create random array to determine which images are dogs and which are cats
  const dogsArray = Array(dogImagesTally).fill(1);
  const combinedArray = dogsArray.concat(Array(catImagesTally).fill(2));
  // shuffle the array
  randomizeArray(combinedArray);
  //   console.log(combinedArray);

  // create the empty App cards
  let dogIndex = 0;
  let catIndex = 0;
  let id;
  let index;
  let newRow;
  let appCardRow;
  for (let i=0; i < combinedArray.length; i++) {
    // every even image, add a new row div
    // TODO set the first row to be visible and subsequent rows to be hidden
    // TODO by adding the .invisible-element class to the row div
    if (i % 2 === 0) {
      newRow = document.createElement('div');
      newRow.classList.add('app-card-row');
      // add an affirmation to the row
      const affirmation = randomAffirmation();
      // add a div to contain the affirmation
      const affirmationDiv = document.createElement('div');
      affirmationDiv.innerHTML = `<h3 class="w3-cursive w3-text-white affirmation">${affirmation}</h4>`;
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
    const imageTemplate= emptyAppCardHTML(id, index);
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
  // alert('getDogBreeds');

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

  // add event listener to the UI elements
  addImageLoadedEventListener(parentElement);
  addPulsingButtonEventListener(parentElement);
  addAnimalInfoURLEventListener(parentElement);
  // addEventListenerToDOMBranch(parentElement, 'fav-btn', 'click', handleFavoriteButton);
  addEventListenerToDOMBranch(parentElement, 'share-btn', 'click', handleShareButton);
  addEventListenerToDOMBranch(parentElement, 'download-btn', 'click', handleDownloadButton);

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
  //   console.log('catImages tally', catImages.length);
  for (let i = 0; i < catImages.length; i++) {
    // add them to the DOM in the img elements via the AnimalImage class
    catImages[i].addURLAndAltToImgByID(`cat-image-${i}`);
    // catImages[i].addCaptionToImgByID(`animal-caption-cat-image-${i}`);
    catImages[i].addInfoURLByID(`animal-info-url-cat-image-${i}`);
    addImageToLoadingRow(catImages[i].url);
  };
  //   console.log('dogImages tally', dogImages.length);
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
    alert(`Could not retrieve dog url collection data: ${returnData.apiReturn.errorMessage}`);
    return;
  }
  for (let i = 0; i < newDogs.length; i++) {
    const url = newDogs[i].url;
    // ensure they are jpg or png
    if (!isValidImageType(url)) {
    //   console.log(`Invalid image type: ${url}`);
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
  if (returnData.apiReturn.responseStatus === 200) { // TODO see if other codes are ok here??
    // save cat images object to array
    newCats=returnData.dataToArray(); // this returns an array of CatImage objects
  } else {
    // if API call was not successful
    // display error message
    // TODO - use a modal to display the error message, not inbuilt alert due to project requirements
    alert(`Could not retrieve cat url collection data: ${returnData.apiReturn.errorMessage}`);
    return;
  }
  for (let i = 0; i < newCats.length; i++) {
    const url = newCats[i].url;
    // ensure they are jpg or png
    if (!isValidImageType(url)) {
    //   console.log(`Invalid image type: ${url}`);
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
    // console.log('🚀 ~ file: images.js:373 ~ getFreshCatImages ~ newCats:', newCats[i]);

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
    // console.log('added event listener to img element');
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
      // console.log('pulsing-button clicked');
      event.preventDefault();
      parentElement.classList.remove('pulsing-button');
      // TODO - get the user selections and add them to the right dogImage or catImage object
      // get the id of the button that was clicked
      // this will be 'submit-dog-image-0 or submit-cat-image-0
      const buttonClicked= event.target;
      const idValue = buttonClicked.id;
      // ! For Iggy - this is where you need to get the slider value etc and add it to the dogImage or catImage object
//       if(idValue.includes('dog')) {
//       dogImage[i].isFavourite=true;
//       dogImage[i].cuteRating = sliderElement.value;
//       } else {
// catImage[i].isFavourite=true;
//       }


    });
  }

  // Traverse the child elements recursively
  if (parentElement.children && parentElement.children.length > 0) {
    for (const child of parentElement.children) {
      addPulsingButtonEventListener(child);
    }
  }
}

function addAnimalInfoURLEventListener(parentElement) {
  // Check if the current element has the class animal-info-url
  if (parentElement.classList && parentElement.classList.contains('animal-info-url')) {
    // Add the event listener to the info link element
    parentElement.addEventListener('click', function(event) {
      console.log('info link clicked');
      event.preventDefault();
      // display the modal
      const uiElement = event.target;
      const idValue = uiElement.id;
      // console.log('🚀 ~ file: images.js:445 ~ parentElement.addEventListener ~ idValue:', idValue);

      const imageType = idValue.substring(16, 25);
      // console.log('🚀 ~ file: images.js:448 ~ parentElement.addEventListener ~ imageType:', imageType);

      const idNumber = parseInt(idValue.substring(26));
      // console.log('🚀 ~ file: images.js:451 ~ parentElement.addEventListener ~ idNumber:', idNumber);

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
    });
  }

  // Traverse the child elements recursively
  if (parentElement.children && parentElement.children.length > 0) {
    for (const child of parentElement.children) {
      addAnimalInfoURLEventListener(child);
    }
  }
}

// get event handler that recognises that an image has loaded
function imageLoadedHandler(event) {
//   console.log(`image loaded ${loadingPlaceholders}`);
  if (loadingPlaceholders) return;
  //   console.log('image loaded');
  const imageOfConcern = event.target;
  const imageAltText = imageOfConcern.alt;
  // console.log(`imageAltText: ${imageAltText}` );
  if (imageAltText === 'placeholder') return;
  const idValue = imageOfConcern.id;

  if (idValue === undefined || idValue.length === 0) return;
  totalImagesLoaded++;
  // console.log(`totalImagesLoaded by event: ${totalImagesLoaded}`);
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
  // console.log(`image error ${loadingPlaceholders}`);
  if (loadingPlaceholders) return;
  // console.log('image error');
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
    // console.log('loading new dog images ' + dogImages.length);
    for (let i = 0; i < dogImages.length; i++) {
      if (dogImages[i].invalidImage) {
        dogImages[i] = dogImageStore[dogImageIndex];
        dogImages[i].url = dogImageStore[dogImageIndex].url;
        dogImages[i].invalidImage = false;
        dogImages[i].description = dogImageStore[dogImageIndex].description;
        dogImages[i].addURLAndAltToImgByID(`dog-image-${i}`);
        // dogImages[i].addCaptionToImgByID(`animal-caption-dog-image-${i}`);
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
    // console.log('loading new cat images ' + catImages.length);
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
        // catImages[i].addCaptionToImgByID(`animal-caption-cat-image-${i}`);
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
async function createAppElements() {
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
    dogImageCount = 10;
    catImageCount = 10;
  }

  // call function to call dog and cat APIs
  // get container element in the page
  const parentElement= document.getElementById('image-store');
  parentElement.classList.add('invisible-element');

  // console.log('dogImageCount: ' + dogImageCount + ' catImageCount: ' + catImageCount);
  // dog and cat image count is valid, go to the remote servers and get the images!
  // most of this code is in the images.js file
  await getFreshImages(dogImageCount, catImageCount, parentElement);
}

// create the HTML for an empty animal card
function emptyAppCardHTML(id, i) {
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
  // string literals are awesome!

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
      <input type="range" id="aww-level-${id}-${i}" name="range" min="1" max="5" value="3">
  </div>
  <!-- Mood slider -->
  <div class="app-slider">
      <p class="card-question w3-sans-serif w3-text-deep-purple">Is this ${animalType} helping your Zen?</p>
      <label for="zen-level-${id}-${i}">
          <span class="slider-emoji strong align-left">😩</span>
          <span class="slider-emoji strong align-center">😐</span>
          <span class="slider-emoji strong align-right">😊</span>
      </label>
      <input type="range" id="mood-level-${id}-${i}" name="range" min="1" max="5" value="3">
  </div>
  <!-- user comment -->
  <label for="user-comment-${id}-${i}">
      <input class="user-comment w3-input w3-border w3-border-deep-purple w3-text-deep-purple w3-sans-serif" type="text" id="user-comment-${id}-${i}" name="user-comment" placeholder="comment on this ${animalType}">
    </label>
  <!-- Buttons for various functions -->
   <a href="#" role="button" id="fav-btn-${id}-${i}" class="fav-btn w3-text-amber secondary outline w3-border-amber w3-hover-border-green favourite"><i class="fa-solid fa-bookmark"></i></a>
   <a href="#" role="button" id="download-${id}-${i}" class="download-btn secondary outline w3-text-blue"><i class="fa-solid fa-download"></i></a>
   <a href="#" role="button" id="facebook-${id}-${i}" class="share-btn secondary outline w3-text-blue"><i class="fa-brands fa-square-facebook"></i></a>
   <a href="#" role="button" id="twitter-${id}-${i}" class="twitter-btn secondary outline w3-text-blue"><i class="fa-brands fa-twitter" target="_blank"></i></a>
   <a href="#" role="button" id="submit-${id}-${i}" class="pulsing-button secondary outline w3-text-blue w3-sans-serif">Save Rating</a>
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
  // console.log(`Checking image load status: ${totalImagesLoaded} of ${dogImageCount + catImageCount} images loaded`);
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
function tempSaveAnimals() {
  // save the dog and cat images to local storage
  // TODO add filters to decide which images to keep
  saveDogsToLocalStorage('temp-dogs', dogImages);
  saveCatsToLocalStorage('temp-cats', catImages);
}
// TODO add filters to decide which images to keep
// save images to local storage, pass null to wipe out local storage
function saveDogsToLocalStorage(storeName, dogImagesToSave=null) {
  if (dogImagesToSave !== null) {
    const serialized = {
      dogs: [],
    };
    for (let i = 0; i < dogImages.length; i++) {
      let oDogImage = new DogImage();
      oDogImage = dogImagesToSave[i];
      oDogImage.cuteRating = 5;
      oDogImage.zenRating = 5;
      oDogImage.userComment = 'This is a cute dog';
      oDogImage.isFavourite = true;
      const dog = oDogImage.serialize();
      serialized.dogs.push({
        dog,
      });
    }
    localStorage.setItem(storeName, JSON.stringify(serialized));
  } else {
    localStorage.setItem(storeName, '' );
  }
}
// TODO add filters to decide which images to keep
// save images to local storage, pass null to wipe out local storage
function saveCatsToLocalStorage(storeName, catImagesToSave = null) {
  if (catImagesToSave !== null) {
    const serialized = {
      cats: [],
    };
    for (let i = 0; i < catImagesToSave.length; i++) {
      let oCatImage = new CatImage();
      oCatImage = catImagesToSave[i];
      oCatImage.cuteRating = 5;
      oCatImage.zenRating = 5;
      oCatImage.userComment = 'This is a snugglicious cat';
      oCatImage.isFavourite = true;
      const cat = oCatImage.serialize();
      serialized.cats.push({
        cat,
      });
    }
    localStorage.setItem(storeName, JSON.stringify(serialized));
  } else {
    localStorage.setItem(storeName, '' );
  }
}
// ===================== End Save Data to Local Storage =====================

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
  // ! temp, display the dog breeds
  // const dogBreedDiv = document.getElementById('temp-breeds');
  // for (let i=0; i < dogBreedInformation.length; i++) {
  //   const dogBreed = document.createElement('p');
  //   dogBreed.innerHTML = `${dogBreedInformation[i].dogBreed}<br>&nbsp;&nbsp;&nbsp;${dogBreedInformation[i].description}`;
  //   dogBreedDiv.appendChild(dogBreed);
  // };
}

function signalGoodToGo() {
  loadingImages = false;
  const customEvent = new CustomEvent('goodToGo');
  document.dispatchEvent(customEvent);
}

// event handler for the button to save images
document.getElementById('save-images').addEventListener('click', () => {
  // save the images to local storage
  tempSaveAnimals();
});

function closeInfoModal() {
  document.getElementById('modal-info').style.display='none';
  document.getElementById('modal-info-iframe').src = '';
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
function openModal(url, title, infoText) {
  document.getElementById('modal-info-iframe').src = '';
  document.getElementById('modal-info-iframe').src = url;
  document.getElementById('modal-info-link').setAttribute('href', url);
  document.getElementById('modal-info-title').textContent = toTitleCase(title);
  document.getElementById('modal-info-description').textContent = infoText;
  document.getElementById('modal-info').style.display = 'block';
}


