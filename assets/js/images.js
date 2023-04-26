/* eslint-disable prefer-promise-reject-errors */
// set standards for acceptable image size and aspect ratio
const minimumImageHeight = 200;
const minimumImageAspectRatio = 0.90;
const maximumImageAspectRatio = 1.61;
let dogImages = []; // array of DogImage objects
let catImages = []; // array of CatImage objects
let totalImagesLoaded; // total number of images loaded, recorded by the load event
let totalImagesFailed; // total number of images that failed to load
let loadingPlaceholders = false; // flag to indicate if the placeholders are being loaded
let loadingImages = false; // flag to indicate if the images are being loaded
const imageLoadTimer = new LoadTimer; // timer to check if all the images have loaded
const polaroidImageHeight = 360; // height of the polaroid image in pixels

// Illustration by <a href="https://icons8.com/illustrations/author/GrbQqWBEhaDS">Liam Moore</a> from <a href="https://icons8.com/illustrations">Ouch!</a>

// given a URL, determine if the image is a png or a jpg file
function isValidImageType(url) {
  return url.match(/\.(jpeg|jpg|png)$/) != null;
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

// delay function to use with async/await
function delay(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

// give a random rotation to elements with classes of a certain name
function randomlyRotateElements(elementClassName) {
  // Select all the polaroid containers
  const selectedElements = document.querySelectorAll(`.${elementClassName}`);

  // Loop through each container and apply a random rotation
  selectedElements.forEach((element) => {
    const rotation = getRandomRotation(-9, 9); // Adjust the range for your desired effect
    element.style.transform = `rotate(${rotation}deg)`;
  });
}

// Define a function to generate a random rotation within a range
function getRandomRotation(min, max) {
  return Math.random() * (max - min) + min;
}

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
  for (let i=0; i < combinedArray.length; i++) {
    // every even image, add a new row div
    if (i % 2 === 0) {
      newRow = document.createElement('div');
      newRow.classList.add('app-row');
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
    newRow.appendChild(imageElement);
    // add the new row to the parent element after the odd number image or the last one regardless
    if (i % 2 === 1 || i === combinedArray.length - 1) {
      parentElement.appendChild(newRow);
    }
  }
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

  const imageTemplate= `<article class="app-card w3-col w3-padding" id="app-card-${id}-${i}">
  
  <div class="polaroid">
    <img id="${id}-${i}" class="polaroid-img" src="${placeHolder}" alt="placeholder" height=${polaroidImageHeight}>
    <!-- text align (e.g. breed) -->
    <p class="animal-caption w3-cursive" id="animal-caption-${id}-${i}"></p>
  </div>
  <!-- Aww slider -->
  <div>
      <p class="card-question w3-text-deep-purple">How ${compliment} is this ${id.substring(0, 3)}?</p>
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
      <p class="card-question w3-text-deep-purple">Is this ${animalType} helping your Zen?</p>
      <label for="zen-level-${id}-${i}">
          <span class="slider-emoji strong align-left">😩</span>
          <span class="slider-emoji strong align-center">😐</span>
          <span class="slider-emoji strong align-right">😊</span>
      </label>
      <input type="range" id="mood-level-${id}-${i}" name="range" min="1" max="5" value="3">
  </div>
  <!-- user comment -->
  <label for="user-comment-${id}-${i}">
      <input class="user-comment w3-input w3-border w3-border-deep-purple w3-text-deep-purple" type="text" id="user-comment-${id}-${i}" name="user-comment" placeholder="comment on this ${animalType}">
    </label>
  <!-- Buttons for various functions -->
   <a href="#" role="button" id="fav-btn-${id}-${i}" class="w3-text-amber secondary outline w3-border-amber w3-hover-border-green favourite"><i class="fa-solid fa-bookmark"></i></a>
   <a href="#" role="button" id="download-${id}-${i}" class="secondary outline w3-text-blue"><i class="fa-solid fa-download"></i></a>
   <a href="#" role="button" id="facebook-${id}-${i}" class="secondary outline w3-text-blue"><i class="fa-brands fa-square-facebook"></i></a>
   <a href="#" role="button" id="twitter-${id}-${i}" class="secondary outline w3-text-blue"><i class="fa-brands fa-twitter"></i></a>
   <a href="#" role="button" id="submit-${id}-${i}" class="pulsing-button secondary outline w3-text-blue">Save Rating</a>
</article>`;

  return imageTemplate;
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

  // add event listener to the images
  addImageLoadedEventListener(parentElement);
  addPulsingButtonEventListener(parentElement);

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
    catImages[i].addCaptionToImgByID(`animal-caption-cat-image-${i}`);
    addImageToLoadingRow(catImages[i].url);
  };
  //   console.log('dogImages tally', dogImages.length);
  for (let i = 0; i < dogImages.length; i++) {
    // add them to the DOM in the img elements via the AnimalImage class
    dogImages[i].addURLAndAltToImgByID(`dog-image-${i}`);
    dogImages[i].addCaptionToImgByID(`animal-caption-dog-image-${i}`);
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
    if (imagesYetToFetch > maxImagesRequest) currentImagesRequest = maxImagesRequest;
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
    // create the custom event and store the current state of the retrieval inside it
    // const eventAnimalRetrieved = new CustomEvent('dogRetrieval',
    //     {detail: {
    //       dogsRetrieved: dogImageStore.length,
    //       dogsAskedFor: imageCount,
    //     },
    //     });
    // document.dispatchEvent(eventAnimalRetrieved);

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
  const maxImagesRequest = CatAPICall.preferredMaxCount();

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
    if (imagesYetToFetch > maxImagesRequest) currentImagesRequest = maxImagesRequest;
  }

  // get cat image data from the APIs
  const apiCall = new CatAPICall(currentImagesRequest);
  const returnData = new CatData(await apiCall.callAPI());
  // if API call was successful
  if (returnData.apiReturn.responseStatus === 200) {
    // save cat images object to array
    newCats=returnData.dataToArray();
  } else {
    // if API call was not successful
    // display error message
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
    newCats[i].description = randomAffirmation();
    catImageStore.push(newCats[i]);

    // create the custom event and store the current state of the retrieval inside it
    // const eventAnimalRetrieved = new CustomEvent('catRetrieval',
    //     {detail: {
    //       catsRetrieved: catImageStore.length,
    //       catsAskedFor: imageCount,
    //     },
    //     });
    // document.dispatchEvent(eventAnimalRetrieved);

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
    console.log('added event listener to img element');
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
            console.log('pulsing-button clicked');
            event.preventDefault();
            parentElement.classList.remove('pulsing-button');
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
//   console.log(`image loaded ${loadingPlaceholders}`);
  if (loadingPlaceholders) return;
  //   console.log('image loaded');
  const imageOfConcern = event.target;
  const imageAltText = imageOfConcern.alt;
  console.log(`imageAltText: ${imageAltText}` );
  if (imageAltText === 'placeholder') return;
  const idValue = imageOfConcern.id;

  if (idValue === undefined || idValue.length === 0) return;
  totalImagesLoaded++;
  console.log(`totalImagesLoaded by event: ${totalImagesLoaded}`);
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
    sendEventImageError();
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
  console.log(`image error ${loadingPlaceholders}`);
  if (loadingPlaceholders) return;
  console.log('image error');
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
  sendEventImageError();
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
  sendEventImageError();
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
        dogImages[i].addCaptionToImgByID(`animal-caption-dog-image-${i}`);
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
        catImages[i].addCaptionToImgByID(`animal-caption-cat-image-${i}`);
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

function randomAffirmation() {
    return petAffirmationsArray[getRandomInt(0, petAffirmationsArray.length - 1)];
}

// ==================================================================
// Utility Functions
// ==================================================================
function randomlyRotatePolaroids() {
  // Select all the polaroid containers
  const polaroidContainers = document.querySelectorAll('.polaroid');

  // Loop through each container and apply a random rotation
  polaroidContainers.forEach((container) => {
    const rotation = getRandomRotation(-4, 4); // Adjust the range for your desired effect
    container.style.transform = `rotate(${rotation}deg)`;
  });
}

// Define a function to generate a random rotation within a range
function getRandomRotation(min, max) {
  return Math.random() * (max - min) + min;
}

// get a random integer between min and max
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// randomize the order of an array using the Fisher-Yates (Knuth) shuffle
function randomizeArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = getRandomInt(0, i);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// ==================================================================
