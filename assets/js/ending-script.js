const polaroidSummaryImageHeight = 180; // height of the polaroid summary image in pixels
const dogImages = []; // array of DogImage objects
const catImages = []; // array of CatImage objects
let dogImagesCutest = []; // array of DogImage objects
let catImagesCutest = []; // array of CatImage objects
let dogImagesUgliest = []; // array of DogImage objects
let catImagesUgliest = []; // array of CatImage objects
let dogImagesMostZen = []; // array of DogImage objects
let catImagesMostZen = []; // array of CatImage objects
let dogImagesFavourites = []; // array of DogImage objects
let catImagesFavourites = []; // array of CatImage objects


// ==================================================================
//
window.addEventListener('load', () => {
  // get the cutest dog and cat images
  retrieveLocallyStoredAnimals('cute');
  retrieveLocallyStoredAnimals('ugly');
  retrieveLocallyStoredAnimals('zen');
  retrieveLocallyStoredAnimals('fav');
  for (let i=0; i<dogImagesCutest.length; i++) {
    console.log(dogImagesCutest[i].url);
  }
  // display the cutest dog and cat images etc
  displayResultantAnimals();
});

function displayResultantAnimals() {
  // display the cutest dog and cat images
  const totalToDisplay = 4;
  const containerElement = document.getElementById('cutest');
  const totalDisplayed = 0;
  const totalDogs = dogImagesCutest.length;
  const totalCats= catImagesCutest.length;
  const totalAvailable = totalDogs + totalCats;
  let dogsToDisplay = 0;
  let catsToDisplay = 0;
  if (totalAvailable >= totalDisplayed) {
    // we have plenty of images to display
    if (totalDogs >=2 && totalCats >=2) {
      dogsToDisplay = 2;
      catsToDisplay = 2;
    } else if (totalDogs >=2 && totalCats <2) {
      dogsToDisplay = totalToDisplay - totalCats;
      catsToDisplay = totalCats;
    } else if (totalDogs <2 && totalCats >=2) {
      dogsToDisplay = totalDogs;
      catsToDisplay = totalToDisplay - totalDogs;
    } else {
      dogsToDisplay = totalDogs;
      catsToDisplay = totalCats;
    }
  } else {
    // we don't have enough images to display
    dogsToDisplay = totalDogs;
    catsToDisplay = totalCats;
  }
  // add the dog images to the container
  for (let i=0; i<dogsToDisplay; i++) {
    const dogImage = dogImagesCutest[i];
    const newDiv = document.createElement('div');
    newDiv.innerHTML = emptyEndingCardHTML(containerElement, 'dog-image', i, dogImage.url, dogImage.description, dogImage.userComment, dogImage.infoURL, dogImage.isFavourite);
    containerElement.appendChild(newDiv);
  };
  // add the cat images to the container
  for (let i=0; i<catsToDisplay; i++) {
    const catImage = catImagesCutest[i];
    const newDiv = document.createElement('div');
    newDiv.innerHTML = emptyEndingCardHTML(newDiv, 'cat-image', i, catImage.url, catImage.description, catImage.userComment, catImage.infoURL, catImage.isFavourite);
    containerElement.appendChild(newDiv);
  };
}


// create the HTML for an empty animal card
function emptyEndingCardHTML(parentElement, id, i, url, altText, comment, animalInfoUrl, favourited) {
  // construct the image template

  let favouriteClass;
  if (favourited) {
    favouriteClass = 'w3-text-amber';
  } else {
    favouriteClass = 'w3-text-grey';
  }
  const imageTemplate= `<article class="app-card w3-col w3-padding" id="app-card-${id}-${i}">
    <div class="polaroid">
      <img id="${id}-${i}" class="polaroid-img" src="${url}" alt="${altText}" height=${polaroidSummaryImageHeight}>
      <!-- animal info (e.g. breed) -->
      <a href="${animalInfoUrl}" class="animal-info-url w3-cursive" id="animal-info-url-${id}-${i}">${altText}</a>
    </div>
    <!-- user comment -->
    <div class="w3-row w3-center">
    <p class="summary-comment w3-text-deep-purple w3-sans-serif" type="text" id="user-comment-${id}-${i}">${comment}</p>
    <!-- Buttons for various functions -->
     <a href="#" role="button" id="fav-btn-${id}-${i}" class="${favouriteClass} summary-button secondary outline w3-border-amber w3-hover-border-green favourite"><i class="fa-solid fa-bookmark"></i></a>
     <a href="#" role="button" id="download-${id}-${i}" class="summary-button secondary outline w3-text-blue"><i class="fa-solid fa-download"></i></a>
     <a href="#" role="button" id="facebook-${id}-${i}" class="summary-button secondary outline w3-text-blue"><i class="fa-brands fa-square-facebook"></i></a>
     <a href="#" role="button" id="twitter-${id}-${i}" class="summary-button secondary outline w3-text-blue"><i class="fa-brands fa-twitter"></i></a>
    </div>
    </article>`;

  return imageTemplate;
}

function retrieveLocallyStoredAnimals(dataStore) {
  const savedDogs = [];
  const savedCats = [];
  // TODO - remove this when we have a real data store
  const tempStore = 'temp';
  // get dog images from local storage
  const dogImagesFromStorage = JSON.parse(localStorage.getItem(tempStore + '-dogs'));
  // get cat images from local storage
  const catImagesFromStorage = JSON.parse(localStorage.getItem(tempStore + '-cats'));

  // if dog images and cat images are not null
  if (dogImagesFromStorage !== null ) {
    // convert to an array of dog images
    for (let i = 0; i < dogImagesFromStorage.dogs.length; i++) {
      const dogImage =new DogImage();
      dogImage.deserialize(dogImagesFromStorage.dogs[i].dog);
      savedDogs.push(dogImage);
    }
  }

  if (catImagesFromStorage !== null ) {
    // create an array of cat images
    for (let i = 0; i < catImagesFromStorage.cats.length; i++) {
      //   console.log(i + ' ' + catImagesFromStorage.cats[i].cat);
      const catImage =new CatImage();
      catImage.deserialize(catImagesFromStorage.cats[i].cat);
      savedCats.push(catImage);
    }
  }

  // randomize the saved dogs and cats as we are only showing 4
  randomizeArray(savedCats);
  randomizeArray(savedDogs);

  // copy the saved dogs and cats to the appropriate array
  switch (dataStore) {
    case 'cute':
      dogImagesCutest = savedDogs;
      catImagesCutest = savedCats;
      break;
    case 'ugly':
      dogImagesUgliest = savedDogs;
      catImagesUgliest = savedCats;
      break;
    case 'zen':
      dogImagesMostZen = savedDogs;
      catImagesMostZen = savedCats;
      break;
    case 'fav':
      dogImagesFavourites = savedDogs;
      catImagesFavourites = savedCats;
      break;
    default:
      break;
  }
}

