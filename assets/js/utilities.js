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