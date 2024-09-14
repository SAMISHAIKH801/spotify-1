console.log("chal rha h ");





// Search icon par click se popup open hoga
document.querySelector('.fa-magnifying-glass').addEventListener('click', function() {
    document.querySelector('.popup-search').style.display = 'block';
    document.querySelector('.popup-overlay').style.display = 'block';
  });
  
  // Popup band karne ke liye overlay par click
  document.querySelector('.popup-overlay').addEventListener('click', function() {
    document.querySelector('.popup-search').style.display = 'none';
    document.querySelector('.popup-overlay').style.display = 'none';
  });

  



let currentFolder = [];
// let songs ;
let currentSong = new Audio();
let playb = document.querySelector("#playb");

function formatTime(seconds) {
  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = Math.floor(seconds % 60);
  if (minutes < 10) minutes = "0" + minutes;
  if (remainingSeconds < 10) remainingSeconds = "0" + remainingSeconds;
  return minutes + ":" + remainingSeconds;
}




// Declare songs globally
let songs = [];

async function getSongs(folder) {
  currentFolder = folder;
  console.log("Current folder: ", currentFolder); // Debug folder path
  let a = await fetch(`${folder}/`);  // Without localhost

  // let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;

  let aSong = div.getElementsByTagName("a");
  songs = []; // Reset songs array here
  for (let i = 0; i < aSong.length; i++) {
    const element = aSong[i];
    if (element.href.endsWith(".mp3")) {
      let fileName = decodeURIComponent(element.href.split("/").slice(-1)[0]);
      songs.push({
        fileName: fileName, // Only filename without path
        songName: fileName,
      });
    }
  }

  console.log("Songs array: ", songs); // Add this to check the songs array

  let songURL = document
    .querySelector(".playlist")
    .getElementsByTagName("ul")[0];
  songURL.innerHTML = "";

  for (const song of songs) {
    let artist = songArtistMap[song.fileName] || "Unknown Artist";
    songURL.innerHTML += `
            <li>
                <div class="music-icon">
                    <i class="bi bi-music-note-beamed"></i>
                </div>
                <div class="songbox">
                    <div class="song-name">${song.songName}</div>  
                    <div class="singer">${artist}</div>
                </div>
                <div class="playnow">
                    <a class="playbtn">
                        <i class="bi bi-play-fill"></i>
                    </a>
                </div>
            </li>`;
  }

  // Correct the song click handler with songs now properly assigned
  Array.from(
    document.querySelector(".playlist").getElementsByTagName("li")
  ).forEach((e, index) => {
    console.log("Song clicked at index: ", index); // Add logging here
    e.addEventListener("click", () => {
      console.log("Songs array at click: ", songs); // Log songs array here
      // if (songs && songs[index]) {
      let selectSong = songs[index].fileName;
      playMusic(selectSong);
      // } else {
      //     console.error("Song not found at index:", index);
      // }
    });
  });
  return songs; // Return the songs array for further use
}

const songArtistMap = {
  "01%20-%20Zindagi%20Kitni%20Haseen%20Hay%20-%20ZKHH%20(ApniISP.Com)%20copy.mp3":
    "Unknown Artist ",
  // Add other songs here
};

const playMusic = (track, pause = false) => {
  let audio = `${currentFolder}/` + track;
  // let audio = `/${currentFolder}/` + track.split("/").pop();

  currentSong.src = audio;

  // Debug the file path
  console.log("Playing file: ", currentSong.src);

  if (!pause) {
    currentSong.play();
    playb.innerHTML = '<i class="bi bi-pause-fill"></i>';
  }
  // currentSong.play()

  let artist = songArtistMap[track] || "Unknown Artist";

  let songInfo = document.querySelector(".song-info");
  //   let songName = decodeURIComponent(track.split("/").slice(-1)[0]);

  let songName = track;

  //  songInfo.innerHTML =  track.replaceAll("%20", "")
  songInfo.innerHTML = `<div class="music-icon">
                                <i class="bi bi-music-note-beamed"></i>

                            </div>
                            <div class="songbox">
                                <div class="song-name">
                                  ${songName}
                                </div>  
                                <div class="singer">
                                  ${artist}
                                </div>
                            </div>`;

  // Before playing, set initial time and reset duration
  let playTimeElements = document.querySelectorAll(".play-time");
  playTimeElements[0].innerHTML = "00:00"; // Left side - current time
  playTimeElements[1].innerHTML = "00:00"; // Right side - total duration
};





  
async function main() {
  await getSongs("songs/artistfolder/");
  console.log(songs);

  playMusic(songs[0].fileName, true);
  // console.log(songs);


  //  song play & pause event ---------
  playb.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      playb.innerHTML = '<i class="bi bi-pause-fill"></i>';
    } else {
      currentSong.pause();
      playb.innerHTML = '<i class="bi bi-play-fill"></i>';
    }
  });

  currentSong.addEventListener("timeupdate", () => {
    let playTimeElements = document.querySelectorAll(".play-time");
    playTimeElements[0].innerHTML = `${formatTime(currentSong.currentTime)}`;
    playTimeElements[1].innerHTML = `${formatTime(currentSong.duration)}`;

    let seekDot = document.querySelector(".seek-dot");
    if (currentSong.duration) {
      seekDot.style.left =
        (currentSong.currentTime / currentSong.duration) * 100 + "%";
    }
  });

  // Seek bar click event
  let seekBar = document.querySelector(".seek-bar");
  seekBar.addEventListener("click", (e) => {
    let percent = e.offsetX / seekBar.offsetWidth;
    currentSong.currentTime = percent * currentSong.duration;

    let seekDot = document.querySelector(".seek-dot");
    seekDot.style.left = percent * 100 + "%";
  });

  //   playlist toggle event ----------
  let playListToggle = document.querySelector(".playlist-toggle");
  playListToggle.addEventListener("click", () => {
    document.querySelector(".left-box").style.left = "0";
  });

  let closeBTn = document.querySelector(".closebtn");
  closeBTn.addEventListener("click", () => {
    document.querySelector(".left-box").style.left = "-100%";
  });



  //   Voice seek bar event-----------
  let voiceBar = document.querySelector(".voice-s-bar");
  let voiceDot = document.querySelector(".voice-dot");

  voiceBar.addEventListener("click", (e) => {
    let percent = e.offsetX / voiceBar.offsetWidth;
    voiceDot.style.left = percent * 100 + "%";

    currentSong.volume = percent; // This will control the volume of the `currentSong`
    console.log(`Volume: ${currentSong.volume * 100}%`); // Log volume percentage
  });

  // Optionally, handle dragging functionality for smoother control
  voiceBar.addEventListener("mousemove", (e) => {
    if (e.buttons === 1) {
      // Check if the left mouse button is held down
      let percent = e.offsetX / voiceBar.offsetWidth;
      voiceDot.style.left = percent * 100 + "%";
      currentSong.volume = percent;
    }
  });

  let volumeIcon = document.querySelector('.voice-icon>i');
//   let voiceBar = document.querySelector(".voice-s-bar");
//   let voiceDot = document.querySelector(".voice-dot");
  let isMuted = false; // Track the mute status
  let previousVolume = 1; // Store the previous volume before mute
  
  



  volumeIcon.addEventListener('click', () => {
    if (!isMuted) {
        previousVolume = currentSong.volume; // Store current volume
        currentSong.volume = 0; // Mute the song
        volumeIcon.classList.replace('bi-volume-up', 'bi-volume-mute'); // Change icon to mute
        isMuted = true;
        updateVoiceBar(0); // Update bar to 0%
    } else {
        currentSong.volume = previousVolume > 0 ? previousVolume : 0.10; // Restore volume (at least 10%)
        volumeIcon.classList.replace('bi-volume-mute', 'bi-volume-up'); // Change icon back to volume-up
        isMuted = false;
        let volumePercent = currentSong.volume * 100; // Restore the volume percentage
        updateVoiceBar(volumePercent); // Update bar based on the percentage
    }
    console.log(`Volume muted: ${isMuted}`);
});

  
  // Function to update the dot position and background
  function updateVoiceBar(volumePercent) {
      // Set the dot's position based on the percentage
      voiceDot.style.left = volumePercent + '%';
      
      // Update the background of the bar
      voiceBar.style.background = `linear-gradient(to right, green ${volumePercent}%, #ccc ${volumePercent}%)`;
  }
  
  // Example of handling manual volume changes
  
  voiceBar.addEventListener('click', (e) => {
      let barWidth = voiceBar.offsetWidth;
      let clickPosition = e.offsetX;
      let volumePercent = (clickPosition / barWidth) * 100;
  
      // Adjust volume and update the bar accordingly
      currentSong.volume = volumePercent / 100; // Set volume based on percentage
      updateVoiceBar(volumePercent);
  });
  
  

//   next event btn
  let nextBtn = document.querySelector(".nextbtn");
  nextBtn.addEventListener("click", () => {
    console.log("next");
    let currentSongName = decodeURIComponent(
      currentSong.src.split("/").slice(-1)[0]
    ); // Decode the current song file name
    console.log("Current playing song (for next): ", currentSongName);

    let index = songs.findIndex((song) => song.fileName === currentSongName); // No decode needed here
    console.log("Current song index: ", index);

    if (index >= 0 && index + 1 < songs.length) {
      playMusic(songs[index + 1].fileName); // Play next song
    } else {
      console.log("No next song available");
    }
  });

  let prevBtn = document.querySelector(".prevbtn");
  prevBtn.addEventListener("click", () => {
    console.log("prev");
    let currentSongName = decodeURIComponent(
      currentSong.src.split("/").slice(-1)[0]
    ); // Decode the current song file name
    console.log("Current playing song (for prev): ", currentSongName);

    let index = songs.findIndex((song) => song.fileName === currentSongName); // No decode needed here
    console.log("Current song index: ", index);

    if (index > 0) {
      playMusic(songs[index - 1].fileName); // Play previous song
    } else {
      console.log("No previous song available");
    }
  });

  //  card load playlis event ----------

  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      // let folderItems = item.currentTarget.dataset.folder;

      console.log(item, item.currentTarget.dataset.folder);

      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}/`);

      if (songs.length > 0) {
        playMusic(songs[0].fileName, true); // Pass `true` to prevent autoplay
      }
    });
  });

  
  
}

main();

function handleTouchEvent(event) {
  if ('ontouchstart' in window || navigator.maxTouchPoints) {
    console.log("Mobile device par touch hua");
    // Touch specific code jo har clickable element ko handle karega
    // Aap yahan koi bhi logic likh sakte hain jo mobile touch ke liye chahiye
    event.target.click(); // Yeh line manually click event ko trigger karegi
  } else {
    console.log("Non-touch device par click hua");
    // Desktop ke liye koi extra code, agar zarurat ho
  }
}

// Mobile devices ke liye touchstart event listener
document.addEventListener('touchstart', handleTouchEvent);

// Desktop ke liye click event listener
document.addEventListener('click', handleTouchEvent);
