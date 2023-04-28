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

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

// ==================================================================
// Download to local file
function handleDownloadButton(event) {
  event.preventDefault();
  console.log('handleDownloadButton');
  // get the button that was clicked
  let buttonClicked = event.target;
  console.log(buttonClicked.tagName );

  if (buttonClicked.tagName === 'I') {
    buttonClicked = buttonClicked.parentElement;
  }

  // get the id of buttonClicked
  const buttonID = buttonClicked.id;
  console.log('🚀 ~ file: utilities.js:67 ~ handleDownloadButton ~ buttonID:', buttonID);

  // see what the index is at the end of the id, ie everything after the last dash
  const index = buttonID.lastIndexOf('-');
  // get the id of the image element to download
  const arrayIndex =parseInt(buttonID.substring(index + 1));
  // see if it is a dog or cat image
  const isDog = buttonID.includes('dog-image');
  
  let animalClass;
  if (isDog) {
    animalClass = new DogImage();
    animalClass = dogImages[arrayIndex];
  } else {
    animalClass = new CatImage();
    animalClass = catImages[arrayIndex];
  }
  let imageElementID;
  if (isDog) {
    imageElementID = `dog-image-${arrayIndex}`;
  } else {
    imageElementID = `cat-image-${arrayIndex}`;
  }

  copyImageToClipboard(imageElementID);
  return;

  // Get the image URI from the SRC
  const imageUri = animalClass.url;


  let fileName = animalClass.description;
  if (fileName === '') {
    fileName = 'cute animal.png';
  } else {
    fileName = `${fileName}.png`;
  }

  // Create a new anchor element to use as the download link
  const downloadLink = document.createElement('a');

  // Set the download link's href attribute to the image URI
  downloadLink.href = imageUri;

  // Set the download link's download attribute to the image filename
  downloadLink.download = fileName;

  // Append the download link to the document body
  document.body.appendChild(downloadLink);

  // Click the download link to start the download
  downloadLink.click();

  // Remove the download link from the document body
  document.body.removeChild(downloadLink);
}

// ==================================================================
// Share info to social media or whatever the user wants to do with it
function handleShareButton(event) {

}

// ==================================================================
// create a Twitter Intent URI
function createTwitterIntent(url, textToSend) {
  const imageUri = encodeURIComponent(url);
  const tweetText = encodeURIComponent(textToSend);
  return `https://twitter.com/intent/tweet?text=${tweetText}&url=${imageUri}`;
}

// ==================================================================
//copy image to the clipboard
function copyImageToClipboard(imgElementID) {
  const img = document.getElementById(imgElementID);
  const canvas = document.createElement('canvas');
  const canvasContext = canvas.getContext('2d');

  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  // Draw the image onto the canvas
  canvasContext.drawImage(img, 0, 0);

  // Convert the canvas data to a Blob object
  canvas.toBlob((blob) => {
    // Write the Blob object to the clipboard
    navigator.clipboard.write([new ClipboardItem({'image/png': blob})])
        .then(() => {
          console.log('Image copied to clipboard');
        })
        .catch((error) => {
          console.error(error);
        });
  }, 'image/png');
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
