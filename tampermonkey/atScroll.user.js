// ==UserScript==
// @name         AT Volume Scroll
// @namespace    https://www.angelthump.com/
// @version      1.0
// @description  Small script to allow users to scorll on Angel Thump and control the volume
// @author       RingoMar
// @match        *://*.angelthump.com/*
// @run-at       document-start
// @allFrames    true
// @downloadURL  none
// @homepageURL  https://github.com/RingoMar/at_scroll
// @icon         https://raw.githubusercontent.com/RingoMar/at_scroll/main/img/icon128.png
// ==/UserScript==

(function () {
  "use strict";
  const settings = {
    volume: 20,
    volumeIncrement: 3,
    slowScroll: false,
  };

  function hasAudio(video) {
    return (
      video.mozHasAudio ||
      Boolean(video.webkitAudioDecodedByteCount) ||
      Boolean(video.audioTracks && video.audioTracks.length)
    );
  }

  const rinScroll = (element, video) => {
    if (!hasAudio(video)) return; // No Audio no scroll

    let volume = video.volume * 100; //video.volume is a percentage, multiplied by 100 to get integer values
    let direction = (event.deltaY / 100) * -1; //deltaY is how much the wheel scrolled, 100 up, -100 down. Divided by 100 to only get direction, then inverted
    let increment = settings.volumeIncrement;

    if (settings.slowScroll) {
      if (direction === -1 && volume <= settings.volumeIncrement) {
        increment = 1;
      } else if (direction === 1 && volume < settings.volumeIncrement) {
        increment = 1;
      }
    }

    volume += increment * direction;

    if (volume > settings.volumeIncrement) {
      //Rounding the volume to the nearest increment, in case the original volume was not on the increment
      volume = volume / settings.volumeIncrement;
      volume = Math.round(volume);
      volume = volume * settings.volumeIncrement;
    }

    volume = Math.round(volume);
    volume = volume / 100;

    //Limiting the volume to between 0-1
    if (volume < 0) {
      volume = 0;
    } else if (volume > 1) {
      volume = 1;
    }

    video.muted = volume <= 0;

    video.volume = volume;
    video.dataset.volume = volume;

    let volPerc = Math.round(video.volume * 100);
    let volSlideBall = document.querySelector(
      "#root > div > div > div > div > div.sc-kLwhqv.eRmDSJ > div > div:nth-child(1) > div > span > span.sc-ksdxgE.bHMVpy.MuiSlider-track"
    );
    let volSlideBack = document.querySelector(
      "#root > div > div > div > div > div.sc-kLwhqv.eRmDSJ > div > div:nth-child(1) > div > span > span.sc-hBUSln.kdljiG.MuiSlider-thumbColorPrimary.MuiSlider-thumbSizeSmall.MuiSlider-thumb"
    );
    if (volSlideBall !== null && volSlideBall !== undefined) {
      volSlideBall.style.width = volPerc + "%";
      volSlideBack.style.left = volPerc + "%";
    }
  };

  const onScroll = (event) => {
    let elements = document.elementsFromPoint(event.clientX, event.clientY);
    for (let element of elements) {
      if (element.tagName === "VIDEO") {
        event.preventDefault();
        rinScroll(element, element);
      }
    }
  };

  document.addEventListener("wheel", onScroll, { passive: false });

})();
