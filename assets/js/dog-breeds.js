// Functions for dog breed information
let dogBreedInformation = [];
async function getDogBreeds() {
  dogBreedInformation = [];
  // check if the dog breeds are already in local storage
  // if not, call the dog API to get the list of breeds
  const dogBreeds = JSON.parse(localStorage.getItem('dog-breeds'));
  if (dogBreeds === null) {
    // call the dog API to get the list of breeds
    let newBreeds=[];
    let apiCall = new DogBreedInfoAPICall();
    let returnData = new DogBreedData(await apiCall.callAPI());
    // if API call was successful
    if (returnData.apiReturn.responseStatus === 200) {
      // save dog breed info object to array
    //   console.log('🚀 ~ file: dog-breeds.js:20 ~ getDogBreeds ~ currentPage:', returnData.currentPageURL);
    //   console.log('🚀 ~ file: dog-breeds.js:20 ~ getDogBreeds ~ lastPage:', returnData.lastPageURL);

      newBreeds = returnData.dataToArray();
      // the API returns a link url to the next page of data
      let moreData = true;
      while (moreData) {
        if (returnData.nextPageURL !== null && !(typeof returnData.nextPageURL === 'undefined') && returnData.nextPageURL != '' ) {
          // console.log('🚀 ~ file: dog-breeds.js:20 ~ getDogBreeds ~ nextPage:', returnData.nextPageURL);
          apiCall = new DogBreedInfoAPICall(returnData.nextPageURL); // pass in the next page url
          returnData = new DogBreedData(await apiCall.callAPI());
          if (returnData.apiReturn.responseStatus === 200) {
            newBreeds = newBreeds.concat(returnData.dataToArray());
            // console.log('🚀 ~ file: dog-breeds.js:20 ~ getDogBreeds ~ currentPage:', returnData.currentPageURL);
            // console.log('🚀 ~ file: dog-breeds.js:20 ~ getDogBreeds ~ lastPage:', returnData.lastPageURL);
            // console.log('🚀 ~ file: dog-breeds.js:20 ~ getDogBreeds ~ nextPage:', returnData.nextPageURL);
          } else {
            // console.log('🚀 ~ file: dog-breeds.js:20 ~ getDogBreeds ~ nextPage:', returnData.nextPageURL);
            moreData = false;
          }
        } else {
          moreData = false;
        }
      }
      dogBreedInformation=newBreeds;
    } else {
      // if API call was not successful
      // display error message
      alert(`Could not retrieve cat url collection data: ${returnData.apiReturn.errorMessage}`);
      return;
    }
    // save the dog breeds to local storage
    if (newBreeds.length > 0) {
      const serialized = {
        breeds: [],
      };
      for (let i = 0; i < newBreeds.length; i++) {
        let oDogBreed = new DogBreed();
        oDogBreed = newBreeds[i];
        const dogBreed = oDogBreed.serialize();
        serialized.breeds.push({
          dogBreed,
        });
      }
      localStorage.setItem('dog-breeds', JSON.stringify(serialized));
      // console.log('🚀 ~ file: dog-breeds.js:36 ~ getDogBreeds ~ serialized:', serialized);
    }
  } else {
    // deserialize the dog breeds
    // console.log("🚀 ~ file: dog-breeds.js:65 ~ getDogBreeds ~ dogBreeds:", JSON.stringify(dogBreeds));
    for (let i = 0; i < dogBreeds.breeds.length; i++) {
      const dogBreed =new DogBreed();
      dogBreed.deserialize(dogBreeds.breeds[i].dogBreed);
      dogBreedInformation.push(dogBreed);
    }
    // console.log('🚀 ~ file: dog-breeds.js:46 ~ getDogBreeds ~ dogBreedInformation:', dogBreedInformation);
  }
}

function getDogBreedInfo(subBreed, dogBreed) {
  // look through dogBreedInformation for the dog breed
  // if found, return the dog breed info
  // if not found, return ''
  let dogBreedInfo = '';
  for (let i = 0; i < dogBreedInformation.length; i++) {
    if (dogBreedInformation[i].dogBreed.toLowerCase() === dogBreed.toLowerCase()) {
      dogBreedInfo = dogBreedInformation[i].breedInfo;
      break;
    } else if (dogBreedInformation[i].dogBreed.toLowerCase() === (subBreed + ' ' + dogBreed).toLowerCase()) {
      dogBreedInfo = dogBreedInformation[i].breedInfo;
      break;
    } else if (dogBreedInformation[i].dogBreed.toLowerCase() === (dogBreed + ' ' + subBreed).toLowerCase()) {
      dogBreedInfo = dogBreedInformation[i].breedInfo;
      break;
    }
  }
  // if not found, look for the dog breed in the sub breeds
  if (dogBreedInfo === '') {
    for (let i = 0; i < dogBreedInformation.length; i++) {
      if (dogBreedInformation[i].dogBreed.toLowerCase().includes((subBreed + ' ' + dogBreed).toLowerCase())) {
        dogBreedInfo = dogBreedInformation[i].breedInfo;
        break;
      }
    };
  }
  if (dogBreedInfo === '') {
    for (let i = 0; i < dogBreedInformation.length; i++) {
      if (dogBreedInformation[i].dogBreed.toLowerCase().includes(subBreed.toLowerCase())) {
        dogBreedInfo = dogBreedInformation[i].breedInfo;
        break;
      }
    };
  }
  return dogBreedInfo;
}