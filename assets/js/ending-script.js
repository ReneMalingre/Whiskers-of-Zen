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
  addAnimalInfoURLEventListener(parentElement);
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
  catImagesFavourites = randomizeArray(filterFavourites(catImages));

  // get the past favourites and add on the new favourites if they are unique
  let pastDogFavourites = getAnimalsFromLocalStorage('dog-images', '-favourites');
  let pastCatFavourites = getAnimalsFromLocalStorage('cat-images', '-favourites');
  pastDogFavourites = dogImagesFavourites.concat(pastDogFavourites, dogImagesFavourites);
  pastCatFavourites = catImagesFavourites.concat(pastCatFavourites, catImagesFavourites);

  // save the new favourites list
  saveAnimalsToLocalStorage('dog-images', '-favourites', pastDogFavourites);
  saveAnimalsToLocalStorage('cat-images', '-favourites', pastCatFavourites);
}

function checkForAchievements(dogImages, catImages) {
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
  let achievementText = '🎖️ ' + 'Dogged Determination level - ' + achievementLevel + ' ' + achievementLevelToLabel(achievementLevel);
  achievementElement.innerHTML = achievementText;
  achievementText = "You've rated " + achievementLevelToDescription(achievementLevel, 'dogs');
  achievementSubElement.textContent = achievementText;

  achievementElement = document.getElementById('achievement-2');
  achievementSubElement = document.getElementById('achievement-2-sub');
  achievementLevel = achievementCountToLevel(purrfectionistAchievementLevel);
  achievementText = '🎖️ ' + 'Purrfectionist level - ' + achievementLevel + ' ' + achievementLevelToLabel(achievementLevel);
  achievementElement.innerHTML = achievementText;
  achievementText = "You've rated " + achievementLevelToDescription(achievementLevel, 'cats');
  achievementSubElement.textContent = achievementText;

  achievementElement = document.getElementById('achievement-3');
  achievementSubElement = document.getElementById('achievement-3-sub');
  achievementLevel = achievementCountToLevel(barkingUpTheRightTreeAchievementLevel);
  achievementText = '🎖️ ' + 'Barking Up the Right Tree level - ' + achievementLevel + ' ' + achievementLevelToLabel(achievementLevel);
  achievementElement.innerHTML = achievementText;
  achievementText = "Your Zen has been lifted by " + achievementLevelToDescription(achievementLevel, 'dogs');
  achievementSubElement.textContent = achievementText;

  achievementElement = document.getElementById('achievement-4');
  achievementSubElement = document.getElementById('achievement-4-sub');
  achievementLevel = achievementCountToLevel(purrsitiveVibesAchievementLevel);
  achievementText = '🎖️ ' + 'Purrsitive Vibes level - ' + achievementLevel + ' ' + achievementLevelToLabel(achievementLevel);
  achievementElement.innerHTML = achievementText;
  achievementText = "Your Zen has been lifted by " + achievementLevelToDescription(achievementLevel, 'cats');
  achievementSubElement.textContent = achievementText;

  achievementElement = document.getElementById('achievement-5');
  achievementSubElement = document.getElementById('achievement-5-sub');
  achievementLevel = achievementCountToLevel(hotDiggityDogAchievementLevel);
  achievementText = '🎖️ ' + 'Hot Diggity Dog level - ' + achievementLevel + ' ' + achievementLevelToLabel(achievementLevel);
  achievementElement.innerHTML = achievementText;
  achievementText = "You've been awww-ed by " + achievementLevelToDescription(achievementLevel, 'dogs');
  achievementSubElement.textContent = achievementText;

  achievementElement = document.getElementById('achievement-6');
  achievementSubElement = document.getElementById('achievement-6-sub');
  achievementLevel = achievementCountToLevel(hotDiggityDogAchievementLevel);
  achievementText = '🎖️ ' + 'No Kitten Around level - ' + achievementLevel + ' ' + achievementLevelToLabel(achievementLevel);
  achievementElement.innerHTML = achievementText;
  achievementText = "You've been awww-ed by " + achievementLevelToDescription(achievementLevel, 'cats');
  achievementSubElement.textContent = achievementText;
}



function achievementCountToLevel(achievementCount) {
  if (achievementCount < 10) {
    return 0;
  }
  if (achievementCount < 50) {
    return 1;
  }
  if (achievementCount < 100) {
    return 2;
  }
  if (achievementCount < 200) {
    return 3;
  }
  if (achievementCount < 500) {
    return 4;
  }
  if (achievementCount < 1000) {
    return 5;
  }
  if (achievementCount < 2000) {
    return 6;
  }
  if (achievementCount < 5000) {
    return 7;
  }
  if (achievementCount < 10000) {
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
      return '10 - 50 ' + animalType + '. A great start!';
    case 2:
      return '50 - 100 ' + animalType + '. You\'re a natural!';
    case 3:
      return '100 - 200 ' + animalType + '. You\'re a pro!';
    case 4:
      return '200 - 500 ' + animalType + '. You\'re a master!';
    case 5:
      return '500 - 1,000 ' + animalType + '. You\'re a legend!';
    case 6:
      return '1,000 - 2,000 ' + animalType + '. You\'re a hero!';
    case 7:
      return '2,000 - 5,000+ ' + animalType + '. You\'re a god!';
    case 8:
      return '5,000 - 10,000+ ' + animalType + '. You\'re a deity!';
    case 9:
      return '> 10,000 You\'ve seen all the ' + animalType + '! You\'re a legend!';
  }
}


function displayResultantAnimals() {
  // display the cutest dog and cat images
  let containerElement = document.getElementById('cutest-holder');
  loadEndingCardWithImages(containerElement, dogImagesCutest, catImagesCutest, 'app-card-title-cutest', 'Cutest');
  containerElement = document.getElementById('ugliest-holder');
  loadEndingCardWithImages(containerElement, dogImagesUgliest, catImagesUgliest, 'app-card-title-ugliest', 'Most Basic');
  containerElement = document.getElementById('most-zen-holder');
  loadEndingCardWithImages(containerElement, dogImagesMostZen, catImagesMostZen, 'app-card-title-most-zen', 'Most Zen');
  containerElement = document.getElementById('favourites-holder');
  loadEndingCardWithImages(containerElement, dogImagesFavourites, catImagesFavourites, 'app-card-title-favourites', 'Favourites');
  // give the polaroids a jaunty angle
  randomlyRotatePolaroids(3);
}

function loadEndingCardWithImages(parentElement, dogImages, catImages, titleElementID, title) {
  const totalDogs = dogImages.length;
  const totalCats = catImages.length;
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
    const dogImage = dogImages[i];
    const newDiv = document.createElement('div');
    newDiv.classList.add('polaroid');
    newDiv.innerHTML = emptyEndingCardHTML(newDiv, 'dog-image', i, dogImage.url, dogImage.description, dogImage.userComment, dogImage.infoURL, dogImage.isFavourite);
    parentElement.appendChild(newDiv.firstChild);
  };
  // add the cat images to the container
  for (let i=0; i <catsToDisplay; i++) {
    const catImage = catImages[i];
    const newDiv = document.createElement('div');
    newDiv.innerHTML = emptyEndingCardHTML(newDiv, 'cat-image', i, catImage.url, catImage.description, catImage.userComment, catImage.infoURL, catImage.isFavourite);
    parentElement.appendChild(newDiv.firstChild);
  };

  // update the card title
  const totalDisplayed = dogsToDisplay + catsToDisplay;
  if (totalDisplayed === 0) {
    document.getElementById(titleElementID).innerHTML = 'No ' + title + '! Really?';
  } else {
    document.getElementById(titleElementID).innerHTML = totalDisplayed + ' of the '+ title;
  }
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
  const imageTemplate = `<div class="app-card w3-col w3-padding" id="app-card-${id}-${i}">
    <div class="polaroid">
      <img id="${id}-${i}" class="polaroid-img" src="${url}" alt="${altText}" height=${polaroidSummaryImageHeight}>
      <!-- animal info (e.g. breed) -->
      <a href="${animalInfoUrl}" class="animal-info-url w3-cursive" id="animal-info-url-${id}-${i}">${altText}</a>
    </div>
    <!-- user comment -->
    <div class="w3-row w3-center">
      <p class="summary-comment w3-text-deep-purple w3-sans-serif" type="text" id="user-comment-${id}-${i}">${comment}</p>
      <!-- Buttons for various functions -->
      <a href="#" role="button" id="fav-btn-${id}-${i}" class="favourite-button ${favouriteClass} summary-button secondary outline w3-border-amber w3-hover-border-green"><i class="fa-solid fa-bookmark"></i></a>
    </div>
  </div>`;
  // console.log(imageTemplate);
  return imageTemplate;
}

// Event Handlers
function handleFavouriteButtonClick(event) {
  event.preventDefault();
  let clickedElement = event.target;
  let id = clickedElement.id;
  if (!id) {
    clickedElement = clickedElement.parentElement;
    id=clickedElement.id;
  }
  if (id) {
    const animalType = getAnimalImageTypeFromID(id);
    const arrayIndex = getAnimalImageIndexFromID(id);
    if (animalType === 'dog-image') {
      dogImages[arrayIndex].isFavourite = !dogImages[arrayIndex].isFavourite;
      // TODO add or remove the dog to/from the favourites array
      // TODO update the button to show the correct format
    } else if (animalType === 'cat-image') {
      catImages[arrayIndex].isFavourite = !catImages[arrayIndex].isFavourite;
      // TODO add or remove the cat to/from the favourites array
      // TODO update the button to show the correct format
    }
  }
}
