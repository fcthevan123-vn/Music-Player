const wrapper = document.querySelector(".wrapper"),
  musicImg = document.querySelector(".img-area img"),
  musicName = document.querySelector(".song-details .name"),
  musicArtist = document.querySelector(".song-details .artist"),
  mainAudio = document.querySelector("#main-audio"),
  playPauseBtn = document.querySelector(".play-pause"),
  prevBtn = document.querySelector("#prev"),
  nextBtn = document.querySelector("#next"),
  progressArea = document.querySelector(".progress-area"),
  progressBar = document.querySelector(".progress-bar"),
  musicList = document.querySelector(".music-list"),
  showMoreBtn = document.querySelector("#more-music"),
  hideMusicBtn = document.querySelector("#close");

let musicIndex = Math.floor(Math.random() * allMusic.length + 1);

window.addEventListener("load", () => {
  loadMusic(musicIndex);
  playingNow();
});

function loadMusic(indexNumb) {
  musicName.innerText = allMusic[indexNumb - 1].name;
  musicArtist.innerText = allMusic[indexNumb - 1].artist;
  musicImg.src = `/Assets/img/${allMusic[indexNumb - 1].img}.jpg`;
  mainAudio.src = `/Assets/song/${allMusic[indexNumb - 1].src}.mp3`;
}

function playMusic() {
  wrapper.classList.add("paused");
  playPauseBtn.querySelector("i").innerText = "pause";
  mainAudio.play();
}

function pauseMusic() {
  wrapper.classList.remove("paused");
  playPauseBtn.querySelector("i").innerText = "play_arrow";
  mainAudio.pause();
}

function nextMusic() {
  musicIndex++;
  musicIndex > allMusic.length ? (musicIndex = 1) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}

function prevMusic() {
  musicIndex--;
  musicIndex < 1 ? (musicIndex = allMusic.length) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}

playPauseBtn.addEventListener("click", () => {
  const isMusicPaused = wrapper.classList.contains("paused");
  isMusicPaused ? pauseMusic() : playMusic();
  playingNow();
});

nextBtn.addEventListener("click", () => {
  nextMusic();
});

prevBtn.addEventListener("click", () => {
  prevMusic();
});

mainAudio.addEventListener("timeupdate", (e) => {
  const currentTime = e.target.currentTime;
  const duration = e.target.duration;
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;

  let musicCurrentTime = document.querySelector(".current"),
    musicDuration = wrapper.querySelector(".duration");
  mainAudio.addEventListener("loadeddata", () => {
    //   update song total duration
    let audioDuration = mainAudio.duration;
    let totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.floor(audioDuration % 60);
    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    }
    musicDuration.innerText = `${totalMin}:${totalSec}`;
  });
  //   update playsing song current time
  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if (currentSec < 10) {
    currentSec = `0${currentSec}`;
  }
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

progressArea.addEventListener("click", (e) => {
  let progressWidthval = progressArea.clientWidth;
  let clickedOffSetX = e.offsetX;
  let songDuration = mainAudio.duration;

  mainAudio.currentTime = (clickedOffSetX / progressWidthval) * songDuration;
  playMusic();
});

// Random and repeat song
const repeatBtn = document.querySelector("#repeat-list");

repeatBtn.addEventListener("click", () => {
  let getText = repeatBtn.innerText;
  switch (getText) {
    case "repeat":
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "Song looped");
      break;
    case "repeat_one":
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "Playback shuffle");
      break;
    case "shuffle":
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "Playlist looped");
      break;
  }
});

// after the song ended
mainAudio.addEventListener("ended", () => {
  let getText = repeatBtn.innerText;
  switch (getText) {
    case "repeat":
      nextMusic();
      break;
    case "repeat_one":
      mainAudio.currentTime = 0;
      loadMusic(musicIndex);
      playMusic();
      break;
    case "shuffle":
      let randomIndex = Math.floor(Math.random() * allMusic.length + 1);
      do {
        randomIndex = Math.floor(Math.random() * allMusic.length + 1);
      } while (musicIndex == randomIndex);
      musicIndex = randomIndex;
      loadMusic(musicIndex);
      playMusic();
      playingNow();
      break;
  }
});

showMoreBtn.addEventListener("click", () => {
  musicList.classList.toggle("show");
});

hideMusicBtn.addEventListener("click", () => {
  showMoreBtn.click();
});

const ulTag = wrapper.querySelector("ul");

for (let i = 0; i < allMusic.length; i++) {
  let liTag = `<li li-index="${i + 1}">
                  <div class="row">
                    <span>${allMusic[i].name}</span>
                    <p>${allMusic[i].artist}</p>
                  </div>
                  <span id="${allMusic[i].src}" class="audio-duration"></span>
                  <audio class="${allMusic[i].src}" src="songs/${
    allMusic[i].src
  }.mp3"></audio>
                </li>`;
  ulTag.insertAdjacentHTML("beforeend", liTag); //inserting the li inside ul tag
  let liAudioDuartion = ulTag.querySelector(`#${allMusic[i].src}`);
  console.log(liAudioDuartion);
  let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);
  liAudioTag.addEventListener("loadeddata", () => {
    let duration = liAudioTag.duration;
    let totalMin = Math.floor(duration / 60);
    let totalSec = Math.floor(duration % 60);
    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    }
    liAudioDuartion.innerText = `${totalMin}:${totalSec}`;
    //liAudioDuartion.setAttribute("t-duration", `${totalMin}:${totalSec}`);
  });
}

const allLiTags = ulTag.querySelectorAll("li");
function playingNow() {
  for (let i = 0; i < allLiTags.length; i++) {
    let audioTag = allLiTags[i].querySelector(".audio-duration");
    if (allLiTags[i].classList.contains("playing")) {
      allLiTags[i].classList.remove("playing");
      audioTag.innerText = "";
    }
    if (allLiTags[i].getAttribute("li-index") == musicIndex) {
      allLiTags[i].classList.add("playing");
      audioTag.innerText = "Playing";
    }
    allLiTags[i].setAttribute("onclick", "clicked(this)");
  }
}

function clicked(element) {
  let getLiIndex = element.getAttribute("li-index");
  musicIndex = getLiIndex;
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}
