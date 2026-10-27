
document.addEventListener("DOMContentLoaded", () => {

  // ==========================================
  // ELEMENTS
  // ==========================================

  const scenes = document.querySelectorAll(".scene");

  const music = document.getElementById("backgroundMusic");
  const musicButton = document.getElementById("musicButton");
  const video = document.getElementById("memoryVideo");

  const gallery = document.getElementById("memoryGallery");
  const counter = document.getElementById("memoryCounter");
  const caption = document.getElementById("memoryCaption");

  const stars = document.getElementById("stars");
  const hearts = document.getElementById("hearts");

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // ==========================================
  // PHOTOS
  // ==========================================

  const photos = [
    "FB_IMG_1792507929575.jpg",
    "IMG_20261014_170342.jpg",
    "IMG_20261016_141456.jpg",
    "IMG_20261017_132152.jpg",
    "IMG_20261018_152135.jpg",
    "IMG_20261018_152842.jpg",
    "IMG_20261020_223231.jpg",
    "IMG_20261026_112641.jpg",
    "IMG_20261026_112655.jpg",
    "IMG_20261026_112826.jpg",
    "IMG-20261013-WA0181.jpeg",
    "IMG-20261014-WA0013.jpg",
    "IMG-20261014-WA0037.jpg",
    "IMG-20261014-WA0047.jpg",
    "Screenshot_20261013_232420.jpg",
    "Screenshot_20261013_232944.jpg",
    "Screenshot_20261026_100023.jpg"
  ];

  const memoryCaptions = [
    "Every moment with you feels like a dream. ♡",
    "My favorite place will always be beside you.",
    "You make ordinary days unforgettable.",
    "I wish I could pause time whenever I'm with you.",
    "Your smile is one of my favorite things.",
    "I found so much happiness in your arms.",
    "Every little memory means everything to me.",
    "I would choose you in every lifetime.",
    "You are my favorite part of this story.",
    "Even the simplest moments became special with you.",
    "I carry these memories wherever I go.",
    "Our love is worth every mile between us.",
    "Thank you for every laugh and every hug.",
    "You made these days feel like magic.",
    "This is only the beginning of our adventures.",
    "Until I can hold you again, I'll treasure every memory.",
    "Happy four months, my beautiful baby. ❤️"
  ];

  let currentPhoto = 0;

  // ==========================================
  // PHOTO GALLERY
  // ==========================================

  function showPhoto(index) {
    if (!gallery || !photos.length) return;

    currentPhoto =
      ((index % photos.length) + photos.length) %
      photos.length;

    gallery.innerHTML = "";

    const img = document.createElement("img");

    img.src = "assets/" + photos[currentPhoto];
    img.alt = "Our memory " + (currentPhoto + 1);
    img.className = "memory-photo";
    img.loading = "lazy";

    img.onerror = () => {
      if (counter) {
        counter.textContent = "Could not load this photo.";
      }
    };

    gallery.appendChild(img);

    if (counter) {
      counter.textContent =
        (currentPhoto + 1) + " / " + photos.length;
    }

    if (caption) {
      caption.textContent =
        memoryCaptions[currentPhoto] ||
        "Every memory with you is precious. ♡";

      if (!reduceMotion) {
        caption.style.animation = "none";
        void caption.offsetWidth;
        caption.style.animation =
          "captionAppear .8s ease both";
      }
    }
  }

  showPhoto(0);

  const previousPhoto =
    document.getElementById("previousPhoto");

  const nextPhoto =
    document.getElementById("nextPhoto");

  if (previousPhoto) {
    previousPhoto.addEventListener("click", () => {
      showPhoto(currentPhoto - 1);
    });
  }

  if (nextPhoto) {
    nextPhoto.addEventListener("click", () => {
      showPhoto(currentPhoto + 1);
    });
  }

  // ==========================================
  // MUSIC
  // ==========================================

  let musicWanted = false;
  let videoPlaying = false;
  let currentScene = "intro";
  let fadeInterval = null;

  if (music) {
    music.volume = 0.45;
  }

  function updateMusicButton() {
    if (!musicButton || !music) return;

    const isPlaying = !music.paused;

    musicButton.textContent = isPlaying ? "♫" : "♪";

    musicButton.setAttribute(
      "aria-label",
      isPlaying
        ? "Pause background music"
        : "Play background music"
    );
  }

  function fadeMusicTo(targetVolume, duration = 1000) {
    if (!music) return;

    if (fadeInterval !== null) {
      clearInterval(fadeInterval);
      fadeInterval = null;
    }

    const startVolume = music.volume;
    const steps = 20;
    const difference = targetVolume - startVolume;

    if (reduceMotion || duration <= 0) {
      music.volume = targetVolume;
      return;
    }

    let step = 0;

    fadeInterval = setInterval(() => {
      step++;

      music.volume = Math.max(
        0,
        Math.min(
          1,
          startVolume + difference * (step / steps)
        )
      );

      if (step >= steps) {
        clearInterval(fadeInterval);
        fadeInterval = null;
        music.volume = targetVolume;
      }
    }, duration / steps);
  }

  function targetMusicVolume() {
    return currentScene === "letter" ? 0.25 : 0.45;
  }

  async function playMusic() {
    if (!music || !musicWanted || videoPlaying) return;

    try {
      await music.play();

      if (!musicWanted || videoPlaying) {
        music.pause();
      } else {
        fadeMusicTo(targetMusicVolume(), 800);
      }
    } catch (error) {
      console.warn(
        "Music could not start. Check assets/music.mp3.m4a",
        error
      );
    }

    updateMusicButton();
  }

  function pauseMusic() {
    if (!music) return;

    if (fadeInterval !== null) {
      clearInterval(fadeInterval);
      fadeInterval = null;
    }

    music.pause();
    updateMusicButton();
  }

  if (musicButton) {
    musicButton.addEventListener("click", () => {
      musicWanted = !musicWanted;

      if (musicWanted) {
        if (videoPlaying && video) {
          video.pause();
          videoPlaying = false;
        }

        playMusic();
      } else {
        pauseMusic();
      }
    });
  }

  // ==========================================
  // MONARCH BUTTERFLIES
  // ==========================================

  const butterflyLayer = document.createElement("div");

  butterflyLayer.id = "butterflyLayer";
  butterflyLayer.setAttribute("aria-hidden", "true");

  document.body.appendChild(butterflyLayer);

  function createButterfly() {
    if (reduceMotion) return;

    const butterfly = document.createElement("span");
    butterfly.className = "monarch-butterfly";

    const leftWing = document.createElement("span");
    leftWing.className = "monarch-wing left-wing";

    const rightWing = document.createElement("span");
    rightWing.className = "monarch-wing right-wing";

    const body = document.createElement("span");
    body.className = "monarch-body";

    butterfly.append(leftWing, rightWing, body);

    butterfly.style.left =
      (5 + Math.random() * 85) + "%";

    butterfly.style.top =
      (15 + Math.random() * 70) + "%";

    butterfly.style.setProperty(
      "--drift-x",
      (Math.random() * 160 - 80) + "px"
    );

    butterfly.style.setProperty(
      "--drift-y",
      (-80 - Math.random() * 170) + "px"
    );

    const duration = 7 + Math.random() * 5;

    butterfly.style.animationDuration = duration + "s";

    butterflyLayer.appendChild(butterfly);

    setTimeout(() => {
      butterfly.remove();
    }, (duration + 1) * 1000);
  }

  function butterflyBurst(amount = 6) {
    if (reduceMotion) return;

    for (let i = 0; i < amount; i++) {
      setTimeout(createButterfly, i * 180);
    }
  }

  // ==========================================
  // STARS
  // ==========================================

  if (stars) {
    for (let i = 0; i < 90; i++) {
      const star = document.createElement("span");

      star.className = "star";
      star.style.left = Math.random() * 100 + "%";
      star.style.top = Math.random() * 100 + "%";
      star.style.animationDelay =
        Math.random() * 5 + "s";

      stars.appendChild(star);
    }
  }

  // ==========================================
  // FLOATING HEARTS
  // ==========================================

  function createHeart() {
    if (!hearts || reduceMotion) return;

    const heart = document.createElement("span");

    heart.className = "floating-heart";
    heart.textContent =
      Math.random() > 0.5 ? "♡" : "♥";

    heart.style.left = Math.random() * 100 + "%";
    heart.style.fontSize =
      (12 + Math.random() * 16) + "px";

    const duration = 7 + Math.random() * 5;

    heart.style.animationDuration = duration + "s";

    hearts.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, (duration + 1) * 1000);
  }

  if (!reduceMotion) {
    setInterval(createHeart, 2400);
    setInterval(createButterfly, 3600);
    butterflyBurst(4);
  }

  // ==========================================
  // FIRST HUG SURPRISE
  // ==========================================

  const revealHugButton =
    document.getElementById("revealHug");

  const hugPhoto =
    document.getElementById("hugPhoto");

  const hugOverlay =
    document.getElementById("hugOverlay");

  const hugMessage =
    document.getElementById("hugMessage");

  if (revealHugButton) {
    revealHugButton.addEventListener("click", () => {

      if (hugPhoto) {
        hugPhoto.classList.add("revealed");
      }

      if (hugOverlay) {
        hugOverlay.classList.add("disappearing");
      }

      setTimeout(() => {
        if (hugOverlay) {
          hugOverlay.hidden = true;
        }

        if (hugMessage) {
          hugMessage.hidden = false;
        }
      }, reduceMotion ? 0 : 1300);

      butterflyBurst(18);
    });
  }

  // ==========================================
  // LOVE LETTER
  // ==========================================

  const openLetter =
    document.getElementById("openLetter");

  const letterContent =
    document.getElementById("letterContent");

  if (openLetter && letterContent) {
    openLetter.addEventListener("click", () => {

      letterContent.hidden = false;
      openLetter.hidden = true;

      openLetter.setAttribute(
        "aria-expanded",
        "true"
      );

      butterflyBurst(14);

      if (musicWanted && !videoPlaying) {
        playMusic();
      }
    });
  }

  // ==========================================
  // VIDEO SOUND
  // ==========================================

  if (video) {
    video.addEventListener("play", () => {
      videoPlaying = true;
      pauseMusic();
    });

    video.addEventListener("pause", () => {
      videoPlaying = false;

      if (musicWanted && currentScene !== "videoMemory") {
        playMusic();
      }
    });

    video.addEventListener("ended", () => {
      videoPlaying = false;

      if (musicWanted) {
        playMusic();
      }
    });
  }

  // ==========================================
  // CHAPTER NAVIGATION
  // ==========================================

  function showScene(id) {
    const target = document.getElementById(id);

    if (!target || !target.classList.contains("scene")) {
      return;
    }

    currentScene = id;

    scenes.forEach(scene => {
      scene.classList.remove("active");
    });

    target.classList.add("active");

    window.scrollTo({
      top: 0,
      behavior: "auto"
    });

    if (video && id !== "videoMemory") {
      video.pause();
      videoPlaying = false;
    }

    if (musicWanted && !videoPlaying) {
      playMusic();
    }

    if (id === "firstHug") {
      butterflyBurst(9);
    }

    if (id === "letter") {
      butterflyBurst(6);
    }

    if (id === "ending") {
      butterflyBurst(20);
    }
  }

  document.querySelectorAll("[data-next]").forEach(
    button => {

      button.addEventListener("click", () => {
        const next = button.dataset.next;

        if (next === "distance" && !musicWanted) {
          musicWanted = true;

          if (musicButton) {
            musicButton.hidden = false;
          }

          playMusic();
        }

        if (next === "videoMemory") {
          pauseMusic();
        }

        showScene(next);
      });
    }
  );

  // ==========================================
  // INITIAL STATE
  // ==========================================

  updateMusicButton();

  console.log("Our Story is ready. ❤️🦋");

});
