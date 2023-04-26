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

// function to get fresh dog and cat images
async function createAppElements() {
  // get the dog and cat images
  // and create the UI Cards and pair divs

  totalImagesLoaded = 0; // reset the counter
  totalImagesFailed = 0; // reset the counter

  // just in case the user or the page enters an invalid value
  if (dogImageCount === null || dogImageCount === undefined) {
    dogImageCount = 10;
  }
  if (catImageCount === null || catImageCount === undefined) {
    catImageCount = 10;
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
// TODO add filters to decide which images to keep
function saveDogsToLocalStorage(dogImages) {
  if (dogImages !== null) {
    const serialized = {
      dogs: [],
    };
    for (let i = 0; i < dogImages.length; i++) {
      let oDogImage = new DogImage();
      oDogImage = dogImages[i];
      const dog = oDogImage.serialize();
      serialized.dogs.push({
        dog,
      });
    }
    localStorage.setItem('dogImages', JSON.stringify(serialized));
  } else {
    localStorage.setItem('dogImages', '' );
  }
}
// TODO add filters to decide which images to keep
function saveCatsToLocalStorage(catImages) {
  if (catImages !== null) {
    const serialized = {
      cats: [],
    };
    for (let i = 0; i < catImages.length; i++) {
      let oCatImage = new CatImage();
      oCatImage = catImages[i];
      const cat = oCatImage.serialize();
      serialized.cats.push({
        cat,
      });
    }
    localStorage.setItem('catImages', JSON.stringify(serialized));
  } else {
    localStorage.setItem('catImages', '' );
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
}

function signalGoodToGo() {
  loadingImages = false;
  const customEvent = new CustomEvent('goodToGo');
  document.dispatchEvent(customEvent);
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
