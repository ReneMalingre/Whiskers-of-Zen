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
  console.log('dogImagesFavourites:', dogImagesFavourites.length);
  for (let i=0; i<dogImagesFavourites.length; i++) {
    addDogImageToFavourites(dogImagesFavourites[i]);
  }
  console.log('catImagesFavourites:', catImagesFavourites.length);
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

  // update the card title
  const totalDisplayed = dogsToDisplay + catsToDisplay;
  if (totalDisplayed === 0) {
    document.getElementById(titleElementID).innerHTML = 'No ' + title + '! Oh, maybe next time.';
  } else {
    if (totalAvailable > 4) {
      document.getElementById(titleElementID).innerHTML = title;
    } else {
      document.getElementById(titleElementID).innerHTML = title;
    }
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
  const imageTemplate= `<article class="app-card w3-col w3-padding" id="app-card-${id}-${i}">
    <div class="polaroid">
      <img id="${id}-${i}" class="polaroid-img" src="${url}" alt="${altText}" height=${polaroidSummaryImageHeight}>
      <!-- animal info (e.g. breed) -->
      <a href="${animalInfoUrl}" class="animal-info-url w3-cursive" id="animal-info-url-${id}-${i}">${altText}</a>
    </div>
    <!-- user comment -->
    <p class="summary-comment w3-text-deep-purple w3-sans-serif" type="text" id="${listType}-user-comment-${id}-${i}">${comment}</p>
    <div class="w3-row w3-center">
      <!-- Buttons for various functions -->
      <a href="#" role="button" id="${listType}-fav-btn-${id}-${i}" class="favourite-button ${favouriteClass} 
      summary-button secondary outline w3-border-amber w3-hover-border-green">
      <i class="fav-icon ${favouriteIcon}"></i></a>
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

    const arrayIndex = parseInt( getAnimalImageIndexFromID(id));
    console.log('🚀 ~ file: ending-script.js:440 ~ handleFavouriteButtonClick ~ arrayIndex:', arrayIndex);

    const listType = getStringBeforeDash(id);
    console.log('🚀 ~ file: ending-script.js:443 ~ handleFavouriteButtonClick ~ listType:', listType);

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
            dogImagesFavourites.push(dogImagesMostZen[arrayIndex]);
          }
          break;
        case 'ugly':
          dogImagesUgliest[arrayIndex].isFavourite = !dogImagesUgliest[arrayIndex].isFavourite;
          isFavourite = dogImagesUgliest[arrayIndex].isFavourite;
          imageURL = dogImagesUgliest[arrayIndex].url;
          if (isFavourite) {
            dogImagesFavourites.push(dogImagesUgliest[arrayIndex]);
          }
          break;
        case 'cute':
          dogImagesCutest[arrayIndex].isFavourite = !dogImagesCutest[arrayIndex].isFavourite;
          isFavourite = dogImagesCutest[arrayIndex].isFavourite;
          imageURL = dogImagesCutest[arrayIndex].url;
          if (isFavourite) {
            dogImagesFavourites.push(dogImagesCutest[arrayIndex]);
          }
          break;
        case 'fav':
          // if it is already a favourite, then remove it
          console.log('clicked favourite button');
          isFavourite = false;
          imageURL = dogImagesFavourites[arrayIndex].url;
          // remove from object from favourites at this array index
          dogImagesFavourites.splice(arrayIndex, 1);
          // save favourites to local storage
          saveAnimalsToLocalStorage('dog-images', '-favourites', dogImagesFavourites);
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
          }
          break;
        case 'ugly':
          catImagesUgliest[arrayIndex].isFavourite = !catImagesUgliest[arrayIndex].isFavourite;
          isFavourite = catImagesUgliest[arrayIndex].isFavourite;
          imageURL = catImagesUgliest[arrayIndex].url;
          if (isFavourite) {
            catImagesFavourites.push(catImagesUgliest[arrayIndex]);
          }
          break;
        case 'cute':
          catImagesCutest[arrayIndex].isFavourite = !catImagesCutest[arrayIndex].isFavourite;
          isFavourite = catImagesCutest[arrayIndex].isFavourite;
          imageURL = catImagesCutest[arrayIndex].url;
          if (isFavourite) {
            catImagesFavourites.push(catImagesCutest[arrayIndex]);
          }
          break;
        case 'fav':
          // if it is already a favourite, then remove it
          isFavourite = false;
          imageURL = catImagesFavourites[arrayIndex].url;
          // remove from object from favourites at this array index
          catImagesFavourites.splice(arrayIndex, 1);
          // save favourites to local storage
          saveAnimalsToLocalStorage('cat-images', '-favourites', catImagesFavourites);
          break;
        default:
          return;
      }

  if (catImagesFromStorage !== null ) {
    // create an array of cat images
    for (let i = 0; i < catImagesFromStorage.cats.length; i++) {
      //   console.log(i + ' ' + catImagesFromStorage.cats[i].cat);
      const catImage =new CatImage();
      catImage.deserialize(catImagesFromStorage.cats[i].cat);
      savedCats.push(catImage);
    }
    reloadFavourites();
  }
}

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
  console.log('pre-push: ' + favouriteDogs.length);
  dogImage.isFavourite = true;
  favouriteDogs.push(dogImage);
  console.log('post-push: ' + favouriteDogs.length);

  // save the favourites array to local storage
  saveAnimalsToLocalStorage('dog-images', '-favourites', favouriteDogs);
  reloadFavourites();
}

function removeDogImageFromFavourites(dogImage) {
  const favouriteDogs = getAnimalsFromLocalStorage('dog-images', '-favourites');
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
  const favouriteCats = getAnimalsFromLocalStorage('cat-images', '-favourites');
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
