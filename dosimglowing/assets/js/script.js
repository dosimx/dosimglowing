'use strict';



/**
 * функция добавления события
 */

const addEventOnElem = function (elem, type, callback) {
  if (elem.length > 1) {
    for (let i = 0; i < elem.length; i++) {
      elem[i].addEventListener(type, callback);
    }
  } else {
    elem.addEventListener(type, callback);
  }
}



/**
 * анимация бургер меню
 */

const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const navbar = document.querySelector("[data-navbar]");
const navbarLinks = document.querySelectorAll("[data-nav-link]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
}

addEventOnElem(navTogglers, "click", toggleNavbar);

const closeNavbar = function () {
  navbar.classList.remove("active");
  overlay.classList.remove("active");
}

addEventOnElem(navbarLinks, "click", closeNavbar);



/**
 * анимация скрытия и появления шапки при скролле вниз и вверх + кнопка обратно наверх
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

const headerActive = function () {
  if (window.scrollY > 150) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
}

addEventOnElem(window, "scroll", headerActive);

let lastScrolledPos = 0;

const headerSticky = function () {
  if (lastScrolledPos >= window.scrollY) {
    header.classList.remove("header-hide");
  } else {
    header.classList.add("header-hide");
  }

  lastScrolledPos = window.scrollY;
}

addEventOnElem(window, "scroll", headerSticky);



/**
 * анимация плавного появления при скролле
 */

const sections = document.querySelectorAll("[data-section]");

const scrollReveal = function () {
  for (let i = 0; i < sections.length; i++) {
    if (sections[i].getBoundingClientRect().top < window.innerHeight / 2) {
      sections[i].classList.add("active");
    }
  }
}

scrollReveal();

addEventOnElem(window, "scroll", scrollReveal);

/**
 * анимация отсчета в offer
 */

const countdown = document.querySelector("[data-countdown]");

const offerEndDate = new Date("October 31, 2025 23:59:59").getTime();

const daysElem = countdown.querySelector(".days");
const hoursElem = countdown.querySelector(".hours");
const minutesElem = countdown.querySelector(".minutes");
const secondsElem = countdown.querySelector(".seconds");

const timer = setInterval(function () {
  const now = new Date().getTime();
  const distance = offerEndDate - now;

  if (distance <= 0) {
    clearInterval(timer);
    countdown.innerHTML = "<p>Offer Expired</p>";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  daysElem.textContent = String(days).padStart(2, "0");
  hoursElem.textContent = String(hours).padStart(2, "0");
  minutesElem.textContent = String(minutes).padStart(2, "0");
  secondsElem.textContent = String(seconds).padStart(2, "0");
}, 1000);

/**
 * анимация печатной машинки в hero-text
 */

const heroText = document.querySelector(".hero-text");

const text = heroText.textContent;
heroText.textContent = "";

let index = 0; // индекс текущей буквы
const speed = 50; // скорость печати (мс)

const cursor = document.createElement("span");
cursor.textContent = "|";
cursor.style.marginLeft = "3px";
cursor.style.color = "#111";
cursor.style.animation = "blink 0.7s infinite";
heroText.appendChild(cursor);

function typeWriter() {
  if (index < text.length) {
    heroText.insertBefore(document.createTextNode(text.charAt(index)), cursor);
    index++;
    setTimeout(typeWriter, speed);
  } else {
    cursor.style.color = "#888";
  }
}

setTimeout(typeWriter, 700);

// css анимация для курсора
const style = document.createElement("style");
style.textContent = `
@keyframes blink {
  0%, 50%, 100% { opacity: 1; }
  25%, 75% { opacity: 0; }
}`;
document.head.appendChild(style);

/**
 * анимация пробежки от 0 до 25 в discount
 */

const discountElem = document.querySelector("[data-discount]");


// функция анимации числа
function animateNumber(element, target, duration) {
  let start = 0;
  const stepTime = 16; // 60 фпс
  const totalSteps = duration / stepTime;
  const increment = target / totalSteps;
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    element.textContent = Math.floor(current);
  }, stepTime);
}

// наблюдатель
const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const targetValue = Number(entry.target.textContent);
      entry.target.textContent = "0";
      animateNumber(entry.target, targetValue, 1200);
      observer.unobserve(entry.target); // отключение после 1 раза
    }
  });
}, {
  threshold: 1 // сработает, когда элемент виден
});

observer.observe(discountElem);

/**
 * слайдер с кнопками в hero
 */

const heroSlider = document.querySelector(".hero .has-scrollbar");
const prevBtn = document.querySelector(".slider-btn.prev");
const nextBtn = document.querySelector(".slider-btn.next");

let scrollStep = heroSlider ? heroSlider.clientWidth : 0;

// апдейт шага прокрутки при ресайзе
let scrollStepUpdate = function () {
  scrollStep = heroSlider.clientWidth;
}
addEventOnElem(window, "resize", scrollStepUpdate);


let scrollLeft = function () {
    heroSlider.scrollBy({
      left: scrollStep,
      behavior: "smooth"
    })
  }

let scrollRight = function () {
    heroSlider.scrollBy({
      left: -scrollStep,
      behavior: "smooth"
    })
  }


addEventOnElem(nextBtn, "click", scrollLeft);
addEventOnElem(prevBtn, "click", scrollRight);

/**
 * динамический прогресс бар
 */

const progressBar = document.getElementById("scroll-progress");

const updateProgressBar = function () {
  const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
  const currentHeight = window.scrollY;
  const scrollPercent = (currentHeight / maxHeight) * 100;
  progressBar.style.width = scrollPercent + "%";
};

addEventOnElem(window, "scroll", updateProgressBar);
addEventOnElem(window, "resize", updateProgressBar);
addEventOnElem(window, "load", updateProgressBar);
