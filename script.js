
// Navigation


(() => {
  const here = location.pathname.replace(/\/$/, "");
  document.querySelectorAll("nav a").forEach(a => {
    const path = new URL(a.href).pathname.replace(/\/$/, "");
    if (path === here) a.classList.add("active");
  });
})();


(() => {
  const navbar = document.querySelector("nav");
  if (!navbar) return;
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("sticky", window.scrollY > 50);
  });
})();




// Tabs #spa-showcase

(() => {
  const sc = document.getElementById("spa-showcase");
  if (!sc) return;

  const tabs = Array.from(sc.querySelectorAll(".tab"));
  const panels = Array.from(sc.querySelectorAll(".panel"));

  function activate(i) {
    tabs.forEach((t, idx) => {
      const on = idx === i;
      t.classList.toggle("active", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
      panels[idx].classList.toggle("active", on);
      panels[idx].toggleAttribute("hidden", !on);
    });
  }

  tabs.forEach((t, i) => {
    t.addEventListener("click", () => activate(i));
    t.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        tabs[(i + 1) % tabs.length].focus();
        activate((i + 1) % tabs.length);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        tabs[(i - 1 + tabs.length) % tabs.length].focus();
        activate((i - 1 + tabs.length) % tabs.length);
      }
    });
  });

  
  const initial = tabs.findIndex(t => t.classList.contains("active"));
  activate(initial >= 0 ? initial : 0);
})();


// Service Carousel

(() => {
  const carousels = document.querySelectorAll('.services .carousel');
  if (!carousels.length) return;

  const INTERVAL = 3000; 

  carousels.forEach(initCarousel);

  function initCarousel(carousel) {
    const track = carousel.querySelector('.slides');
    const slides = Array.from(track?.children || []);
    const prevBtn = carousel.querySelector('.prev');
    const nextBtn = carousel.querySelector('.next');
    const dotsWrap = carousel.querySelector('.dots');

    if (!track || !slides.length || !dotsWrap) return;

    let index = 0;
    let timer = null;

    // point
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.setAttribute('type', 'button');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });

    function update() {
      track.style.transform = `translateX(-${index * 100}%)`;
      [...dotsWrap.children].forEach((d, i) => d.classList.toggle('active', i === index));
    }

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      update();
    }

    function start() {
      stop();
      timer = setInterval(() => goTo(index + 1), INTERVAL);
    }

    function stop() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    prevBtn?.addEventListener('click', () => goTo(index - 1));
    nextBtn?.addEventListener('click', () => goTo(index + 1));

   
    track.addEventListener('click', (e) => {
      const t = e.target;
      if (t && t.tagName === 'IMG') {
        const link = carousel.dataset.link;
        if (link) location.href = link;
      }
    });

    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);

    update();
    start();
  }
})();


// Appointment form  localStorage

(() => {
  const form = document.querySelector('.appointment-form');
  if (!form) return;

  window.addEventListener('DOMContentLoaded', () => {
    let saved = {};
    try {
      saved = JSON.parse(localStorage.getItem('appointmentData')) || {};
    } catch (_) { }

    for (const key in saved) {
      const field = form.elements[key];
      if (field) field.value = saved[key];
    }
  });

  form.addEventListener('input', () => {
    const data = {};
    for (let i = 0; i < form.elements.length; i++) {
      const el = form.elements[i];
      if (el.name) data[el.name] = el.value;
    }
    localStorage.setItem('appointmentData', JSON.stringify(data));
  });

  form.addEventListener('submit', () => {
    localStorage.removeItem('appointmentData');
  });
})();


// Weather 

(() => {
  async function loadWeather() {
    const box = document.getElementById("weather-box");
    if (!box) return;

    try {
      const url = "https://api.open-meteo.com/v1/forecast"
                + "?latitude=43.6532&longitude=-79.3832"
                + "&current=temperature_2m"
                + "&timezone=America%2FToronto";

      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const temp = data?.current?.temperature_2m;
      box.textContent = (typeof temp === "number")
        ? `Toronto: ${temp}°C`
        : "Weather unavailable.";
    } catch (err) {
      console.error(err);
      box.textContent = "Weather unavailable.";
    }
  }

  window.addEventListener("DOMContentLoaded", loadWeather);
})();
