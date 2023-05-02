// ==================================================================
// Utility Functions
// ==================================================================

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

function randomlyRotatePolaroids(maxAngle = 4) {
  // Select all the polaroid containers
  const polaroidContainers = document.querySelectorAll('.polaroid');

  // Loop through each container and apply a random rotation
  polaroidContainers.forEach((container) => {
    const rotation = getRandomRotation(-1 * maxAngle, maxAngle); // Adjust the range for your desired effect
    container.style.transform = `rotate(${rotation}deg)`;
  });
}

// Define a function to generate a random rotation within a range
function getRandomRotation(min, max) {
  return Math.random() * (parseFloat(max) - parseFloat(min)) + parseFloat(min);
}

// get a random integer between min and max
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// randomize the order of an array using the Fisher-Yates (Knuth) shuffle
function randomizeArray(arr) {
  if (!Array.isArray(arr)) {
    return arr;
  }
  if (arr.length < 2) {
    return arr;
  }
  for (let i = arr.length - 1; i > 0; i--) {
    const j = getRandomInt(0, i);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

// add event listeners to child elements by their class name, recursively
function addEventListenerToDOMBranch(parentElement, className, eventName, functionToCall ) {
  // Check if the current element is an img element
  if (parentElement.classList && parentElement.classList.contains(className)) {
    // Add the event listener to the element with the specified class name,
    // passing in the event
    parentElement.addEventListener(eventName, (event) => {
      functionToCall(event);
    });
  }

  // Traverse the child elements recursively
  if (parentElement.children && parentElement.children.length > 0) {
    for (const child of parentElement.children) {
      addEventListenerToDOMBranch(child, className, eventName, functionToCall );
    }
  }
}
// ==================================================================
// Toggling Favourite Button
// ==================================================================
// parameter might be fav-btn-dog-image-3
function toggleFavourite(elementID, newFavoriteState) {
  const favButton = document.getElementById(elementID);
  if (!favButton) {
    // console.log(elementID + ' not found');
    return;
  }

  const favIcon = favButton.querySelector('i');

  if (!newFavoriteState) {
    favButton.classList.remove('favourited');
    favButton.classList.add('non-favourited');
    favIcon.classList.add('far');
    favIcon.classList.remove('fas');
  } else {
    favButton.classList.add('favourited');
    favButton.classList.remove('non-favourited');
    favIcon.classList.remove('far');
    favIcon.classList.add('fas');
  }
}

// ==================================================================
// Modal Dialog Functions
// ==================================================================

// add w3 modal to the DOM to show information page
function addInfoModalToDOM() {
  const parentElement = document.querySelector('body');
  const modalHTML = `<div id="modal-info" class="w3-modal">
      <div class="w3-modal-content w3-animate-top">
        <div class="w3-container w3-padding-16">
          <span onclick="closeInfoModal()"
              class="modal-close w3-button w3-display-topright w3-red w3-text-white">&times;</span>
          <div class="w3-border-bottom w3-border-deep-purple w3-center ">
            <h3 class="w3-text-deep-purple w3-center" id="modal-info-title"></h2>
            <p id="modal-info-description"></p>
            <a href = "" id="modal-info-link" target="_blank">Click here to open the info link below in a new tab</a>
          </div>
          <iframe id="modal-info-iframe" src="" title="animal info from web"></iframe>
        </div>
      </div>
    </div>`;
  parentElement.insertAdjacentHTML('beforeend', modalHTML);
}

// open the modal
function openModal(url, title, infoText) {
  document.getElementById('modal-info-iframe').src = '';
  document.getElementById('modal-info-iframe').src = url;
  document.getElementById('modal-info-link').setAttribute('href', url);
  document.getElementById('modal-info-title').textContent = toTitleCase(title);
  document.getElementById('modal-info-description').textContent = infoText;
  document.getElementById('modal-info').style.display = 'block';
}

// close the info modal
function closeInfoModal() {
  document.getElementById('modal-info').style.display='none';
  document.getElementById('modal-info-iframe').src = '';
}


// ============= Custom Modal Alert ==================
// replace the inbuilt alert with this w3 modal
function showCustomAlert(alertMessage) {
  // Create the modal elements
  const modal = document.createElement('div');
  modal.className = 'w3-modal';
  modal.style.display = 'block';

  const modalContent = document.createElement('div');
  modalContent.className = 'w3-modal-content w3-card-4';

  const header = document.createElement('header');
  header.className = 'w3-container w3-deep-purple';

  const span = document.createElement('span');
  span.className = 'w3-button w3-display-topright w3-red w3-text-white strong';
  span.innerHTML = '&times;';
  span.onclick = function() {
    modal.style.display = 'none';
  };

  const h2 = document.createElement('h2');
  h2.classList.add('w3-text-white');
  h2.textContent = 'Whiskers of Zen - Alert';

  header.appendChild(span);
  header.appendChild(h2);

  const div = document.createElement('div');
  div.className = 'w3-container';

  const p = document.createElement('p');
  p.classList.add('w3-text-deep-purple', 'w3-padding-16');
  p.textContent = alertMessage;

  div.appendChild(p);

  modalContent.appendChild(header);
  modalContent.appendChild(div);

  modal.appendChild(modalContent);

  // Append the modal to the body
  document.body.appendChild(modal);
}

// image modal
function addImageModalToDOM() {
  const parentElement = document.querySelector('body');
  const modalHTML = `<div id="image-modal" class="w3-modal">
      <div class="w3-modal-content w3-animate-zoom w3-animate-opacity w3-deep-purple" id="image-modal-content">
          <div class="w3-container">
              <span class="w3-button w3-display-topright w3-red w3-text-white" onclick="document.getElementById('image-modal').style.display='none'">&times;</span>
              <div>
              <img id="modal-image" class="w3-padding" src="">
              </div>
          </div>
      </div>
  </div>`;
  parentElement.insertAdjacentHTML('beforeend', modalHTML);
}

function showImageModal(imageURL) {
  const modalImage= document.getElementById('modal-image');
  modalImage.src = imageURL;
  modalImage.onload = function() {
    // Adjust the width of the modal content after the image has loaded
    const modalContent = document.getElementById('image-modal-content');
    modalContent.style.width = (modalImage.naturalWidth > (window.innerWidth - 32) ? (window.innerWidth - 32) : modalImage.naturalWidth) + 'px';
    document.getElementById('image-modal').style.display = 'block';
  };
}


// show a modal when the user clicks an image
function animalImageClicked(event) {
  event.preventDefault();
  const imgElement = event.target;
  if (!imgElement) {
    return;
  }

  if (!imgElement.tagName || imgElement.tagName.toLowerCase() !== 'img') {
    return;
  }
  const url = imgElement.src;
  if (!url) {
    return;
  }

  showImageModal(url);
}

// ==================================================================
// Animal Array Filter and Manipulation Functions
// ==================================================================
// Get favourites
function filterFavourites(originalArray) {
  const favouritesArray = [];

  for (let i=0; i < originalArray.length; i++) {
    console.log('checking if favourite: ' + originalArray[i].isFavourite );
    if (originalArray[i].isFavourite == true) {
      // console.log('favourite found');
      favouritesArray.push(originalArray[i]);
    }
  }
  return favouritesArray;
}

// get the zen animals
function sortArrayByZenRatingDescending(originalArray) {
  const sortedArray = originalArray.sort((a, b) => parseInt(b.zenRating) - parseInt(a.zenRating));
  const zenArray = [];
  for (let i=0; i < sortedArray.length; i++) {
    console.log('checking zen rating: ' + sortedArray[i].zenRating);
    if (sortedArray[i].zenRating >=4) {
      zenArray.push(sortedArray[i]);
    }
  }
  return zenArray;
}

// get the cute animals
function sortArrayByCuteRatingDescending(originalArray) {
  const sortedArray = originalArray.sort((a, b) => parseInt(b.cuteRating) - parseInt(a.cuteRating));
  const cuteArray = [];
  for (let i=0; i < sortedArray.length; i++) {
    if (sortedArray[i].cuteRating >=4) {
      cuteArray.push(sortedArray[i]);
    }
  }
  return cuteArray;
}

// get the ugly animals
function sortArrayByCuteRatingAscending(originalArray) {
  const sortedArray = originalArray.sort((a, b) => parseInt(a.cuteRating) - parseInt(b.cuteRating));
  const cuteArray = [];
  for (let i=0; i < sortedArray.length; i++) {
    if (sortedArray[i].cuteRating <=2) {
      cuteArray.push(sortedArray[i]);
    }
  }
  return cuteArray;
}

function concatArraysIfUniqueOnURL(originalArray, newArray) {
  // Loop through the new array
  for (const animal of newArray) {
    // Check if the animal's URL is already in the original array
    const animalExists = originalArray.some((originalAnimal) => originalAnimal.url === animal.url);

    // If the animal doesn't exist in the original array, add it
    if (!animalExists) {
      originalArray.push(animal);
    }
  }

  return originalArray;
}

// figure out if the id is a dog-image or a cat-image
function getAnimalImageTypeFromID(elementID) {
  const regex = /.*?((dog|cat)-image)-(\d+)$/;
  const match = elementID.match(regex);

  if (match) {
    return match[1]; // Returns 'dog-image' or 'cat-image'
  } else {
    return null; // Returns null if no match is found
  }
}

// return the array index of the dog or cat image
function getAnimalImageIndexFromID(elementID) {
  const regex = /.*?((dog|cat)-image)-(\d+)$/;
  const match = elementID.match(regex);

  if (match) {
    return parseInt(match[3], 10); // Returns the image number
  } else {
    return null; // Returns null if no match is found
  }
}

function getStringBeforeDash(inputString) {
  const stringParts = inputString.split('-');
  return stringParts[0];
}

// ==================================================================
// Local Storage Functions
// ==================================================================
// Get the animals from local storage
// eg getAnimalsFromLocalStorage('dog-images', '-favourites')
function getAnimalsFromLocalStorage(animalType, storeFilter) {
  // Get the animals from local storage
  const storedJSON = localStorage.getItem(animalType + storeFilter);
  if (!storedJSON) {
    return [];
  }

  // Parse the JSON into an object
  const animalStore = JSON.parse(storedJSON);
  // If there are no animals in local storage, return an empty array
  if (!animalStore) {
    return [];
  }

  // if dog images and cat images are not null
  // convert to an array of dog images
  if (animalType === 'dog-images') {
    const savedDogs = [];
    for (let i = 0; i < animalStore.dogs.length; i++) {
      const dogImage =new DogImage();
      dogImage.deserialize(animalStore.dogs[i].dog);
      savedDogs.push(dogImage);
    }
    return savedDogs;
  } else {
    // create an array of cat images
    const savedCats = [];
    for (let i = 0; i < animalStore.cats.length; i++) {
      //   console.log(i + ' ' + catImagesFromStorage.cats[i].cat);
      const catImage =new CatImage();
      catImage.deserialize(animalStore.cats[i].cat);
      savedCats.push(catImage);
    }
    return savedCats;
  }
}

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

// Save the animals to local storage
// eg saveAnimalsToLocalStorage('dog-images', '-favourites', dogImages)
function saveAnimalsToLocalStorage(animalType, storeFilter, animalsToSave) {
  // clear the store if empty array
  if (animalsToSave === null || animalsToSave.length === 0) {
    localStorage.setItem(animalType + storeFilter, '' );
    return;
  }

  if (animalType === 'cat-images') {
    const serialized = {
      cats: [],
    };
    for (let i = 0; i < animalsToSave.length; i++) {
      let oCatImage = new CatImage();
      oCatImage = animalsToSave[i];
      const cat = oCatImage.serialize();
      serialized.cats.push({
        cat,
      });
    }
    localStorage.setItem(animalType + storeFilter, JSON.stringify(serialized));
  } else {
    const serialized = {
      dogs: [],
    };
    for (let i = 0; i < animalsToSave.length; i++) {
      let oDogImage = new DogImage();
      oDogImage = animalsToSave[i];
      const dog = oDogImage.serialize();
      serialized.dogs.push({
        dog,
      });
    }
    localStorage.setItem(animalType + storeFilter, JSON.stringify(serialized));
    console.log(animalType + ' saved to local storage ' + JSON.stringify(serialized));
  }
}
