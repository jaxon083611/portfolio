let use24Hour = false;
let showSeconds = true;
let showMilliseconds = true;

function updateTime() {
  const timeElement = document.getElementById("time");
  const now = new Date();

  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();
  let milliseconds = now.getMilliseconds();

  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  milliseconds = milliseconds < 10 ? "00" + milliseconds : milliseconds < 100 ? "0" + milliseconds : milliseconds;

  let timeString;

  if (use24Hour) {
    hours = hours < 10 ? "0" + hours : hours;
    timeString = `${hours}:${minutes}`;
  } else {
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    timeString = `${hours}:${minutes} ${ampm}`;
  }

  if (showSeconds) {
    if (use24Hour) {
      timeString = `${timeString}:${seconds}`;
    } else {
      const [hourMinute, ampm] = timeString.split(" ");
      timeString = `${hourMinute}:${seconds} ${ampm}`;
    }

    if (showMilliseconds) {
      if (use24Hour) {
        timeString = `${timeString}.${milliseconds}`;
      } else {
        const [hourMinuteSeconds, ampm] = timeString.split(" ");
        timeString = `${hourMinuteSeconds}.${milliseconds} ${ampm}`;
      }
    }
  }

  timeElement.textContent = timeString;
}

function currentDate() {
  const weekdayElement = document.getElementById("weekday");
  const dateElement = document.getElementById("date");
  const now = new Date();

  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const weekday = weekdays[now.getDay()];

  let day = now.getDate();
  let month = now.getMonth() + 1; // Months are 0-based, so add 1
  let year = now.getFullYear();

  day = day < 10 ? "0" + day : day;
  month = month < 10 ? "0" + month : month;

  weekdayElement.textContent = weekday;
  dateElement.textContent = `${month}/${day}/${year}`;
}

function updateToggleButtons() {
  const militaryCheckbox = document.getElementById("toggle-military");
  const secondsCheckbox = document.getElementById("toggle-seconds");
  const millisecondsCheckbox = document.getElementById("toggle-milliseconds");
  const fullscreenCheckbox = document.getElementById("toggle-fullscreen");
  const militaryLabel = document.getElementById("toggle-military-label");
  const secondsLabel = document.getElementById("toggle-seconds-label");
  const millisecondsLabel = document.getElementById("toggle-milliseconds-label");
  const fullscreenLabel = document.getElementById("toggle-fullscreen-label");

  militaryCheckbox.checked = use24Hour;
  secondsCheckbox.checked = showSeconds;
  millisecondsCheckbox.checked = showMilliseconds;
  fullscreenCheckbox.checked = document.fullscreenElement ? true : false;

  militaryLabel.textContent = use24Hour ? "Use 12-hour time" : "Use 24-hour time";
  secondsLabel.textContent = showSeconds ? "Hide seconds" : "Show seconds";
  millisecondsLabel.textContent = showMilliseconds ? "Hide milliseconds" : "Show milliseconds";
  fullscreenLabel.textContent = document.fullscreenElement ? "Exit fullscreen" : "Enter fullscreen";
}

function toggleMilitaryTime(event) {
  use24Hour = event.target.checked;
  updateToggleButtons();
  updateTime();
}

function toggleSeconds(event) {
  showSeconds = event.target.checked;
  updateToggleButtons();
  updateTime();
}

function toggleMilliseconds(event) {
  showMilliseconds = event.target.checked;
  updateToggleButtons();
  updateTime();
}

function clearGradientBackgrounds() {
  const classesToRemove = [...document.body.classList].filter((c) => c.startsWith("gradient-"));
  classesToRemove.forEach((c) => document.body.classList.remove(c));
}

function setGradientBackground(className) {
  clearGradientBackgrounds();

  if (className === "none") {
    document.body.style.backgroundColor = document.getElementById("background-select").value;
  } else {
    document.body.style.backgroundColor = "";
    document.body.classList.add(className);
  }
}

function toggleFullscreen() {
  const pageElement = document.documentElement;

  if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
    if (pageElement.requestFullscreen) {
      pageElement.requestFullscreen();
    } else if (pageElement.webkitRequestFullscreen) {
      pageElement.webkitRequestFullscreen();
    } else if (pageElement.msRequestFullscreen) {
      pageElement.msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
}

function syncFullscreenText() {
  const clockElement = document.querySelector(".clock");
  const fullscreenActive = document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement;

  if (fullscreenActive) {
    clockElement.classList.add("fullscreen-text");
  } else {
    clockElement.classList.remove("fullscreen-text");
  }
}

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("customizer-toggle").addEventListener("click", () => {
    document.getElementById("customizer").classList.toggle("open");
  });
  document.getElementById("toggle-military").addEventListener("change", toggleMilitaryTime);
  document.getElementById("toggle-seconds").addEventListener("change", toggleSeconds);
  document.getElementById("toggle-milliseconds").addEventListener("change", toggleMilliseconds);
  document.getElementById("toggle-fullscreen").addEventListener("change", toggleFullscreen);
  document.getElementById("background-select").addEventListener("change", (event) => {
    clearGradientBackgrounds();
    document.body.style.backgroundColor = event.target.value;
    document.getElementById("gradient-select").value = "none";
  });
  document.getElementById("clock-select").addEventListener("change", (event) => {
    document.querySelector(".clock").style.backgroundColor = event.target.value;
    document.getElementById("customizer-toggle").style.backgroundColor = event.target.value;
  });
  document.getElementById("gradient-select").addEventListener("change", (event) => {
    setGradientBackground(event.target.value);
  });
  document.addEventListener("fullscreenchange", () => {
    syncFullscreenText();
    updateToggleButtons();
  });

  syncFullscreenText();
  updateToggleButtons();
  updateTime();
  currentDate();
  setInterval(() => {
    updateTime();
    currentDate();
  }, 1);
});