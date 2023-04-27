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
