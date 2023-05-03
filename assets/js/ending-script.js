const polaroidSummaryImageHeight = 180; // height of the polaroid summary image in pixels
let dogImages = []; // array of DogImage objects
let catImages = []; // array of CatImage objects
let dogImagesCutest = []; // array of DogImage objects
let catImagesCutest = []; // array of CatImage objects
let dogImagesUgliest = []; // array of DogImage objects
let catImagesUgliest = []; // array of CatImage objects
let dogImagesMostZen = []; // array of DogImage objects
let catImagesMostZen = []; // array of CatImage objects
let dogImagesFavourites = []; // array of DogImage objects
let catImagesFavourites = []; // array of CatImage objects

let purrfectionistAchievementLevel = 0; // achievement level for purrfectionist - rating cats tally
let doggedDeterminationAchievementLevel = 0; // achievement level for dogged determination - rating dogs tally

let barkingUpTheRightTreeAchievementLevel = 0; // achievement level for barking up the right tree - dogs improving mood
let purrsitiveVibesAchievementLevel = 0; // achievement level for pawsitive vibes - cats improving mood

let noKittenAroundAchievementLevel = 0; // achievement level for no kitten around (max cute cats)
let hotDiggityDogAchievementLevel = 0; // achievement level for hot diggity dog (max cute dogs)

let superCuteAchievementLevel = false; // achievement level for super cute, all dogs cats today are cute
let totallyZenAchievementLevel = false; // achievement level for totally zen, all dogs and cats today are zen
let zenPointsAdded = 0; // total zen points added today
// ==================================================================
//
window.addEventListener('load', () => {
  // get the dogs and cats out of local storage
  retrieveAppRunAnimals();
  // TODO remove for production code: get the dog breeds in case it hasn't happened yet
  getDogBreeds();

  // display the cutest dog and cat images into the categories
  displayResultantAnimals();
  // add event listeners to the buttons
  const parentElement = document.body;
  const className = 'favourite-button';
  const eventName = 'click';
  const functionToCall = handleFavouriteButtonClick;
  addEventListenerToDOMBranch(parentElement, className, eventName, functionToCall );
  // add event listeners to the breed captions
  addInfoModalToDOM();
  addImageModalToDOM();
  addAnimalInfoURLEventListener(parentElement);
  addEventListenerToDOMBranch(parentElement, 'polaroid-img', 'click', animalImageClicked);
});

function retrieveAppRunAnimals() {
  // get the images out of local storage from the app run
  dogImages = getAnimalsFromLocalStorage('dog-images', '-app-run');
  catImages = getAnimalsFromLocalStorage('cat-images', '-app-run');
  // check for achievements
  checkForAchievements(dogImages, catImages);

  // sort the images into cutest, ugliest, most zen and favourites
  dogImagesCutest = sortArrayByCuteRatingDescending(dogImages);
  catImagesCutest = sortArrayByCuteRatingDescending(catImages);
  dogImagesUgliest = sortArrayByCuteRatingAscending(dogImages);
  catImagesUgliest = sortArrayByCuteRatingAscending(catImages);
  dogImagesMostZen = sortArrayByZenRatingDescending(dogImages);
  catImagesMostZen = sortArrayByZenRatingDescending(catImages);

  // get and randomise the favourite images rather than showing them by display order
  dogImagesFavourites = randomizeArray(filterFavourites(dogImages));
  if (!dogImagesFavourites) {
    dogImagesFavourites = [];
  }
  catImagesFavourites = randomizeArray(filterFavourites(catImages));
  if (!catImagesFavourites) {
    catImagesFavourites = [];
  }

  // get the past favourites and add on the new favourites if they are unique
  let pastDogFavourites = getAnimalsFromLocalStorage('dog-images', '-favourites');
  if (!pastDogFavourites) {
    pastDogFavourites = [];
  }
  let pastCatFavourites = getAnimalsFromLocalStorage('cat-images', '-favourites');
  if (!pastCatFavourites) {
    pastCatFavourites = [];
  }
  // add the new favourites to the stored favourites from previous runs
  for (let i=0; i<dogImagesFavourites.length; i++) {
    addDogImageToFavourites(dogImagesFavourites[i]);
  }
  for (let i=0; i<catImagesFavourites.length; i++) {
    addCatImageToFavourites(catImagesFavourites[i]);
  }
}

function checkForAchievements(dogImages, catImages) {
  // initial and final zen level
  let initialZenLevel = localStorage.getItem('initialZenLevel');
  if (!initialZenLevel) {
    initialZenLevel = 3;
  }
  document.getElementById('user-zen-before').textContent = initialZenLevel;

  let finalZenLevel = parseInt(localStorage.getItem('finalZenLevel'));
  if (!finalZenLevel) {
    finalZenLevel = 3;
  }
  document.getElementById('zen-level-current').textContent = finalZenLevel;

  // count the number of images in the arrays
  const dogCount = dogImages.length;
  const catCount = catImages.length;
  // get the maximum ratings
  const dogMaximumZen = dogImages.filter((animal) => animal.zenRating > 3).length;
  const catMaximumZen = catImages.filter((animal) => animal.zenRating > 3).length;
  const dogMaximumCute = dogImages.filter((animal) => animal.cuteRating > 3).length;
  const catMaximumCute = catImages.filter((animal) => animal.cuteRating > 3).length;
  const dogZenPoints = dogImages.reduce((total, item) => total + parseInt( item.zenRating) - 3, 0);
  const catZenPoints = catImages.reduce((total, item) => total + parseInt( item.zenRating) - 3, 0);

  // total Zen Points
  zenPointsAdded = dogZenPoints + catZenPoints;
  // add it to the DOM
  document.getElementById('zen-points-total').textContent = zenPointsAdded;
  // purrfectionistAchievementLevel & doggedDeterminationAchievementLevel
  // get historic statistics
  let historicDogImages = localStorage.getItem('dog-images-rated');
  let historicCatImages = localStorage.getItem('cat-images-rated');
  if (!historicDogImages) {
    historicDogImages = 0;
  }
  if (!historicCatImages) {
    historicCatImages = 0;
  }
  historicDogImages= parseInt(historicDogImages) + dogCount;
  historicCatImages= parseInt(historicCatImages) + catCount;
  // save the historic statistics
  localStorage.setItem('dog-images-rated', historicDogImages);
  localStorage.setItem('cat-images-rated', historicCatImages);
  // check for achievements
  // purrfectionist
  purrfectionistAchievementLevel = historicCatImages;
  // dogged determination
  doggedDeterminationAchievementLevel = historicDogImages;


  // maximum zen: barkingUpTheRightTreeAchievementLevel and purrsitiveVibesAchievementLevel
  // get historic statistics
  let dogHistoricMaxZen = localStorage.getItem('dog-max-zen');
  let catHistoricMaxZen = localStorage.getItem('cat-max-zen');
  if (!dogHistoricMaxZen) {
    dogHistoricMaxZen = 0;
  }
  if (!catHistoricMaxZen) {
    catHistoricMaxZen = 0;
  }
  dogHistoricMaxZen = parseInt(dogHistoricMaxZen) + dogMaximumZen;
  catHistoricMaxZen = parseInt(catHistoricMaxZen) + catMaximumZen;
  localStorage.setItem('dog-max-zen', dogHistoricMaxZen);
  localStorage.setItem('cat-max-zen', catHistoricMaxZen);
  // barking up the right tree
  barkingUpTheRightTreeAchievementLevel = dogHistoricMaxZen;
  // pawsitive vibes
  purrsitiveVibesAchievementLevel = catHistoricMaxZen;

  // maximum cute: hotDiggityDogAchievementLevel and noKittenAroundAchievementLevel
  // get historic statistics
  let dogHistoricMaxCute = localStorage.getItem('dog-max-cute');
  let catHistoricMaxCute = localStorage.getItem('cat-max-cute');
  if (!dogHistoricMaxCute) {
    dogHistoricMaxCute = 0;
  }
  if (!catHistoricMaxCute) {
    catHistoricMaxCute = 0;
  }
  dogHistoricMaxCute = parseInt(dogHistoricMaxCute) + dogMaximumCute;
  catHistoricMaxCute = parseInt(catHistoricMaxCute) + catMaximumCute;
  localStorage.setItem('dog-max-cute', dogHistoricMaxCute);
  localStorage.setItem('cat-max-cute', catHistoricMaxCute);
  // hot diggity dog
  hotDiggityDogAchievementLevel = dogHistoricMaxCute;
  // no kitten around
  noKittenAroundAchievementLevel = catHistoricMaxCute;

  // super cute and totally zen
  // if all the animals had a maximum cute rating: super cute!
  if (catMaximumCute === catCount && dogMaximumCute === dogCount) {
    superCuteAchievementLevel = true;
  }
  // if all the animals had a maximum zen rating: totally Zen!
  if (catMaximumZen === catCount && dogMaximumZen === dogCount) {
    totallyZenAchievementLevel = true;
  }

  // now add them to the UI
  document.getElementById('user-number').textContent = (dogCount + catCount);
  if (superCuteAchievementLevel) {
    document.getElementById('super-cute').textContent = 'You earned the Super Cute achievement!';
  } else {
    document.getElementById('super-cute').classList.add('invisible-element');
  }

  if (totallyZenAchievementLevel) {
    document.getElementById('totally-zen').textContent = 'You earned the Totally Zen achievement!';
  } else {
    document.getElementById('totally-zen').classList.add('invisible-element');
  }

  if (!superCuteAchievementLevel && !totallyZenAchievementLevel) {
    document.getElementById('let-down-gently').textContent = 'You didn\'t earn any achievements this time, but looking at cute dogs and cats is its own reward.';
    document.getElementById('let-down-gently').classList.remove('invisible-element');
  }

  // add the achievement levels to the UI
  let achievementElement = document.getElementById('achievement-1');
  let achievementSubElement = document.getElementById('achievement-1-sub');
  let achievementLevel = achievementCountToLevel(doggedDeterminationAchievementLevel);
  let achievementText = '🎖️ ' + 'Dogged Determination level - ' + achievementLevel + ': ' + achievementLevelToLabel(achievementLevel);
  achievementElement.innerHTML = achievementText;
  achievementText = 'You\'ve rated ' + achievementLevelToDescription(achievementLevel, 'dogs');
  achievementSubElement.textContent = achievementText;

  achievementElement = document.getElementById('achievement-2');
  achievementSubElement = document.getElementById('achievement-2-sub');
  achievementLevel = achievementCountToLevel(purrfectionistAchievementLevel);
  achievementText = '🎖️ ' + 'Purrfectionist level - ' + achievementLevel + ': ' + achievementLevelToLabel(achievementLevel);
  achievementElement.innerHTML = achievementText;
  achievementText = 'You\'ve rated ' + achievementLevelToDescription(achievementLevel, 'cats');
  achievementSubElement.textContent = achievementText;

  achievementElement = document.getElementById('achievement-3');
  achievementSubElement = document.getElementById('achievement-3-sub');
  achievementLevel = achievementCountToLevel(barkingUpTheRightTreeAchievementLevel);
  achievementText = '🎖️ ' + 'Barking Up the Right Tree level - ' + achievementLevel + ': ' + achievementLevelToLabel(achievementLevel);
  achievementElement.innerHTML = achievementText;
  achievementText = 'Your Zen has been lifted by ' + achievementLevelToDescription(achievementLevel, 'dogs');
  achievementSubElement.textContent = achievementText;

  achievementElement = document.getElementById('achievement-4');
  achievementSubElement = document.getElementById('achievement-4-sub');
  achievementLevel = achievementCountToLevel(purrsitiveVibesAchievementLevel);
  achievementText = '🎖️ ' + 'Purrsitive Vibes level - ' + achievementLevel + ': ' + achievementLevelToLabel(achievementLevel);
  achievementElement.innerHTML = achievementText;
  achievementText = 'Your Zen has been lifted by ' + achievementLevelToDescription(achievementLevel, 'cats');
  achievementSubElement.textContent = achievementText;

  achievementElement = document.getElementById('achievement-5');
  achievementSubElement = document.getElementById('achievement-5-sub');
  achievementLevel = achievementCountToLevel(hotDiggityDogAchievementLevel);
  achievementText = '🎖️ ' + 'Hot Diggity Dog level - ' + achievementLevel + ': ' + achievementLevelToLabel(achievementLevel);
  achievementElement.innerHTML = achievementText;
  achievementText = 'You\'ve been awww-ed by ' + achievementLevelToDescription(achievementLevel, 'dogs');
  achievementSubElement.textContent = achievementText;

  achievementElement = document.getElementById('achievement-6');
  achievementSubElement = document.getElementById('achievement-6-sub');
  achievementLevel = achievementCountToLevel(hotDiggityDogAchievementLevel);
  achievementText = '🎖️ ' + 'No Kitten Around level - ' + achievementLevel + ': ' + achievementLevelToLabel(achievementLevel);
  achievementElement.innerHTML = achievementText;
  achievementText = 'You\'ve been awww-ed by ' + achievementLevelToDescription(achievementLevel, 'cats');
  achievementSubElement.textContent = achievementText;
}


function achievementCountToLevel(achievementCount) {
  if (achievementCount < 10) {
    return 0;
  }
  if (achievementCount < 20) {
    return 1;
  }
  if (achievementCount < 30) {
    return 2;
  }
  if (achievementCount < 50) {
    return 3;
  }
  if (achievementCount < 100) {
    return 4;
  }
  if (achievementCount < 200) {
    return 5;
  }
  if (achievementCount < 500) {
    return 6;
  }
  if (achievementCount < 1000) {
    return 7;
  }
  if (achievementCount < 2000) {
    return 8;
  }
  return 9;
}

function achievementLevelToLabel(achievementLevel) {
  switch (achievementLevel) {
    case 0:
      return 'Paws and Claws Newbie';
    case 1:
      return 'Whisker Whisperer';
    case 2:
      return 'Purrfect Pupil';
    case 3:
      return 'Tail Wagging Novice';
    case 4:
      return 'Fetching Aficionado';
    case 5:
      return 'Cat\'s Meow Maven';
    case 6:
      return 'Doggedly Distinguished';
    case 7:
      return 'Feline Fine Connoisseur';
    case 8:
      return 'Bark-tacular Virtuoso';
    case 9:
      return 'Supreme Critter Cuteness Champion';
  }
}

function achievementLevelToDescription(achievementLevel, animalType) {
  switch (achievementLevel) {
    case 0:
      return '< 10 ' + animalType + '. Keep going!';
    case 1:
      return '10 - 20 ' + animalType + '. A great start!';
    case 2:
      return '20 - 30 ' + animalType + '. You\'re a natural!';
    case 3:
      return '30 - 50 ' + animalType + '. You\'re a pro!';
    case 4:
      return '50 - 100 ' + animalType + '. You\'re a master!';
    case 5:
      return '100 - 200 ' + animalType + '. You\'re a legend!';
    case 6:
      return '200 - 500 ' + animalType + '. You\'re a hero!';
    case 7:
      return '500 - 1,000+ ' + animalType + '. You\'re a god!';
    case 8:
      return '1,000 - 2,000+ ' + animalType + '. You\'re a deity!';
    case 9:
      return '> 2,000 You\'ve seen all the ' + animalType + '! You\'re a legend!';
  }
}


function displayResultantAnimals() {
  // display the cutest dog and cat images
  let containerElement = document.getElementById('cutest-holder');
  loadEndingCardWithImages(containerElement, dogImagesCutest, catImagesCutest, 'app-card-title-cutest', 'Cutest', 'cute');
  containerElement = document.getElementById('ugliest-holder');
  loadEndingCardWithImages(containerElement, dogImagesUgliest, catImagesUgliest, 'app-card-title-ugliest', 'Most Basic', 'ugly');
  containerElement = document.getElementById('most-zen-holder');
  loadEndingCardWithImages(containerElement, dogImagesMostZen, catImagesMostZen, 'app-card-title-most-zen', 'Most Zen', 'zen');
  containerElement = document.getElementById('favourites-holder');
  loadEndingCardWithImages(containerElement, dogImagesFavourites, catImagesFavourites, 'app-card-title-favourites', 'Favourites', 'fav');
  // give the polaroids a jaunty angle
  randomlyRotatePolaroids(3);
}

function loadEndingCardWithImages(parentElement, dogImagesToDisplay, catImagesToDisplay, titleElementID, title, listType) {
  // remove all child elements of the parent element
  while (parentElement.firstChild) {
    parentElement.removeChild(parentElement.firstChild);
  }


  const totalDogs = dogImagesToDisplay.length;
  const totalCats = catImagesToDisplay.length;
  const totalAvailable = totalDogs + totalCats;
  const totalToDisplay = 4;

  let dogsToDisplay = 0;
  let catsToDisplay = 0;
  if (totalAvailable >= totalToDisplay) {
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
    const dogImage = dogImagesToDisplay[i];
    const newDiv = document.createElement('div');
    newDiv.classList.add('polaroid');
    newDiv.innerHTML = emptyEndingCardHTML(listType, 'dog-image', i, dogImage.url, dogImage.description, dogImage.userComment, dogImage.isFavourite);
    parentElement.appendChild(newDiv.firstChild);
    // now add infoURL to the caption
    const idOfCaption = `${listType}-animal-info-url-dog-image-${i}`;
    dogImage.addInfoURLByID(idOfCaption);
  };

  // add the cat images to the container
  for (let i=0; i <catsToDisplay; i++) {
    const catImage = catImagesToDisplay[i];
    const newDiv = document.createElement('div');
    newDiv.innerHTML = emptyEndingCardHTML(listType, 'cat-image', i, catImage.url, catImage.description, catImage.userComment, catImage.isFavourite);
    parentElement.appendChild(newDiv.firstChild);
    // now add infoURL to the caption
    const idOfCaption = `${listType}-animal-info-url-cat-image-${i}`;
    catImage.addInfoURLByID(idOfCaption);
  };

  // update the card title
  const totalDisplayed = dogsToDisplay + catsToDisplay;
  if (totalDisplayed === 0) {
    if (title === 'Most Basic') {
      document.getElementById(titleElementID).innerHTML = 'No ugly cats or dogs! Right answer.';
    } else {
    document.getElementById(titleElementID).innerHTML = 'No ' + title + '! Oh, maybe next time.';
    }
  } else {
    if (totalAvailable > 4) {
      document.getElementById(titleElementID).innerHTML = title;
    } else {
      document.getElementById(titleElementID).innerHTML = title;
    }
  }
}

// create the HTML for an empty animal card
function emptyEndingCardHTML(listType, id, i, url, altText, comment, favourited) {
  // construct the image template

  let favouriteClass;
  let favouriteIcon;
  if (favourited) {
    favouriteClass = 'favourited';
    favouriteIcon = 'fas fa-heart';
  } else {
    favouriteClass = 'non-favourited';
    favouriteIcon = 'far fa-heart';
  }
  const imageTemplate = `<div class="app-card app-card-ending w3-col w3-padding" id="${listType}-app-card-${id}-${i}">
    <div class="polaroid polaroid-ending">
      <img id="${listType}-${id}-${i}" class="polaroid-img polaroid-img-ending" src="${url}" alt="${altText}" height=${polaroidSummaryImageHeight}>
      <!-- animal info (e.g. breed) -->
      <a href="" class="animal-info-url animal-info-url-ending w3-cursive" id="${listType}-animal-info-url-${id}-${i}">${altText}</a>
    </div>
    <!-- user comment -->
    <p class="summary-comment w3-text-deep-purple w3-sans-serif" type="text" id="${listType}-user-comment-${id}-${i}">${comment}</p>
    <div class="w3-row w3-center">
      <!-- Buttons for various functions -->
      <a href="#" role="button" id="${listType}-fav-btn-${id}-${i}" class="favourite-button ${favouriteClass} 
      summary-button secondary outline w3-border-amber w3-hover-border-green">
      <i class="fav-icon ${favouriteIcon}"></i></a>
    </div>
  </div>`;
  return imageTemplate;
}

// Event Handlers
function handleFavouriteButtonClick(event) {
  event.preventDefault();
  let clickedElement = event.target;
  let id = clickedElement.id;
  if (!id) {
    clickedElement = clickedElement.parentElement;
    id = clickedElement.id;
  }
  if (id) {
    const animalType = getAnimalImageTypeFromID(id);
    const arrayIndex = parseInt( getAnimalImageIndexFromID(id));
    const listType = getStringBeforeDash(id);

    let imageURL;
    let isFavourite = false;
    let favButtonID;
    if (animalType === 'dog-image') {
      switch (listType) {
        case 'zen':
          dogImagesMostZen[arrayIndex].isFavourite = !dogImagesMostZen[arrayIndex].isFavourite;
          isFavourite = dogImagesMostZen[arrayIndex].isFavourite;
          imageURL = dogImagesMostZen[arrayIndex].url;
          if (isFavourite) {
            // add it to the favourites
            dogImagesFavourites.push(dogImagesMostZen[arrayIndex]);
            addDogImageToFavourites(dogImagesMostZen[arrayIndex]);
          } else {
            // remove it from the favourites
            for (i=0; i<dogImagesFavourites.length; i++) {
              if (dogImagesFavourites[i].url.toLowerCase() === imageURL.toLowerCase()) {
                dogImagesFavourites.splice(i, 1);
                break;
              }
            }
          }

          break;
        case 'ugly':
          dogImagesUgliest[arrayIndex].isFavourite = !dogImagesUgliest[arrayIndex].isFavourite;
          isFavourite = dogImagesUgliest[arrayIndex].isFavourite;
          imageURL = dogImagesUgliest[arrayIndex].url;
          if (isFavourite) {
            dogImagesFavourites.push(dogImagesUgliest[arrayIndex]);
            addDogImageToFavourites(dogImagesUgliest[arrayIndex]);
          } else {
            // remove it from the favourites
            for (i=0; i<dogImagesFavourites.length; i++) {
              if (dogImagesFavourites[i].url.toLowerCase() === imageURL.toLowerCase()) {
                dogImagesFavourites.splice(i, 1);
                break;
              }
            }
          }
          break;
        case 'cute':
          dogImagesCutest[arrayIndex].isFavourite = !dogImagesCutest[arrayIndex].isFavourite;
          isFavourite = dogImagesCutest[arrayIndex].isFavourite;
          imageURL = dogImagesCutest[arrayIndex].url;
          if (isFavourite) {
            dogImagesFavourites.push(dogImagesCutest[arrayIndex]);
            addDogImageToFavourites(dogImagesCutest[arrayIndex]);
          } else {
            // remove it from the favourites
            for (i=0; i<dogImagesFavourites.length; i++) {
              if (dogImagesFavourites[i].url.toLowerCase() === imageURL.toLowerCase()) {
                dogImagesFavourites.splice(i, 1);
                break;
              }
            }
          }
          break;
        case 'fav':
          // if it is already a favourite, then remove it
          isFavourite = false;
          imageURL = dogImagesFavourites[arrayIndex].url;
          // remove from object from favourites at this array index
          removeDogImageFromFavourites(dogImagesFavourites[arrayIndex]);
          dogImagesFavourites.splice(arrayIndex, 1);
          reloadFavourites();
          break;
        default:
          return;
      }

      // update current favourite button so long as it is not the favourites list
      // as that will get updated when the favourites list is reloaded
      if (listType !== 'fav') {
        favButtonID = `${listType}-fav-btn-dog-image-${arrayIndex}`;
        toggleFavourite(favButtonID, isFavourite);
      }
      // update every other list that contains this image
      if (listType !== 'zen') {
        for (let i=0; i<dogImagesMostZen.length; i++) {
          if (dogImagesMostZen[i].url === imageURL) {
            dogImagesMostZen[i].isFavourite = isFavourite;
            favButtonID = `zen-fav-btn-dog-image-${i}`;
            toggleFavourite(favButtonID, isFavourite);
            if (listType !== 'fav') {
              if (isFavourite) {
                addDogImageToFavourites(dogImagesMostZen[i]);
              } else {
                removeDogImageFromFavourites(dogImagesMostZen[i]);
              }
            }
          }
        }
      }
      if (listType !== 'ugly') {
        for (i = 0; i < dogImagesUgliest.length; i++) {
          if (dogImagesUgliest[i].url === imageURL) {
            dogImagesUgliest[i].isFavourite = isFavourite;
            favButtonID = `ugly-fav-btn-dog-image-${i}`;
            toggleFavourite(favButtonID, isFavourite);
            if (listType !== 'fav') {
              if (isFavourite) {
                addDogImageToFavourites(dogImagesUgliest[i]);
              } else {
                removeDogImageFromFavourites(dogImagesUgliest[i]);
              }
            }
          }
        }
      }
      if (listType !== 'cute') {
        for (i = 0; i < dogImagesCutest.length; i++) {
          if (dogImagesCutest[i].url === imageURL) {
            dogImagesCutest[i].isFavourite = isFavourite;
            favButtonID = `cute-fav-btn-dog-image-${i}`;
            toggleFavourite(favButtonID, isFavourite);
            if (listType !== 'fav') {
              if (isFavourite) {
                addDogImageToFavourites(dogImagesCutest[i]);
              } else {
                removeDogImageFromFavourites(dogImagesCutest[i]);
              }
            }
          }
        }
      }
    } else if (animalType === 'cat-image') {
      switch (listType) {
        case 'zen':
          catImagesMostZen[arrayIndex].isFavourite = !catImagesMostZen[arrayIndex].isFavourite;
          isFavourite = catImagesMostZen[arrayIndex].isFavourite;
          imageURL = catImagesMostZen[arrayIndex].url;
          if (isFavourite) {
            catImagesFavourites.push(catImagesMostZen[arrayIndex]);
            addCatImageToFavourites(catImagesMostZen[arrayIndex]);
          } else {
            // remove it from the favourites
            for (i=0; i<catImagesFavourites.length; i++) {
              if (catImagesFavourites[i].url.toLowerCase() === imageURL.toLowerCase()) {
                catImagesFavourites.splice(i, 1);
                break;
              }
            }
          }
          break;
        case 'ugly':
          catImagesUgliest[arrayIndex].isFavourite = !catImagesUgliest[arrayIndex].isFavourite;
          isFavourite = catImagesUgliest[arrayIndex].isFavourite;
          imageURL = catImagesUgliest[arrayIndex].url;
          if (isFavourite) {
            catImagesFavourites.push(catImagesUgliest[arrayIndex]);
            addCatImageToFavourites(catImagesUgliest[arrayIndex]);
          } else {
            // remove it from the favourites
            for (i=0; i<catImagesFavourites.length; i++) {
              if (catImagesFavourites[i].url.toLowerCase() === imageURL.toLowerCase()) {
                catImagesFavourites.splice(i, 1);
                break;
              }
            }
          }
          break;
        case 'cute':
          catImagesCutest[arrayIndex].isFavourite = !catImagesCutest[arrayIndex].isFavourite;
          isFavourite = catImagesCutest[arrayIndex].isFavourite;
          imageURL = catImagesCutest[arrayIndex].url;
          if (isFavourite) {
            catImagesFavourites.push(catImagesCutest[arrayIndex]);
            addCatImageToFavourites(catImagesCutest[arrayIndex]);
          } else {
            // remove it from the favourites
            for (i=0; i<catImagesFavourites.length; i++) {
              if (catImagesFavourites[i].url.toLowerCase() === imageURL.toLowerCase()) {
                catImagesFavourites.splice(i, 1);
                break;
              }
            }
          }
          break;
        case 'fav':
          // if it is already a favourite, then remove it
          isFavourite = false;
          imageURL = catImagesFavourites[arrayIndex].url;
          // remove from object from favourites at this array index
          removeCatImageFromFavourites(catImagesFavourites[arrayIndex]);
          catImagesFavourites.splice(arrayIndex, 1);
          break;
        default:
          return;
      }

      // update current favourite button
      favButtonID = `${listType}-fav-btn-cat-image-${arrayIndex}`;
      toggleFavourite(favButtonID, isFavourite);

      // update every other list that contains this image
      if (listType !== 'zen') {
        for (let i=0; i<catImagesMostZen.length; i++) {
          if (catImagesMostZen[i].url === imageURL) {
            catImagesMostZen[i].isFavourite = isFavourite;
            favButtonID = `zen-fav-btn-cat-image-${i}`;
            toggleFavourite(favButtonID, isFavourite);
            if (listType !== 'fav') {
              if (isFavourite) {
                addCatImageToFavourites(catImagesMostZen[i]);
              } else {
                removeCatImageFromFavourites(catImagesMostZen[i]);
              }
            }
          }
        }
      }
      if (listType !== 'ugly') {
        for (i = 0; i < catImagesUgliest.length; i++) {
          if (catImagesUgliest[i].url === imageURL) {
            catImagesUgliest[i].isFavourite = isFavourite;
            favButtonID = `ugly-fav-btn-cat-image-${i}`;
            toggleFavourite(favButtonID, isFavourite);
            if (listType !== 'fav') {
              if (isFavourite) {
                addCatImageToFavourites(catImagesUgliest[i]);
              } else {
                removeCatImageFromFavourites(catImagesUgliest[i]);
              }
            }
          }
        }
      }
      if (listType !== 'cute') {
        for (i = 0; i < catImagesCutest.length; i++) {
          if (catImagesCutest[i].url === imageURL) {
            catImagesCutest[i].isFavourite = isFavourite;
            favButtonID = `cute-fav-btn-cat-image-${i}`;
            toggleFavourite(favButtonID, isFavourite);
            if (listType !== 'fav') {
              if (isFavourite) {
                addCatImageToFavourites(catImagesCutest[i]);
              } else {
                removeCatImageFromFavourites(catImagesCutest[i]);
              }
            }
          }
        }
      }
    }
    reloadFavourites();
  }
}


// event handler to show the info modal
function showInfoModal(event) {
  event.preventDefault();
  // display the modal
  const uiElement = event.target;
  const idValue = uiElement.id;
  const imageType = getAnimalImageTypeFromID(idValue);
  const idNumber = getAnimalImageIndexFromID(idValue);
  const arrayType = getStringBeforeDash(idValue);
  let infoURL;
  let modalTitle;
  let modalInfoText='';
  switch (arrayType) {
    case 'zen':
      if (imageType === 'cat-image') {
        infoURL = catImagesMostZen[idNumber].infoURL;
        modalTitle = catImagesMostZen[idNumber].description;
      } else {
        infoURL = dogImagesMostZen[idNumber].infoURL;
        modalTitle = dogImagesMostZen[idNumber].description;
        modalInfoText = getDogBreedInfo(dogImagesMostZen[idNumber].subBreed, dogImagesMostZen[idNumber].dogBreed);
      }
      break;
    case 'ugly':
      if (imageType === 'cat-image') {
        infoURL = catImagesUgliest[idNumber].infoURL;
        modalTitle = catImagesUgliest[idNumber].description;
      } else {
        infoURL = dogImagesUgliest[idNumber].infoURL;
        modalTitle = dogImagesUgliest[idNumber].description;
        modalInfoText = getDogBreedInfo(dogImagesUgliest[idNumber].subBreed, dogImagesUgliest[idNumber].dogBreed);
      }
      break;
    case 'cute':
      if (imageType === 'cat-image') {
        infoURL = catImagesCutest[idNumber].infoURL;
        modalTitle = catImagesCutest[idNumber].description;
      } else {
        infoURL = dogImagesCutest[idNumber].infoURL;
        modalTitle = dogImagesCutest[idNumber].description;
        modalInfoText = getDogBreedInfo(dogImagesCutest[idNumber].subBreed, dogImagesCutest[idNumber].dogBreed);
      }
      break;
    case 'fav':
      if (imageType === 'cat-image') {
        infoURL = catImagesFavourites[idNumber].infoURL;
        modalTitle = catImagesFavourites[idNumber].description;
      } else {
        infoURL = dogImagesFavourites[idNumber].infoURL;
        modalTitle = dogImagesFavourites[idNumber].description;
        modalInfoText = getDogBreedInfo(dogImagesFavourites[idNumber].subBreed, dogImagesFavourites[idNumber].dogBreed);
      }
      break;
    default:
      return;
  }
  if (infoURL === '') {
    return;
  }
  openModal(infoURL, modalTitle, modalInfoText);
}

function addDogImageToFavourites(dogImage) {
  const favouriteDogs = getAnimalsFromLocalStorage('dog-images', '-favourites');
  // only push this to the favourites array if the image is not already in the array - test by the url property
  if (favouriteDogs.find((dog) => dog.url.toLowerCase() === dogImage.url.toLowerCase())) {
    return;
  }
  dogImage.isFavourite = true;
  favouriteDogs.push(dogImage);

  // save the favourites array to local storage
  saveAnimalsToLocalStorage('dog-images', '-favourites', favouriteDogs);
  reloadFavourites();
}

function removeDogImageFromFavourites(dogImage) {
  let favouriteDogs = getAnimalsFromLocalStorage('dog-images', '-favourites');
  // only remove this from the favourites array if the image is in the array - test by the url property
  if (!favouriteDogs.find((dog) => dog.url.toLowerCase() === dogImage.url.toLowerCase())) {
    return;
  }
  dogImage.isFavourite = false;
  favouriteDogs = favouriteDogs.filter((dog) => dog.url.toLowerCase() !== dogImage.url.toLowerCase());
  // save the favourites array to local storage
  saveAnimalsToLocalStorage('dog-images', '-favourites', favouriteDogs);
  reloadFavourites();
}


function addCatImageToFavourites(catImage) {
  // only push this to the favourites array if the image is not already in the array - test by the url property
  const favouriteCats = getAnimalsFromLocalStorage('cat-images', '-favourites');
  if (favouriteCats.find((cat) => cat.url.toLowerCase() === catImage.url.toLowerCase())) {
    return;
  }
  catImage.isFavourite = true;
  favouriteCats.push(catImage);

  // save the favourites array to local storage
  saveAnimalsToLocalStorage('cat-images', '-favourites', favouriteCats);
  reloadFavourites();
}

function removeCatImageFromFavourites(catImage) {
  // only remove this from the favourites array if the image is in the array - test by the url property
  let favouriteCats = getAnimalsFromLocalStorage('cat-images', '-favourites');
  if (!favouriteCats.find((cat) => cat.url === catImage.url)) {
    return;
  }
  catImage.isFavourite = false;
  favouriteCats = favouriteCats.filter((cat) => cat.url !== catImage.url);
  // save the favourites array to local storage
  saveAnimalsToLocalStorage('cat-images', '-favourites', favouriteCats);
  reloadFavourites();
}

function reloadFavourites() {
  containerElement = document.getElementById('favourites-holder');
  loadEndingCardWithImages(containerElement, dogImagesFavourites, catImagesFavourites, 'app-card-title-favourites', 'Favourites', 'fav');
  const className = 'favourite-button';
  const eventName = 'click';
  const functionToCall = handleFavouriteButtonClick;
  addEventListenerToDOMBranch(containerElement, className, eventName, functionToCall );
  addEventListenerToDOMBranch(containerElement, 'polaroid-img', 'click', animalImageClicked);
  // give the polaroids a jaunty angle
  randomlyRotatePolaroids(3);
}