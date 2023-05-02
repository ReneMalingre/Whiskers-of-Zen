let dogImages = []; // array of DogImage objects
let catImages = []; // array of CatImage objects
const polaroidImageHeight = 280; // height of the polaroid image in pixels
let flagToDelete = false; // flag to indicate whether to delete the image from the favourites
let itemToDelete =''; // the item to delete from the favourites

window.addEventListener('load', () => {
  // get the dogs and cats out of local storage
  retrieveFavourites();

  // display the cutest dog and cat images into the categories
  displayResultantAnimals();
  // add event listeners to the buttons
  const parentElement = document.body;
  const className = 'favourite-button';
  const eventName = 'click';
  const functionToCall = handleFavouriteButtonClick;
  addEventListenerToDOMBranch(parentElement, className, eventName, functionToCall );
  // add info modal to the DOM
  addInfoModalToDOM();
  // add image modal to the DOM
  addImageModalToDOM();
  // add event listeners to the animal info URLs
  addAnimalInfoURLEventListener(parentElement);
  // add event listeners to the animal images
  addEventListenerToDOMBranch(parentElement, 'polaroid-img', 'click', animalImageClicked);
});

function retrieveFavourites() {
  // get the images out of local storage from the app run
  dogImages = getAnimalsFromLocalStorage('dog-images', '-favourites');
  catImages = getAnimalsFromLocalStorage('cat-images', '-favourites');
}

function displayResultantAnimals() {
  // display the favourite dog and cat images
  containerElement = document.getElementById('favourites-holder');
  loadEndingCardWithImages(containerElement, 'app-card-title-favourites', 'Favourites', 'fav');
  // give the polaroids a jaunty angle
  randomlyRotatePolaroids(3);
}
function loadEndingCardWithImages(parentElement) {
  // remove all child elements of the parent element
  while (parentElement.firstChild) {
    parentElement.removeChild(parentElement.firstChild);
  }

  // add the dog images to the container
  for (let i=0; i<dogImages.length; i++) {
    const dogImageToDisplay = dogImages[i];
    const newDiv = document.createElement('div');
    newDiv.innerHTML = emptyEndingCardHTML('dog-image', i, dogImageToDisplay.url, dogImageToDisplay.description, dogImageToDisplay.userComment, dogImageToDisplay.isFavourite);
    parentElement.appendChild(newDiv.firstChild);
    // now add infoURL to the caption
    const idOfCaption = `animal-info-url-dog-image-${i}`;
    dogImageToDisplay.addInfoURLByID(idOfCaption);
  };

  // add the cat images to the container
  for (let i=0; i <catImages.length; i++) {
    const catImageToDisplay = catImages[i];
    const newDiv = document.createElement('div');
    newDiv.innerHTML = emptyEndingCardHTML('cat-image', i, catImageToDisplay.url, catImageToDisplay.description, catImageToDisplay.userComment, catImageToDisplay.isFavourite);
    parentElement.appendChild(newDiv.firstChild);
    // now add infoURL to the caption
    const idOfCaption = `animal-info-url-cat-image-${i}`;
    catImageToDisplay.addInfoURLByID(idOfCaption);
  };
}


// create the HTML for an empty animal card
function emptyEndingCardHTML(animalID, i, url, altText, comment, favourited) {
  // construct the image template
  // console.log(`animal-info-url-${animalID}-${i}`);

  let favouriteClass;
  let favouriteIcon;
  if (favourited) {
    favouriteClass = 'favourited';
    favouriteIcon = 'fas fa-heart';
  } else {
    favouriteClass = 'non-favourited';
    favouriteIcon = 'far fa-heart';
  }
  const imageTemplate = `<div class="app-card app-card-favourite w3-col w3-padding" id="app-card-${animalID}-${i}">
      <div class="polaroid polaroid-favourite">
        <img id="${animalID}-${i}" class="polaroid-img polaroid-img-favourite" src="${url}" alt="${altText}" height=${polaroidImageHeight}>
        <!-- animal info (e.g. breed) -->
        <a href="" class="animal-info-url w3-cursive" id="animal-info-url-${animalID}-${i}">${altText}</a>
      </div>
      <!-- user comment -->
      <div class="w3-row w3-center">
        <p class="summary-comment w3-text-deep-purple w3-sans-serif" type="text" id="user-comment-${animalID}-${i}">${comment}</p>
        <!-- Buttons for various functions -->
        <a href="#" role="button" id="fav-btn-${animalID}-${i}" class="favourite-button ${favouriteClass} 
        summary-button secondary outline w3-border-amber w3-hover-border-green">
        <i class="fav-icon ${favouriteIcon}"></i></a>
      </div>
    </div>`;
    // console.log(imageTemplate);
  return imageTemplate;
}

function handleFavouriteButtonClick(event) {
  event.preventDefault();
  let clickedElement = event.target;
  let id = clickedElement.id;
  if (!id) {
    clickedElement = clickedElement.parentElement;
    id = clickedElement.id;
  }
  if (id) {
    // get user approval to permanently delete the image from the favourites
    console.log(id);
    const animalType = getAnimalImageTypeFromID(id);
    const arrayIndex = parseInt( getAnimalImageIndexFromID(id));
    itemToDelete = animalType + '-' + arrayIndex;
    flagToDelete = false;
    const modalConfirmation = document.querySelector('.modal-confirmation');
    modalConfirmation.style.display = 'block';
  }
}

function deleteFavouriteAfterModal() {
  if (flagToDelete && itemToDelete) {
    const animalType = getAnimalImageTypeFromID(itemToDelete);
    const arrayIndex = parseInt( getAnimalImageIndexFromID(itemToDelete));
    if (animalType === 'dog-image') {
      // if it is already a favourite, then remove it
      console.log('clicked favourite button');
      // remove from object from favourites at this array index
      dogImages.splice(arrayIndex, 1);
      // save favourites to local storage
      saveAnimalsToLocalStorage('dog-images', '-favourites', dogImages);
    } else if (animalType === 'cat-image') {
      // remove from object from favourites at this array index
      catImages.splice(arrayIndex, 1);
      // save favourites to local storage
      saveAnimalsToLocalStorage('cat-images', '-favourites', catImages);
    } else {
      return;
    }
    displayResultantAnimals();
  }
}

// event handler to show the info modal
function showInfoModal(event) {
  console.log('info link clicked');
  event.preventDefault();
  // display the modal
  const uiElement = event.target;
  const idValue = uiElement.id;
  const imageType = getAnimalImageTypeFromID(idValue);
  const idNumber = getAnimalImageIndexFromID(idValue);
  let infoURL;
  let modalTitle;
  let modalInfoText='';
  if (imageType === 'cat-image') {
    infoURL = catImages[idNumber].infoURL;
    modalTitle = catImages[idNumber].description;
  } else {
    infoURL = dogImages[idNumber].infoURL;
    modalTitle = dogImages[idNumber].description;
    modalInfoText = getDogBreedInfo(dogImages[idNumber].subBreed, dogImages[idNumber].dogBreed);
  }
  if (infoURL === '') {
    return;
  }
  openModal(infoURL, modalTitle, modalInfoText);
}

// Modal to confirm deletion of image from favourites
var modalConfirmation = document.querySelector('.modal-confirmation');

var span = document.querySelector('.close-modal-confirmation');
span.addEventListener('click', () => {
  hideModalConfirmationNo();
});

function hideModalConfirmationYes() {
  modalConfirmation.style.display = 'none';
  flagToDelete = true;
  deleteFavouriteAfterModal();
}

function hideModalConfirmationNo() {
  modalConfirmation.style.display = 'none';
  flagToDelete = false;
  itemToDelete = '';
}

window.onclick = function(event) {
  if (event.target == modalConfirmation) {
    hideModalConfirmationNo();
  }
};
