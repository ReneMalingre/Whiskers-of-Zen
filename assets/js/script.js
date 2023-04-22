// get button element in index.html
const demoButton = document.getElementById('demo-button');
// add event listener to button
demoButton.addEventListener('click', callApis);

// create function to call dog and cat APIs
async function callApis() {
  let dogImages = [];
  let catImages = [];
  // get dog images from local storage
  const dogImagesFromStorage = JSON.parse(localStorage.getItem('dogImages'));
  // get cat images from local storage
  const catImagesFromStorage = JSON.parse(localStorage.getItem('catImages'));
  
  // if dog images and cat images are not null
  if (dogImagesFromStorage !== null ) {
    // convert to an array of dog images
    for (let i = 0; i < dogImagesFromStorage.dogs.length; i++) {
      const dogImage =new DogImage();
      dogImage.deserialize(dogImagesFromStorage.dogs[i].dog);
      dogImages.push(dogImage);
    }
  }

  if (dogImages.length === 0) {
    // call API to get dog images
    const returnData = new DogData(await new DogAPICall(10).callAPI());
    // if API call was successful
    if (returnData.apiReturn.responseStatus === 200) {
      // save dog images to local storage
      dogImages = returnData.dataToArray();
      saveDogsToLocalStorage(dogImages);
    }
  }

  if (catImagesFromStorage !== null ) {
    // create an array of cat images
    for (let i = 0; i < catImagesFromStorage.cats.length; i++) {
      console.log(i + ' ' + catImagesFromStorage.cats[i].cat);
      const catImage =new CatImage();
      catImage.deserialize(catImagesFromStorage.cats[i].cat);
      catImages.push(catImage);
    }
  }

  if (catImages.length === 0) {
    // call API to get dog images
    const returnData = new CatData(await new CatAPICall(10).callAPI());
    // if API call was successful
    if (returnData.apiReturn.responseStatus === 200) {
      // save cat images to local storage
      catImages = returnData.dataToArray();
      saveCatsToLocalStorage(catImages);
    }
  }

  // display images
  const dogImage1 = document.getElementById('dog-image1');
  const dogImage2 = document.getElementById('dog-image2');
  const catImage1 = document.getElementById('cat-image1');
  const catImage2 = document.getElementById('cat-image2');
  for (let i = 0; i < dogImages.length; i++) {
    console.log(dogImages[i]);
    // display it to an img element contained within the div with id="dogImages"
    if (i % 2 === 0) {
      dogImage1.innerHTML = `<img src="${dogImages[i].url}" alt="dog image" height=400>`;
      dogImage2.classList.add('invisible-image');
      dogImage1.classList.remove('invisible-image');
      catImage1.innerHTML = `<img src="${catImages[i].url}" alt="cat image" height=400>`;
      catImage2.classList.add('invisible-image');
      catImage1.classList.remove('invisible-image');
    } else {
      dogImage2.innerHTML = `<img src="${dogImages[i].url}" alt="dog image" height=400>`;
      dogImage1.classList.add('invisible-image');
      dogImage2.classList.remove('invisible-image');
      catImage2.innerHTML = `<img src="${catImages[i].url}" alt="cat image" height=400>`;
      catImage1.classList.add('invisible-image');
      catImage2.classList.remove('invisible-image');
    }
    await delay(2000);
  }
}

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

// delay function to use with async/await
function delay(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}
