// Description: Classes for the Cat and Dog API calls

// ====================== Base AnimalImage class ======================
// AnimalImage is the base class for CatImage and DogImage
// it holds the common properties and methods
// and is used to serialise and deserialise the common data
class AnimalImage {
  constructor(url = '', width = 0, height = 0) {
    this.url = url; // url of image
    this.width = width;
    this.height = height;
    this.description = ''; // description of image (breed)
    this.cuteRating = 0; // cuteRating of image
    this.zenRating = 0; // mood rating of image
    this.isFavourite = false; // is image a favourite?
    this.userComment = ''; // comment on image
    this.imgElementID = ''; // id of img element dog-image-1 or cat-image-1
    this.invalidImage = false; // is image invalid?
    this.infoURL = '';
  }
  // serialise and deserialise functions
  // serialize returns a JSON object
  serialize() {
    return {
      url: this.url,
      width: this.width,
      height: this.height,
      description: this.description,
      cuteRating: this.cuteRating,
      zenRating: this.zenRating,
      isFavourite: this.isFavourite,
      userComment: this.userComment,
      infoURL: this.infoURL,
    };
  }
  // deserialize parameter is a JSON object
  deserialize(jsonObject) {
    this.url = jsonObject.url;
    this.width = jsonObject.width;
    this.height = jsonObject.height;
    this.description = jsonObject.description;
    this.cuteRating = jsonObject.cuteRating;
    this.zenRating = jsonObject.zenRating;
    this.isFavourite = jsonObject.isFavourite;
    this.userComment = jsonObject.userComment;
    this.infoURL = jsonObject.infoURL;
  }

  addURLAndAltToImgByID(id) {
    const imageElement = document.getElementById(id);
    if (!this.url) {
      imageElement.setAttribute('src', 'assets/images/dog-sml.png');
    } else {
      imageElement.setAttribute('src', this.url);
    }
    if (!(typeof this.description === 'undefined')) {
      imageElement.setAttribute('alt', this.description);
      imageElement.setAttribute('data-filename', `${this.description}.png`);
      // add info to other elements here if needed
    } else {
      imageElement.setAttribute('alt', 'placeholder');
      imageElement.setAttribute('data-filename', `cute animal.png`);
    }
    // save the id of the img element
    this.imgElementID = id;
  }
}
// ====================== End Base AnimalImage class ======================

// ====================== CatImage class, inherits AnimalImage class ======================
class CatImage extends AnimalImage {
  constructor(id = '', url = '', width = 0, height = 0) {
    super(url, width, height);
    this.id = id;
    this.hasBreed=false;
    super.description = '';
  }
  static fromJSON(data) {
    const {id, url, width, height, breeds = null} = data;
    const newCatImage = new CatImage(id, url, width, height);
    if (breeds) {
      if (breeds[0].name) {
        newCatImage.description = breeds[0].name;
        newCatImage.hasBreed=true;
        let infoURL = breeds[0].wikipedia_url;
        if (infoURL === undefined) {
          infoURL = breeds[0].vcahospitals_url;
        }
        if (infoURL === undefined) {
          infoURL = breeds[0].vetstreet_url;
          ;
        }
        if (infoURL === undefined) {
          infoURL = '';
        }
        newCatImage.infoURL = infoURL;
      }
    }
    return newCatImage;
  }
  addInfoURLByID(id) {
    const linkElement = document.getElementById(id);
    linkElement.textContent = toTitleCase(this.description);
    if (this.infoURL) {
      linkElement.setAttribute('data-info-url', this.infoURL);
    } else {
      if (!this.description) {
        linkElement.setAttribute('data-info-url', '');
      } else {
        // search for cat breed in wikipedia
        let searchTerm = `${this.description}`.trim();
        if (searchTerm) {
          if (!searchTerm.toLowerCase().includes('cat')) {
            searchTerm += ' cat';
          }
          const encodedSearchTerm = encodeURIComponent(searchTerm);
          const searchURL = `https://en.wikipedia.org/w/index.php?search=${encodedSearchTerm}&title=Special:Search`;
          linkElement.setAttribute('data-info-url', searchURL);
          this.infoURL = searchURL;
        } else {
          linkElement.setAttribute('data-info-url', '');
        }
      }
    }
  }
  // serialise and deserialise functions
  // serialize returns a JSON object
  serialize() {
    return {
      ...super.serialize(),
      id: this.id,
      hasBreed: this.hasBreed,
      infoURL: this.infoURL,
    };
  }
  // deserialize parameter is a JSON object
  deserialize(jsonObject) {
    super.deserialize(jsonObject);
    this.id = jsonObject.id;
    this.hasBreed = jsonObject.hasBreed;
    this.infoURL = jsonObject.infoURL;
  }
}
// ====================== End CatImage class ======================

// ====================== DogImage class, inherits AnimalImage class ======================
class DogImage extends AnimalImage {
  constructor(url = '', dogBreed = '', subBreed = '', width = 0, height = 0) {
    super(url, width, height);
    this.dogBreed = dogBreed;
    this.subBreed = subBreed;
    super.description = `${subBreed} ${dogBreed}`.trim();
  }
  static fromJSON(data) {
    // eg https://images.dog.ceo/breeds/spaniel-welsh/n02102177_2586.jpg
    const url = String(data);
    const pathSegments = url.split('/');

    const breedInfo = pathSegments[4]; // "spaniel-welsh" in the example
    const breedParts = breedInfo.split('-');
    const dogBreed = breedParts[0];
    let subBreed = breedParts[1];
    if (subBreed === undefined) {
      subBreed = '';
    }
    return new DogImage(url, dogBreed, subBreed);
  }
  addInfoURLByID(id) {
    const linkElement = document.getElementById(id);
    linkElement.textContent= toTitleCase(this.description);
    let searchTerm = `${this.subBreed} ${this.dogBreed}`.trim();
    if (searchTerm) {
      if (searchTerm.toLowerCase() === 'mix') {
        searchTerm = 'Mongrel';
      }
      if (!searchTerm.toLowerCase().includes('dog') && !searchTerm.toLowerCase().includes('terrier')) {
        searchTerm += ' dog';
      }
      const encodedSearchTerm = encodeURIComponent(searchTerm);
      const searchURL = `https://en.wikipedia.org/w/index.php?search=${encodedSearchTerm}&title=Special:Search`;
      linkElement.setAttribute('data-info-url', searchURL);
      this.infoURL = searchURL;
    } else {
      linkElement.setAttribute('data-info-url', '');
      this.infoURL = '';
    }
  }
  // serialise and deserialise functions
  // serialize returns a JSON string
  serialize() {
    return {
      ...super.serialize(),
      dogBreed: this.dogBreed,
      subBreed: this.subBreed,
    };
  }

  // deserialize parameter is a JSON object
  deserialize(jsonData) {
    super.deserialize(jsonData);
    this.dogBreed = jsonData.dogBreed;
    this.subBreed = jsonData.subBreed;
  }
}
// ====================== End DogImage class ======================

// ====================== DogBreed class ======================
// info about a dog breed from https://dogapi.dog/
class DogBreed {
  constructor( dogBreed = '', breedInfo = '') {
    this.dogBreed = dogBreed;
    this.breedInfo = breedInfo;
  }
  static fromJSON(data) {
    // get data from the JSON object from the API
    const dogBreed =data.attributes.name;
    const breedInfo = data.attributes.description;
    if (dogBreed === undefined) {
      dogBreed = '';
    }
    if (breedInfo === undefined) {
      breedInfo = '';
    }
    return new DogBreed(dogBreed, breedInfo);
  }
  // serialise and deserialise functions
  // serialize returns a JSON string
  serialize() {
    return {
      dogBreed: this.dogBreed,
      breedInfo: this.breedInfo,
    };
  }
  // deserialize parameter is a JSON object
  deserialize(jsonData) {
    this.dogBreed = jsonData.dogBreed;
    this.breedInfo = jsonData.breedInfo;
  }
}
// ====================== End DogBreed class ======================

// ====================== APIReturn class =========================
// holds the data, status and error message returned from the API
// why use an object when a class can be used? 😉
class APIReturn {
  constructor(status = 0, message = '', data = null) {
    this.responseStatus = status; // response.status: 200 = OK, 404 = Not Found, etc.
    this.errorMessage = message; // response error message or ''
    this.jsonData = data; // response JSON data or null
  }
}
// ====================== End APIReturn class ======================

// ====================== DogData class =========================
// used to hold the data returned from the API
// and convert it to an array of DogImage objects
class DogData {
  constructor(apiReturn = new APIReturn()) {
    this.apiReturn =new APIReturn();
    // copy properties from apiReturn to this.apiReturn
    this.apiReturn.responseStatus = apiReturn.responseStatus;
    this.apiReturn.errorMessage = apiReturn.errorMessage;
    this.apiReturn.jsonData = apiReturn.jsonData;
  }
  dataToArray() {
    const returnArray = [];
    if (this.apiReturn.jsonData !== null) {
      for (let i=0; i<this.apiReturn.jsonData.message.length; i++) {
        returnArray.push(DogImage.fromJSON(this.apiReturn.jsonData.message[i]));
      };
    }
    return returnArray;
  }
}
// ====================== End DogData class ======================

// ====================== CatData class =========================
// used to hold the data returned from the API
// and convert it to an array of CatImage objects
class CatData {
  constructor(apiReturn = new APIReturn()) {
    this.apiReturn =new APIReturn();
    // copy properties from apiReturn to this.apiReturn
    this.apiReturn.responseStatus = apiReturn.responseStatus;
    this.apiReturn.errorMessage = apiReturn.errorMessage;
    this.apiReturn.jsonData = apiReturn.jsonData;
  }
  dataToArray() {
    const returnArray = [];
    if (this.apiReturn.jsonData !== null) {
      for (let i=0; i<this.apiReturn.jsonData.length; i++) {
        returnArray.push(CatImage.fromJSON(this.apiReturn.jsonData[i]));
      };
    }
    return returnArray;
  }
}
// ====================== End CatData class ======================


// ====================== DogBreedData class =========================
// used to hold the data returned from the API
// and convert it to an array of DogImage objects
class DogBreedData {
  constructor(apiReturn = new APIReturn()) {
    this.apiReturn =new APIReturn();
    // copy properties from apiReturn to this.apiReturn
    this.apiReturn.responseStatus = apiReturn.responseStatus;
    this.apiReturn.errorMessage = apiReturn.errorMessage;
    this.apiReturn.jsonData = apiReturn.jsonData;
    this.getLinks();
  }
  getLinks() {
    if (this.apiReturn.jsonData !== null) {
      // get the links from the JSON data
      const links = this.apiReturn.jsonData.links;
      // get the current page URL
      this.currentPageURL = links.current;
      // get the next page URL
      this.nextPageURL = links.next;
      // get the last page URL
      this.lastPageURL = links.last;
    } else {
      this.currentPageURL = '';
      this.nextPageURL = '';
      this.lastPageURL = '';
    }
  }
  dataToArray() {
    const returnArray = [];
    // get the data from the JSON data
    for (let i=0; i<this.apiReturn.jsonData.data.length; i++) {
      const newDogBreed = DogBreed.fromJSON(this.apiReturn.jsonData.data[i]);
      if (newDogBreed.dogBreed && newDogBreed.breedInfo) {
        returnArray.push(DogBreed.fromJSON(this.apiReturn.jsonData.data[i]));
      }
    };
    return returnArray;
  }
}
// ====================== End DogBreedData class ======================

// ====================== AnimalAPICall base class =========================
// base class for API calls, with common properties and methods
class AnimalAPICall {
  constructor(imageCount) {
    this.url = '';
    // validate the imageCount parameter so that it is at least 1
    if (imageCount === undefined || imageCount === null || imageCount < 1) {
      imageCount = 1;
    }
    this.imageCount = imageCount;
  }
  // call the API and return the data
  async callAPI() {
    const newAPIReturn = new APIReturn();
    // set flags to retry on error
    let success = false;
    let attempts = 0;
    // retry up to 3 times
    while (!success && attempts < 3) {
      // call the API
      try {
        const response = await fetch(this.url);
        newAPIReturn.responseStatus = response.status;
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        // get the json data from the response
        const data = await response.json();

        // put the data into the newAPIReturn object
        newAPIReturn.jsonData = data;
        newAPIReturn.errorMessage = '';
      } catch (error) {
        // store the error message in the newAPIReturn object
        newAPIReturn.errorMessage = error.message;
        // set the jsonData to null
        newAPIReturn.jsonData=null;
      }
      // if there was no error, set success to true
      if (newAPIReturn.errorMessage === '') {
        success = true;
      } else {
        // if there was an error, increment the attempts counter
        attempts++;
        // wait 500ms before trying again
        await this.delay(500);
      }
    }
    return newAPIReturn;
  }
  // delay function to use with async/await
  delay(milliseconds) {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  }
}
// ====================== End AnimalAPICall base class ======================

// ====================== DogAPICall class inherits AnimalAPICall class =====
// call the Dog API: formats the URL appropriately to get dogs
// contains the dog-specific properties and methods (url, maxCount, preferredMaxCount)
class DogAPICall extends AnimalAPICall {
  constructor(_imageCount=10) {
    super(_imageCount);
    this.maxCount = 50;
    this.preferredMaxCount = 50;
    // validate the imageCount parameter so that it is at most 50 (the API limit)
    if (this.imageCount > this.maxCount) {
      this.imageCount = this.maxCount;
    }
    this.url = `https://dog.ceo/api/breeds/image/random/${this.imageCount}`;
  }
  static preferredMaxCount() {
    return 50;
  }
}
// ====================== End DogAPICall class =============================

// ====================== CatAPICall class inherits AnimalAPICall class =====
// call the Cat API: formats the URL appropriately to get cats
// contains the cat-specific properties and methods (url, maxCount, preferredMaxCount)
class CatAPICall extends AnimalAPICall {
  constructor(_imageCount=10, _hasBreeds = false) {
    super(_imageCount);
    this.maxCount = 100;
    this.hasBreeds = _hasBreeds;
    // validate the imageCount parameter so that it is at most 100 (the API limit)
    if (this.imageCount > this.maxCount) {
      this.imageCount = this.maxCount;
    }
    // if the imageCount is greater than 10, use the API key
    if (this.hasBreeds) {
      this.url= `https://api.thecatapi.com/v1/images/search?limit=${this.imageCount}&has_breeds=1&api_key=${this.catAPIKey()}`;
    } else if (this.imageCount > 10) {
      this.url= `https://api.thecatapi.com/v1/images/search?limit=${this.imageCount}&api_key=${this.catAPIKey()}`;
    } else {
      this.url= `https://api.thecatapi.com/v1/images/search?limit=${this.imageCount}`;
    }
  }
  catAPIKey() {
    // this is a function to obfuscate the API key from bots
    return 'live_wl' + 'Yu6IfaRaG' + 'ebWK7gPyIBbog' + 'WmIZg' + 'hev' + 'pPEXWxL' + 'XdSB2oVF0cYk' + 'FylB3fZ' + 'lO66lV';
  }
  static preferredMaxCount(hasBreeds=false) {
    if (hasBreeds) {
      return 100;
    }
    return 10;
  }
}
// ====================== End CatAPICall class =============================

// ====================== DogBreedInfoAPICall class inherits AnimalAPICall class =====
// fetches a big list of dog breeds
class DogBreedInfoAPICall extends AnimalAPICall {
  constructor(url = 'https://dogapi.dog/api/v2/breeds') {
    super();
    // no parameters, just a big list of dog breeds and info
    this.url = url;
  }
}
// ====================== End DogBreedInfoAPICall class =============================

// ====================== LoadTimer class ==================================
// this class encapsulates the timer that is used to check the loading status of images
// it raises a custom event that is handled outside the class
// the timer interval is set to 150ms by default
// its a bit easier to use than the built-in setInterval function IMHO
class LoadTimer {
  constructor(intervalMilliseconds = 150) {
    this.timerInterval = intervalMilliseconds;
    this.loadTimer = null;
    this.totalTime = 0;
  }
  // this method raises a custom event that is handled outside the class
  raiseEventTimerTick() {
    this.totalTime += this.timerInterval;
    const timerTickEvent = new CustomEvent('timerTick');
    document.dispatchEvent(timerTickEvent);
  }
  startTimer() {
    this.totalTime = 0;
    // start the timer and set the function to run every interval defined by this.timerInterval
    this.loadTimer = setInterval(() => {
      this.raiseEventTimerTick();
    }, this.timerInterval);
  }
  // stop the timer
  stopTimer() {
    clearInterval(this.loadTimer);
  }
}
// ====================== End LoadTimer class ==============================