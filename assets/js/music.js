//music function
const songs = [
    new Audio('./assets/music/Del Rio Bravo.mp3'),
    new Audio('./assets/music/Ethereal Relaxation.mp3'),
    new Audio('./assets/music/Maccary Bay.mp3'),
    new Audio('./assets/music/Mandeville.mp3'),
    new Audio('./assets/music/No Frills Salsa.mp3'),
    new Audio('./assets/music/one.mp3'),
    new Audio('./assets/music/Thief in the Night.mp3'),
   ]; 
   
    let currentSong = 0;
   
   const playButton = document.querySelector('#play-button');
   const pauseButton = document.querySelector('#pause-button');
   const nextButton = document.querySelector('#next-button')
   
   playButton.addEventListener('click', () => {
     songs[currentSong].play();
   });
   
   pauseButton.addEventListener('click', () => {
     songs[currentSong].pause();
   });
   
   nextButton.addEventListener('click', () => {
     songs[currentSong].pause();
     currentSong = (currentSong + 1) % songs.length;
     songs[currentSong].play();
   });
   
   playButton.addEventListener('click', () => {
     //audio.play()
     if (playButton.checked) {
       console.log('checked = true');
       audioClass.play();
     } else {
       console.log('checked = false');
       audioClass.pause();
     }
   });
   