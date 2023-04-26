// get the query string from the URL
let dogImageCount= 0;
let catImageCount = 0;
window.addEventListener('load', () => {
  console.log('Current window has loaded');
  const queryString = window.location.search;
  console.log(queryString); // Output: the query string in the current URL
  const searchParams = new URLSearchParams(queryString);
  dogImageCount = parseInt( searchParams.get('dogs')); // Output: value1
  catImageCount = parseInt(searchParams.get('cats')); // Output: value2
  console.log(searchParams.get('mood')); // Output: value3
  console.log(searchParams.get('name')); // Output: value4
  createAppElements();
});

// function to get fresh dog and cat images
async function createAppElements() {
  // get the dog and cat images
  // and create the UI Cards and pair divs

  totalImagesLoaded = 0; // reset the counter
  totalImagesFailed = 0; // reset the counter

  // just in case the user enters a value of 0 or null
  if (dogImageCount === null || dogImageCount === undefined || dogImageCount === 0) {
    dogImageCount = 10;
  }
  if (catImageCount === null || catImageCount === undefined || catImageCount === 0) {
    catImageCount = 10;
  }
  // call function to call dog and cat APIs
  // get container element in the page
  const parentElement= document.getElementById('image-store');
  parentElement.classList.add('invisible-element');

  console.log('dogImageCount: ' + dogImageCount + ' catImageCount: ' + catImageCount);
  await getFreshImages(dogImageCount, catImageCount, parentElement);
}

async function checkImageLoadStatus() {
  // check if all images have loaded
  console.log(`Checking image load status: ${totalImagesLoaded} of ${dogImageCount + catImageCount} images loaded`);
  if (parseInt(totalImagesLoaded) === dogImageCount + catImageCount || imageLoadTimer.totalTime >= 15000) {
    // all images have loaded or 15 seconds has passed
    console.log(`Total time passed ${imageLoadTimer.totalTime}`);
    // stop timer
    imageLoadTimer.stopTimer();
    // check if any images failed to load
    if (totalImagesFailed > 0) {
      // some images failed to load
      // replace invalid images in array and on page
      await replaceInvalidImages();
    } else {
      // all images loaded successfully, update ui
      sendEventImageError();
      signalGoodToGo();
    }
  }
}

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

// custom event handler
// just to update ui
document.addEventListener('dogRetrieval', dogRetrievalHandler);
document.addEventListener('catRetrieval', catRetrievalHandler);

document.addEventListener('imageError', imageErrorUIHandler);
// handle the timer tick event to check that images have loaded
// or to trigger request for more images to replace invalid images
document.addEventListener('timerTick', checkImageLoadStatus);
// handle the event saying all images have loaded
document.addEventListener('goodToGo', goodToGoHandler);

function dogRetrievalHandler(event) {
  // const dogStatus = document.getElementById('dog-status');
  // dogStatus.innerHTML = 'Getting Dogs: ' + event.detail.dogsRetrieved + ' of ' + event.detail.dogsAskedFor;
}

function catRetrievalHandler(event) {
  // const catStatus = document.getElementById('cat-status');
  // catStatus.innerHTML = 'Getting Cats: ' + event.detail.catsRetrieved + ' of ' + event.detail.catsAskedFor;
}

function imageErrorUIHandler(event) {
  // const errorStatus = document.getElementById('image-status');
  // errorStatus.innerHTML = 'Image Errors: ' + event.detail.imageErrors;
}

function goodToGoHandler() {
  // alert("All images loaded successfully");
  // const errorStatus = document.getElementById('image-status');
  // errorStatus.innerHTML = 'All done, good to go.';
  document.getElementById('app-loading').classList.add('invisible-element');
  document.getElementById('image-store').classList.remove('invisible-element');
  document.getElementById('nav-burger').classList.remove('invisible-element');
  document.getElementById('app-title').classList.remove('invisible-element');
}

// const toggleButton = document.getElementById('rotate-polaroids');
// let intervalId = null;
// toggleButton.addEventListener('click', function() {
//   if (intervalId) {
//     clearInterval(intervalId);
//     intervalId = null;
//     toggleButton.textContent = 'Start';
//   } else {
//     intervalId = setInterval(randomlyRotatePolaroids, 1000); // 5000 milliseconds = 5 seconds
//     toggleButton.textContent = 'Stop';
//   }
// });

// dispatch custom event to update UI
function sendEventDogsRetrieved() {
  const customEvent = new CustomEvent('dogRetrieval',
      {detail: {
        dogsRetrieved: dogImages.length,
        dogsAskedFor: dogImageCount,
      },
      });
  document.dispatchEvent(customEvent);
}

// dispatch custom event to update UI
function sendEventCatsRetrieved() {
  const customEvent = new CustomEvent('catRetrieval',
      {detail: {
        catsRetrieved: catImages.length,
        catsAskedFor: catImageCount,
      },
      });
  document.dispatchEvent(customEvent);
}

// dispatch custom event to update UI
function sendEventImageError() {
  const customEvent = new CustomEvent('imageError',
      {detail: {
        imageErrors: totalImagesFailed,
      },
      });
  document.dispatchEvent(customEvent);
}

function signalGoodToGo() {
  loadingImages = false;
  const customEvent = new CustomEvent('goodToGo');
  document.dispatchEvent(customEvent);
}

