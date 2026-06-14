import { saveHistoricalData } from './history.js';

/**
 * AETHERIS Weather Intelligence Dashboard Core Logic
 * Handles interactive charts, live maps, canvas rain overlays, speech recognition, and theme toggling.
 */

// --- WEATHER CONFIG & PRESETS ---
const WEATHER_PRESETS = {
  tokyo: {
    city: "Tokyo",
    country: "JP",
    temp: 19,
    feelsLike: 18,
    tempHigh: 22,
    tempLow: 16,
    condition: "Thunderstorm",
    conditionDesc: "Severe Thunderstorm Warning",
    humidity: 88,
    windSpeed: 28,
    pressure: 1008,
    uvIndex: 2,
    uvLabel: "Low",
    visibility: 6.5,
    visibilityDesc: "Rain haze",
    sunset: "18:48",
    aqi: 28,
    aqiLabel: "Good",
    precip24h: 32.4,
    coords: [35.6762, 139.6503],
    forecast: [
      { day: "Fri", icon: "fa-cloud-bolt", desc: "Stormy", rain: 95, hi: 22, lo: 16 },
      { day: "Sat", icon: "fa-cloud-showers-heavy", desc: "Heavy Rain", rain: 80, hi: 20, lo: 15 },
      { day: "Sun", icon: "fa-cloud-sun", desc: "Showers", rain: 40, hi: 21, lo: 14 },
      { day: "Mon", icon: "fa-cloud", desc: "Cloudy", rain: 20, hi: 23, lo: 16 },
      { day: "Tue", icon: "fa-sun", desc: "Sunny", rain: 0, hi: 25, lo: 17 },
      { day: "Wed", icon: "fa-sun", desc: "Sunny", rain: 0, hi: 26, lo: 18 },
      { day: "Thu", icon: "fa-cloud-sun", desc: "Partly Cloudy", rain: 10, hi: 24, lo: 17 }
    ],
    aiTitle: "Severe Storm Convective System",
    aiDesc: "Extreme lightning frequency and localized water accumulation expected within the metropolitan sector.",
    aiInsight: "An incoming cold front has collided with tropical maritime moisture, causing unstable convective updrafts. This cell is moving northeast at 25 km/h, which will yield high rainfall intensity over Tokyo Bay.",
    aiRecs: ["Secure loose outdoor items immediately.", "High flash flood warning in low elevation subway sectors."]
  },
  london: {
    city: "London",
    country: "UK",
    temp: 12,
    feelsLike: 10,
    tempHigh: 14,
    tempLow: 8,
    condition: "Rainy",
    conditionDesc: "Continuous Light Rain",
    humidity: 92,
    windSpeed: 16,
    pressure: 1012,
    uvIndex: 1,
    uvLabel: "Low",
    visibility: 8.0,
    visibilityDesc: "Light fog",
    sunset: "20:58",
    aqi: 18,
    aqiLabel: "Excellent",
    precip24h: 12.8,
    coords: [51.5074, -0.1278],
    forecast: [
      { day: "Fri", icon: "fa-cloud-showers-heavy", desc: "Drizzle", rain: 85, hi: 14, lo: 8 },
      { day: "Sat", icon: "fa-cloud", desc: "Overcast", rain: 30, hi: 15, lo: 9 },
      { day: "Sun", icon: "fa-cloud-sun", desc: "Cloudy Intervals", rain: 15, hi: 16, lo: 10 },
      { day: "Mon", icon: "fa-cloud-showers-heavy", desc: "Showers", rain: 60, hi: 14, lo: 8 },
      { day: "Tue", icon: "fa-cloud", desc: "Cloudy", rain: 20, hi: 15, lo: 9 },
      { day: "Wed", icon: "fa-cloud-sun", desc: "Passing Clouds", rain: 10, hi: 17, lo: 11 },
      { day: "Thu", icon: "fa-sun", desc: "Clear", rain: 5, hi: 19, lo: 12 }
    ],
    aiTitle: "Low-Pressure System West Europe",
    aiDesc: "Steady stratiform rain bands are passing over the Thames basin, keeping humidity above 90%.",
    aiInsight: "A stable Atlantic depression is lingering over North Sea margins. The resulting maritime airmass maintains low thermal variance, producing perpetual light drizzle with minimal cloud-to-ground lightning hazards.",
    aiRecs: ["Waterproof coats advised for outdoor transit.", "Visibility drops to 5km under thicker drizzle bands."]
  },
  newyork: {
    city: "New York",
    country: "US",
    temp: 16,
    feelsLike: 15,
    tempHigh: 18,
    tempLow: 12,
    condition: "Overcast",
    conditionDesc: "Dense Cloud Layer",
    humidity: 74,
    windSpeed: 22,
    pressure: 1015,
    uvIndex: 3,
    uvLabel: "Mod",
    visibility: 11.2,
    visibilityDesc: "Clear",
    sunset: "20:12",
    aqi: 45,
    aqiLabel: "Good",
    precip24h: 1.2,
    coords: [40.7128, -74.0060],
    forecast: [
      { day: "Fri", icon: "fa-cloud", desc: "Overcast", rain: 15, hi: 18, lo: 12 },
      { day: "Sat", icon: "fa-cloud-sun", desc: "Partly Sunny", rain: 5, hi: 20, lo: 13 },
      { day: "Sun", icon: "fa-sun", desc: "Clear Skies", rain: 0, hi: 22, lo: 15 },
      { day: "Mon", icon: "fa-sun", desc: "Sunny", rain: 0, hi: 24, lo: 16 },
      { day: "Tue", icon: "fa-cloud-sun", desc: "Increasing Clouds", rain: 10, hi: 21, lo: 14 },
      { day: "Wed", icon: "fa-cloud-bolt", desc: "Late Storm", rain: 75, hi: 19, lo: 12 },
      { day: "Thu", icon: "fa-cloud-showers-heavy", desc: "Morning Rain", rain: 60, hi: 17, lo: 11 }
    ],
    aiTitle: "Stable Convective Buffer",
    aiDesc: "Barometric pressure remains elevated, preventing rain formation despite high cloud cover.",
    aiInsight: "Sub-tropical winds are keeping storm currents to the south. Moderate onshore breezes are cooling coastal zones, resulting in low condensation altitudes and a uniform stratus layer.",
    aiRecs: ["No rain apparel required for the day.", "Perfect ambient temp for outdoor carbon-offset runs."]
  },
  sydney: {
    city: "Sydney",
    country: "AU",
    temp: 24,
    feelsLike: 25,
    tempHigh: 27,
    tempLow: 19,
    condition: "Sunny",
    conditionDesc: "Optimal Sky Conditions",
    humidity: 48,
    windSpeed: 12,
    pressure: 1022,
    uvIndex: 8,
    uvLabel: "Very High",
    visibility: 16.0,
    visibilityDesc: "Excellent",
    sunset: "17:02",
    aqi: 14,
    aqiLabel: "Excellent",
    precip24h: 0.0,
    coords: [-33.8688, 151.2093],
    forecast: [
      { day: "Fri", icon: "fa-sun", desc: "Sunny", rain: 0, hi: 27, lo: 19 },
      { day: "Sat", icon: "fa-sun", desc: "Sunny", rain: 0, hi: 28, lo: 20 },
      { day: "Sun", icon: "fa-cloud-sun", desc: "Few Clouds", rain: 5, hi: 26, lo: 18 },
      { day: "Mon", icon: "fa-cloud", desc: "Cloudy", rain: 15, hi: 23, lo: 17 },
      { day: "Tue", icon: "fa-cloud-showers-heavy", desc: "Light Shower", rain: 45, hi: 22, lo: 16 },
      { day: "Wed", icon: "fa-sun", desc: "Sunny", rain: 0, hi: 25, lo: 18 },
      { day: "Thu", icon: "fa-sun", desc: "Sunny", rain: 0, hi: 26, lo: 19 }
    ],
    aiTitle: "High Pressure System Active",
    aiDesc: "Intense solar radiation warnings. UV Index spikes to 8 between 11:00 and 15:00.",
    aiInsight: "An anti-cyclonic weather ridge is locking in warm dry air across New South Wales. Lack of low-level moisture prevents any significant condensation cells, leading to severe cloudless transparency.",
    aiRecs: ["Apply SPF 50+ sunscreen if outdoors.", "Hydrate frequently; dry wind increases body moisture loss."]
  },
  sahara: {
    city: "Sahara Desert",
    country: "DZ",
    temp: 41,
    feelsLike: 43,
    tempHigh: 45,
    tempLow: 32,
    condition: "Sunny",
    conditionDesc: "Sandstorm Advisory",
    humidity: 8,
    windSpeed: 42,
    pressure: 1004,
    uvIndex: 11,
    uvLabel: "Extreme",
    visibility: 3.2,
    visibilityDesc: "Dust clouds",
    sunset: "19:35",
    aqi: 120,
    aqiLabel: "Unhealthy",
    precip24h: 0.0,
    coords: [24.8028, 11.3056],
    forecast: [
      { day: "Fri", icon: "fa-sun", desc: "Sandstorm", rain: 0, hi: 45, lo: 32 },
      { day: "Sat", icon: "fa-sun", desc: "Extreme Heat", rain: 0, hi: 46, lo: 33 },
      { day: "Sun", icon: "fa-sun", desc: "Extreme Heat", rain: 0, hi: 44, lo: 31 },
      { day: "Mon", icon: "fa-sun", desc: "Clear", rain: 0, hi: 42, lo: 29 },
      { day: "Tue", icon: "fa-sun", desc: "Clear", rain: 0, hi: 41, lo: 28 },
      { day: "Wed", icon: "fa-sun", desc: "Clear", rain: 0, hi: 43, lo: 30 },
      { day: "Thu", icon: "fa-cloud-sun", desc: "Dry Clouds", rain: 2, hi: 40, lo: 27 }
    ],
    aiTitle: "Thermal Depression & Sirocco",
    aiDesc: "Extreme desert heat coupled with suspended atmospheric dust and sand microparticles.",
    aiInsight: "A deep thermal low-pressure zone is drawing hot desert air northward, producing high-velocity Sirocco gusts. Suspended dust loads reduce visibility dramatically and increase respiratory load.",
    aiRecs: ["Wear protective respirator masks if outdoors.", "Zero open travel outside climate-controlled hubs."]
  },
  nagpur: {
    city: "Nagpur",
    country: "IN",
    temp: 34,
    feelsLike: 37,
    tempHigh: 39,
    tempLow: 28,
    condition: "Sunny",
    conditionDesc: "High Temperature Advisory",
    humidity: 45,
    windSpeed: 14,
    pressure: 1008,
    uvIndex: 9,
    uvLabel: "Very High",
    visibility: 8.0,
    visibilityDesc: "Clear",
    sunset: "18:50",
    aqi: 58,
    aqiLabel: "Moderate",
    precip24h: 0.0,
    coords: [21.1458, 79.0882],
    forecast: [
      { day: "Fri", icon: "fa-sun", desc: "Sunny", rain: 0, hi: 39, lo: 28 },
      { day: "Sat", icon: "fa-sun", desc: "Sunny", rain: 5, hi: 40, lo: 29 },
      { day: "Sun", icon: "fa-cloud-sun", desc: "Few Clouds", rain: 10, hi: 38, lo: 27 },
      { day: "Mon", icon: "fa-cloud-sun", desc: "Partly Cloudy", rain: 15, hi: 37, lo: 26 },
      { day: "Tue", icon: "fa-cloud-showers-heavy", desc: "Passing Showers", rain: 45, hi: 35, lo: 25 },
      { day: "Wed", icon: "fa-sun", desc: "Sunny", rain: 0, hi: 38, lo: 27 },
      { day: "Thu", icon: "fa-sun", desc: "Sunny", rain: 0, hi: 39, lo: 28 }
    ],
    aiTitle: "Elevated Thermal Index",
    aiDesc: "Nagpur region experiencing high solar radiation. UV Index spikes to 9.",
    aiInsight: "Subcontinental dry continental air flows are keeping humidity low and temperatures high over Maharashtra. No convective rain patterns active.",
    aiRecs: ["Minimize direct solar exposure between 12:00 and 15:00.", "Ensure hydration levels are maintained."]
  }
};

// --- APPLICATION STATE ---
let currentTheme = "dark";
let currentUnit = "C"; // "C" or "F"
let activePreset = WEATHER_PRESETS.tokyo;
let activeChartType = "rain"; // "rain" or "temp"
let chartInstance = null;
let leafletMap = null;
let radarOverlayCircle = null;

// --- CANVAS RAIN BACKGROUND ANIMATION ---
const canvas = document.getElementById("weather-canvas");
const ctx = canvas.getContext("2d");
let animationFrameId = null;
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

class WeatherParticle {
  constructor(type) {
    this.type = type;
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * -100 - 10;
    this.size = Math.random() * 2 + 1;
    this.speedY = 0;
    this.speedX = 0;
    this.opacity = Math.random() * 0.4 + 0.2;

    if (this.type === "Thunderstorm") {
      this.speedY = Math.random() * 12 + 12;
      this.speedX = Math.random() * -3 - 2; // wind slant
      this.size = Math.random() * 1.5 + 1.5;
    } else if (this.type === "Rainy") {
      this.speedY = Math.random() * 6 + 6;
      this.speedX = Math.random() * -2 - 0.5;
    } else if (this.type === "Overcast") {
      // clouds drift slowly
      this.y = Math.random() * (canvas.height * 0.5);
      this.speedX = Math.random() * 0.3 + 0.1;
      this.speedY = 0;
      this.size = Math.random() * 80 + 40;
      this.opacity = Math.random() * 0.05 + 0.02;
    } else if (this.type === "Sunny") {
      // glowing warm motes floating around
      this.y = Math.random() * canvas.height;
      this.speedY = -(Math.random() * 0.5 + 0.2);
      this.speedX = (Math.random() * 0.6 - 0.3);
      this.size = Math.random() * 4 + 1;
      this.opacity = Math.random() * 0.3 + 0.1;
    }
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.type === "Overcast") {
      if (this.x - this.size > canvas.width) {
        this.x = -this.size;
      }
    } else if (this.type === "Sunny") {
      if (this.y < -this.size || this.x < -this.size || this.x > canvas.width + this.size) {
        this.reset();
        this.y = canvas.height + 10;
      }
    } else {
      if (this.y > canvas.height || this.x < -10 || this.x > canvas.width + 10) {
        this.reset();
      }
    }
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    
    if (this.type === "Thunderstorm" || this.type === "Rainy") {
      const themeColor = currentTheme === "dark" ? "rgba(0, 242, 254, 0.8)" : "rgba(59, 130, 246, 0.8)";
      ctx.strokeStyle = themeColor;
      ctx.lineWidth = this.size;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x + this.speedX * 1.5, this.y + this.speedY * 1.5);
      ctx.stroke();
    } else if (this.type === "Overcast") {
      const themeColor = currentTheme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(15, 23, 42, 0.05)";
      ctx.fillStyle = themeColor;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === "Sunny") {
      const themeColor = currentTheme === "dark" ? "rgba(255, 210, 0, 0.7)" : "rgba(234, 179, 8, 0.6)";
      ctx.fillStyle = themeColor;
      ctx.shadowBlur = 10;
      ctx.shadowColor = themeColor;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  }
}

function initWeatherBackground(condition) {
  particles = [];
  let particleCount = 60;
  if (condition === "Thunderstorm") particleCount = 140;
  else if (condition === "Rainy") particleCount = 100;
  else if (condition === "Overcast") particleCount = 15;
  else if (condition === "Sunny") particleCount = 30;

  for (let i = 0; i < particleCount; i++) {
    const p = new WeatherParticle(condition);
    if (condition === "Sunny" || condition === "Overcast") {
      // distribute them across screen instantly
      p.x = Math.random() * canvas.width;
      p.y = Math.random() * canvas.height;
    }
    particles.push(p);
  }
}

let lightningChance = 0.003;
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Trigger random thunderstorm lightning overlays
  if (activePreset.condition === "Thunderstorm" && Math.random() < lightningChance) {
    ctx.save();
    ctx.fillStyle = currentTheme === "dark" ? "rgba(100, 200, 255, 0.18)" : "rgba(255, 255, 255, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    if (Math.random() < 0.2) {
      showToastAlert("LIGHTNING DETECTED", "Convective cell lightning strike recorded in metropolitan airspace.", "warning");
    }
  }

  particles.forEach(p => {
    p.update();
    p.draw();
  });

  animationFrameId = requestAnimationFrame(animate);
}

// --- DYNAMIC VECTOR SVG ICON GENERATION ---
const WeatherIcons = {
  Thunderstorm: `
    <svg class="weather-icon-svg" viewBox="0 0 100 100">
      <defs>
        <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4b5563"/>
          <stop offset="100%" stop-color="#111827"/>
        </linearGradient>
        <linearGradient id="boltGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ffd200"/>
          <stop offset="100%" stop-color="#ff7f00"/>
        </linearGradient>
      </defs>
      <!-- Clouds -->
      <path d="M25,55 C25,43 35,35 45,35 C48,35 51,36 54,38 C58,30 68,26 76,32 C84,38 85,48 80,55 C86,55 92,60 92,68 C92,76 85,82 76,82 L28,82 C20,82 14,76 14,68 C14,60 20,55 25,55 Z" fill="url(#cloudGrad)"/>
      <path d="M15,45 C15,35 23,28 32,28 C34,28 37,29 39,30 C43,22 52,18 60,24 C67,29 68,38 64,45 C70,45 75,50 75,57 C75,64 69,69 61,69 L18,69 C11,69 5,63 5,55 C5,47 11,45 15,45 Z" fill="#374151" opacity="0.8"/>
      <!-- Lightning Bolt -->
      <polygon points="48,58 35,76 46,76 38,98 62,72 50,72 56,58" fill="url(#boltGrad)">
        <animate attributeName="opacity" values="1; 0.2; 1; 0.9; 0.3; 1" dur="2.5s" repeatCount="indefinite" />
      </polygon>
    </svg>
  `,
  Rainy: `
    <svg class="weather-icon-svg" viewBox="0 0 100 100">
      <defs>
        <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4facfe"/>
          <stop offset="100%" stop-color="#00f2fe"/>
        </linearGradient>
      </defs>
      <!-- Cloud -->
      <path d="M25,50 C25,38 35,30 45,30 C48,30 51,31 54,33 C58,25 68,21 76,27 C84,33 85,43 80,50 C86,50 92,55 92,63 C92,71 85,77 76,77 L28,77 C20,77 14,71 14,63 C14,55 20,50 25,50 Z" fill="#2b3b5c"/>
      <!-- Animated Rain Streaks -->
      <line x1="30" y1="80" x2="26" y2="92" stroke="#00f2fe" stroke-width="2" stroke-linecap="round">
        <animate attributeName="y1" values="80; 84; 80" dur="1s" repeatCount="indefinite"/>
        <animate attributeName="y2" values="92; 96; 92" dur="1s" repeatCount="indefinite"/>
      </line>
      <line x1="45" y1="80" x2="41" y2="92" stroke="#00f2fe" stroke-width="2" stroke-linecap="round">
        <animate attributeName="y1" values="82; 78; 82" dur="1.2s" repeatCount="indefinite"/>
        <animate attributeName="y2" values="94; 90; 94" dur="1.2s" repeatCount="indefinite"/>
      </line>
      <line x1="60" y1="80" x2="56" y2="92" stroke="#00f2fe" stroke-width="2" stroke-linecap="round">
        <animate attributeName="y1" values="78; 83; 78" dur="0.9s" repeatCount="indefinite"/>
        <animate attributeName="y2" values="90; 95; 90" dur="0.9s" repeatCount="indefinite"/>
      </line>
      <line x1="75" y1="80" x2="71" y2="92" stroke="#00f2fe" stroke-width="2" stroke-linecap="round">
        <animate attributeName="y1" values="84; 79; 84" dur="1.1s" repeatCount="indefinite"/>
        <animate attributeName="y2" values="96; 91; 96" dur="1.1s" repeatCount="indefinite"/>
      </line>
    </svg>
  `,
  Overcast: `
    <svg class="weather-icon-svg" viewBox="0 0 100 100">
      <defs>
        <linearGradient id="cloudLight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#94a3b8"/>
          <stop offset="100%" stop-color="#475569"/>
        </linearGradient>
      </defs>
      <!-- Back Cloud -->
      <path d="M20,45 C20,35 28,28 37,28 C40,28 42,29 45,30 C49,22 57,18 64,24 C71,29 72,38 68,45 C74,45 80,50 80,57 C80,64 74,69 66,69 L24,69 C16,69 10,63 10,55 C10,47 16,45 20,45 Z" fill="#334155" opacity="0.6"/>
      <!-- Front Cloud -->
      <path d="M35,60 C35,48 45,40 55,40 C58,40 61,41 64,43 C68,35 78,31 86,37 C94,43 95,53 90,60 C96,60 102,65 102,73 C102,81 95,87 86,87 L38,87 C30,87 24,81 24,73 C24,65 30,60 35,60 Z" fill="url(#cloudLight)"/>
    </svg>
  `,
  Sunny: `
    <svg class="weather-icon-svg" viewBox="0 0 100 100">
      <defs>
        <linearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffea00"/>
          <stop offset="100%" stop-color="#ff5f00"/>
        </linearGradient>
      </defs>
      <!-- Sun Core -->
      <circle cx="50" cy="50" r="22" fill="url(#sunGrad)">
        <animate attributeName="r" values="22; 24; 22" dur="4s" repeatCount="indefinite"/>
      </circle>
      <!-- Sun Rays -->
      <g stroke="url(#sunGrad)" stroke-width="4" stroke-linecap="round">
        <line x1="50" y1="12" x2="50" y2="22"/>
        <line x1="50" y1="78" x2="50" y2="88"/>
        <line x1="12" y1="50" x2="22" y2="50"/>
        <line x1="78" y1="50" x2="88" y2="50"/>
        <line x1="23" y1="23" x2="30" y2="30"/>
        <line x1="70" y1="70" x2="77" y2="77"/>
        <line x1="77" y1="23" x2="70" y2="30"/>
        <line x1="30" y1="70" x2="23" y2="77"/>
        <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="20s" repeatCount="indefinite" />
      </g>
    </svg>
  `
};

function updateWeatherIcon(condition) {
  const container = document.getElementById("weather-icon-container");
  if (WeatherIcons[condition]) {
    container.innerHTML = WeatherIcons[condition];
  } else {
    // default to Sunny if not found
    container.innerHTML = WeatherIcons.Sunny;
  }
}

// --- DYNAMIC CLOCK & TIMESTAMPS ---
function updateClock() {
  const optionsDate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const d = new Date();
  
  const dateStr = d.toLocaleDateString('en-US', optionsDate).toUpperCase();
  const timeStr = d.toLocaleTimeString('en-US', { hour12: false }) + " LOCAL";

  document.getElementById("clock-date").innerText = dateStr;
  document.getElementById("clock-time").innerText = timeStr;
}
setInterval(updateClock, 1000);
updateClock();

// --- INTERACTIVE CHART.JS INTEGRATION ---
function initTrendsChart() {
  const trendCanvas = document.getElementById("weather-trends-chart");
  const chartCtx = trendCanvas.getContext("2d");

  // Create neon gradients
  const rainGradient = chartCtx.createLinearGradient(0, 0, 0, 240);
  rainGradient.addColorStop(0, 'rgba(0, 242, 254, 0.45)');
  rainGradient.addColorStop(0.5, 'rgba(0, 242, 254, 0.15)');
  rainGradient.addColorStop(1, 'rgba(0, 242, 254, 0)');

  const tempGradient = chartCtx.createLinearGradient(0, 0, 0, 240);
  tempGradient.addColorStop(0, 'rgba(127, 0, 255, 0.45)');
  tempGradient.addColorStop(0.5, 'rgba(127, 0, 255, 0.15)');
  tempGradient.addColorStop(1, 'rgba(127, 0, 255, 0)');

  // Hourly ticks from API or default fallback
  const labels = activePreset.hourlyLabels || ["02:00", "05:00", "08:00", "11:00", "14:00", "17:00", "20:00", "23:00"];
  
  // Data vectors mapped to active weather condition
  const datasetConfig = {
    rain: {
      label: "Rain Probability (%)",
      data: activePreset.hourlyRain || (activePreset.condition === "Sunny" ? [0, 0, 0, 5, 0, 0, 0, 0] : 
            activePreset.condition === "Thunderstorm" ? [85, 95, 90, 80, 60, 45, 30, 20] : 
            activePreset.condition === "Rainy" ? [40, 55, 70, 85, 80, 75, 60, 40] : [10, 15, 20, 15, 10, 5, 10, 15]),
      borderColor: "#00f2fe",
      backgroundColor: rainGradient,
      borderWidth: 2,
      fill: true,
      tension: 0.4
    },
    temp: {
      label: `Temperature (°${currentUnit})`,
      data: activePreset.hourlyTemp ? activePreset.hourlyTemp.map(t => currentUnit === "F" ? Math.round((t * 9/5) + 32) : t) : getHourlyTempData(),
      borderColor: "#7f00ff",
      backgroundColor: tempGradient,
      borderWidth: 2,
      fill: true,
      tension: 0.4
    }
  };

  const selectedData = datasetConfig[activeChartType];

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(chartCtx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [selectedData]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          labels: {
            color: currentTheme === "dark" ? "#8a9cae" : "#475569",
            font: { family: "Space Grotesk", size: 11 }
          }
        },
        tooltip: {
          backgroundColor: currentTheme === "dark" ? "rgba(10, 20, 38, 0.95)" : "rgba(255, 255, 255, 0.95)",
          titleColor: currentTheme === "dark" ? "#fff" : "#0f172a",
          bodyColor: currentTheme === "dark" ? "#00f2fe" : "#3b82f6",
          borderColor: currentTheme === "dark" ? "rgba(0, 242, 254, 0.2)" : "rgba(99, 102, 241, 0.2)",
          borderWidth: 1,
          padding: 12,
          displayColors: false,
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${context.parsed.y}${activeChartType === 'temp' ? '°' : '%'}`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            color: currentTheme === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
            borderColor: "transparent"
          },
          ticks: {
            color: currentTheme === "dark" ? "#53667a" : "#94a3b8",
            font: { family: "Inter", size: 10 }
          }
        },
        y: {
          grid: {
            color: currentTheme === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
            borderColor: "transparent"
          },
          ticks: {
            color: currentTheme === "dark" ? "#53667a" : "#94a3b8",
            font: { family: "Inter", size: 10 }
          },
          max: activeChartType === "rain" ? 100 : undefined
        }
      }
    }
  });
}

function getHourlyTempData() {
  const baseTemp = activePreset.temp;
  const offsets = [-4, -3, 0, 3, 5, 2, -1, -3];
  return offsets.map(offset => {
    let t = baseTemp + offset;
    return currentUnit === "F" ? Math.round((t * 9/5) + 32) : t;
  });
}

// Chart selectors
document.getElementById("chart-btn-rain").addEventListener("click", (e) => {
  document.getElementById("chart-btn-temp").classList.remove("active");
  e.target.classList.add("active");
  activeChartType = "rain";
  initTrendsChart();
});

document.getElementById("chart-btn-temp").addEventListener("click", (e) => {
  document.getElementById("chart-btn-rain").classList.remove("active");
  e.target.classList.add("active");
  activeChartType = "temp";
  initTrendsChart();
});


// --- LEAFLET WEATHER RADAR MAP SETUP ---
function initRadarMap() {
  const mapContainer = document.getElementById("leaflet-map-node");
  
  // Clear map container if it already exists
  if (leafletMap) {
    leafletMap.remove();
    leafletMap = null;
  }

  // Choose tiled map style depending on Theme Mode
  const tileURL = currentTheme === "dark"
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

  leafletMap = L.map('leaflet-map-node', {
    zoomControl: false,
    attributionControl: false
  }).setView(activePreset.coords, 10);

  L.tileLayer(tileURL, {
    maxZoom: 19
  }).addTo(leafletMap);

  // Add radar overlay sweep markers/pulse bounds
  if (activePreset.condition === "Thunderstorm" || activePreset.condition === "Rainy") {
    // Add pulsing radar circle simulation
    radarOverlayCircle = L.circle(activePreset.coords, {
      color: currentTheme === "dark" ? '#00f2fe' : '#3b82f6',
      fillColor: currentTheme === "dark" ? '#00f2fe' : '#3b82f6',
      fillOpacity: 0.12,
      radius: 12000
    }).addTo(leafletMap);
    
    // Simulate drifting rain cloud sweeps
    let angle = 0;
    setInterval(() => {
      if (radarOverlayCircle && leafletMap) {
        angle += 0.02;
        let deltaLat = Math.sin(angle) * 0.005;
        let deltaLng = Math.cos(angle) * 0.005;
        let newCoords = [activePreset.coords[0] + deltaLat, activePreset.coords[1] + deltaLng];
        radarOverlayCircle.setLatLng(newCoords);
      }
    }, 150);
  }

  // Append customized interactive radar front markers
  const markerIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="width: 14px; height: 14px; background: ${activePreset.condition === "Thunderstorm" ? '#ff007f' : '#00f2fe'}; border-radius: 50%; box-shadow: 0 0 10px ${activePreset.condition === "Thunderstorm" ? '#ff007f' : '#00f2fe'};"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  });

  L.marker(activePreset.coords, { icon: markerIcon }).addTo(leafletMap)
    .bindPopup(`<b>Station Aetheris-${activePreset.country}</b><br>Radar sweep centered.`, {
      closeButton: false,
      className: 'custom-leaflet-popup'
    });
}


// --- WEATHER HELPERS & DYNAMIC AI INSIGHTS ---

function getWmoDetails(code) {
  const wmoMap = {
    0: { desc: "Clear sky", icon: "fa-sun", condition: "Sunny" },
    1: { desc: "Mainly clear", icon: "fa-cloud-sun", condition: "Sunny" },
    2: { desc: "Partly cloudy", icon: "fa-cloud-sun", condition: "Overcast" },
    3: { desc: "Overcast", icon: "fa-cloud", condition: "Overcast" },
    45: { desc: "Foggy", icon: "fa-smog", condition: "Overcast" },
    48: { desc: "Depositing rime fog", icon: "fa-smog", condition: "Overcast" },
    51: { desc: "Light drizzle", icon: "fa-cloud-rain", condition: "Rainy" },
    53: { desc: "Moderate drizzle", icon: "fa-cloud-rain", condition: "Rainy" },
    55: { desc: "Dense drizzle", icon: "fa-cloud-rain", condition: "Rainy" },
    56: { desc: "Light freezing drizzle", icon: "fa-cloud-rain", condition: "Rainy" },
    57: { desc: "Dense freezing drizzle", icon: "fa-cloud-rain", condition: "Rainy" },
    61: { desc: "Slight rain", icon: "fa-cloud-showers-heavy", condition: "Rainy" },
    63: { desc: "Moderate rain", icon: "fa-cloud-showers-heavy", condition: "Rainy" },
    65: { desc: "Heavy rain", icon: "fa-cloud-showers-heavy", condition: "Rainy" },
    66: { desc: "Light freezing rain", icon: "fa-cloud-showers-heavy", condition: "Rainy" },
    67: { desc: "Heavy freezing rain", icon: "fa-cloud-showers-heavy", condition: "Rainy" },
    71: { desc: "Slight snow fall", icon: "fa-snowflake", condition: "Overcast" },
    73: { desc: "Moderate snow fall", icon: "fa-snowflake", condition: "Overcast" },
    75: { desc: "Heavy snow fall", icon: "fa-snowflake", condition: "Overcast" },
    77: { desc: "Snow grains", icon: "fa-snowflake", condition: "Overcast" },
    80: { desc: "Slight rain showers", icon: "fa-cloud-showers-heavy", condition: "Rainy" },
    81: { desc: "Moderate rain showers", icon: "fa-cloud-showers-heavy", condition: "Rainy" },
    82: { desc: "Violent rain showers", icon: "fa-cloud-showers-heavy", condition: "Rainy" },
    85: { desc: "Slight snow showers", icon: "fa-snowflake", condition: "Overcast" },
    86: { desc: "Heavy snow showers", icon: "fa-snowflake", condition: "Overcast" },
    95: { desc: "Thunderstorm", icon: "fa-cloud-bolt", condition: "Thunderstorm" },
    96: { desc: "Thunderstorm with slight hail", icon: "fa-cloud-bolt", condition: "Thunderstorm" },
    99: { desc: "Thunderstorm with heavy hail", icon: "fa-cloud-bolt", condition: "Thunderstorm" }
  };
  return wmoMap[code] || { desc: "Unknown weather", icon: "fa-question", condition: "Sunny" };
}

function generateAIInsights(condition, temp, humidity, windSpeed, city, precip24h, uvIndex) {
  let aiTitle = "Stable Convective Buffer";
  let aiDesc = "Barometric pressure remains elevated, preventing rain formation.";
  let aiInsight = `AI scanning node reports stable meteorological properties for ${city}. Local wind vectors are dispersing humidity parameters evenly.`;
  let aiRecs = ["No rain apparel required for the day.", "Perfect ambient temp for outdoor carbon-offset runs."];

  if (condition === "Thunderstorm") {
    aiTitle = "Severe Storm Convective System";
    aiDesc = `Extreme lightning frequency and localized water accumulation expected within the metropolitan sector.`;
    aiInsight = `An incoming convective front is colliding with coastal wind patterns, inducing rapid vertical air lift. This increases cloud volume and rainfall density across ${city}.`;
    aiRecs = ["Secure loose outdoor items immediately.", "High flash flood warning in low elevation sectors."];
  } else if (condition === "Rainy") {
    aiTitle = "Rain Bands Active";
    aiDesc = `Steady precipitation bands are passing over the coordinate mesh, keeping humidity at ${humidity}%.`;
    aiInsight = `A low-pressure depression is lingering over regional margins. The resulting airmass maintains low thermal variance, producing light to moderate rain of ${precip24h}mm.`;
    aiRecs = ["Waterproof coats and umbrellas advised for transit.", "Road moisture indicators showing high slip coefficients."];
  } else if (condition === "Sunny" && temp > 30) {
    aiTitle = "Thermal Depression Alert";
    aiDesc = `Extreme heat coupled with high direct solar radiation. UV index is at ${uvIndex || 8}.`;
    aiInsight = `An anti-cyclonic weather ridge is locking in warm dry air across ${city}, producing high-temperature anomalies. Clear skies yield high solar transparency.`;
    aiRecs = ["Apply SPF 50+ sunscreen if outdoors.", "Hydrate frequently; dry wind increases body moisture loss."];
  } else if (condition === "Sunny") {
    aiTitle = "Optimal Atmospheric Status";
    aiDesc = "Clear skies with light breeze, high solar transparency.";
    aiInsight = `Excellent meteorological envelope detected in ${city}. Dynamic scanning reveals high thermal stability and ideal atmospheric cleansing winds.`;
    aiRecs = ["Good ambient thermal envelope for transit.", "Ventilation systems at maximum efficiency."];
  }

  return { aiTitle, aiDesc, aiInsight, aiRecs };
}

function updateApiStatusBadge(isLive) {
  const badge = document.getElementById("api-status-badge");
  if (!badge) return;
  if (isLive) {
    badge.className = "api-status-badge live";
    badge.innerHTML = `<span class="pulse-dot"></span> LIVE SCAN ACTIVE`;
  } else {
    badge.className = "api-status-badge local";
    badge.innerHTML = `<span class="pulse-dot"></span> LOCAL MESH`;
  }
}

// --- DOM WIDGETS UPDATING ENGINE ---
function renderDashboardMetrics() {
  const loader = document.getElementById("hero-loader");
  loader.classList.add("active");

  setTimeout(() => {
    // Basic city tags
    document.getElementById("hero-city").innerHTML = `${activePreset.city} <span id="hero-country" class="hero-country-badge">${activePreset.country}</span>`;
    document.getElementById("weather-description").innerText = activePreset.conditionDesc.toUpperCase();
    
    // Celsius / Fahrenheit computation
    let temperatureVal = activePreset.temp;
    let feelsLikeVal = activePreset.feelsLike;
    let hiVal = activePreset.tempHigh;
    let loVal = activePreset.tempLow;

    if (currentUnit === "F") {
      temperatureVal = Math.round((temperatureVal * 9/5) + 32);
      feelsLikeVal = Math.round((feelsLikeVal * 9/5) + 32);
      hiVal = Math.round((hiVal * 9/5) + 32);
      loVal = Math.round((loVal * 9/5) + 32);
    }

    document.getElementById("hero-temperature").innerText = temperatureVal;
    document.getElementById("hero-unit-label").innerText = `°${currentUnit}`;
    document.getElementById("temp-high").innerText = `${hiVal}°`;
    document.getElementById("temp-low").innerText = `${loVal}°`;
    document.getElementById("detail-feels-like").innerText = `${feelsLikeVal}°${currentUnit}`;

    // Update local hour timestamp
    const now = new Date();
    let localHours = now.getHours();
    let localMins = now.getMinutes().toString().padStart(2, "0");
    // shift local hour slightly based on preset index as simulated timezones
    if (activePreset.city === "London") localHours = (localHours - 8 + 24) % 24;
    else if (activePreset.city === "New York") localHours = (localHours - 12 + 24) % 24;
    else if (activePreset.city === "Sydney") localHours = (localHours + 1 + 24) % 24;
    else if (activePreset.city === "Sahara Desert") localHours = (localHours - 7 + 24) % 24;
    document.getElementById("detail-local-time").innerText = `${localHours.toString().padStart(2, "0")}:${localMins}`;

    // Animated SVG weather vectors
    updateWeatherIcon(activePreset.condition);

    // Weather background Canvas transition
    initWeatherBackground(activePreset.condition);

    // Quick metrics panel
    document.getElementById("metric-humidity").innerText = `${activePreset.humidity}%`;
    document.getElementById("metric-humidity-sub").innerText = activePreset.humidity > 80 ? "Saturated Air" : activePreset.humidity < 20 ? "Extremely Dry" : "Moderate Humidity";
    
    document.getElementById("metric-wind").innerText = `${activePreset.windSpeed} km/h`;
    // Update windmill animation rate
    const bladeElement = document.getElementById("windmill-blades");
    const speedRatio = Math.max(1, 35 - activePreset.windSpeed);
    bladeElement.style.animationDuration = `${speedRatio * 0.15}s`;

    document.getElementById("metric-pressure").innerText = `${activePreset.pressure} hPa`;
    document.getElementById("metric-pressure-sub").innerText = activePreset.pressure > 1013 ? "High Pressure" : "Low Pressure Front";

    document.getElementById("metric-uv").innerText = `${activePreset.uvIndex} ${activePreset.uvLabel}`;
    // Gauge fill mapping
    const uvFill = document.getElementById("uv-fill");
    uvFill.style.width = `${(activePreset.uvIndex / 12) * 100}%`;

    document.getElementById("metric-visibility").innerText = `${activePreset.visibility} km`;
    document.getElementById("metric-visibility-sub").innerText = activePreset.visibilityDesc;
    
    document.getElementById("metric-sunset").innerText = activePreset.sunset;

    // AI Core insights panel
    const alertBanner = document.getElementById("ai-alert-banner");
    const alertIcon = document.getElementById("ai-alert-icon");
    const alertTitle = document.getElementById("ai-alert-title");
    const alertDesc = document.getElementById("ai-alert-desc");
    
    if (activePreset.condition === "Sunny" || activePreset.condition === "Overcast") {
      alertBanner.classList.add("safe");
      alertIcon.className = "fa-solid fa-circle-check ai-alert-icon";
      alertTitle.innerText = "Normal Atmosphere Status";
      alertDesc.innerText = "No convective warning parameters active.";
    } else {
      alertBanner.classList.remove("safe");
      alertIcon.className = "fa-solid fa-triangle-exclamation ai-alert-icon";
      alertTitle.innerText = activePreset.aiTitle;
      alertDesc.innerText = activePreset.aiDesc;
    }

    document.getElementById("ai-climate-analysis").innerText = activePreset.aiInsight;
    document.getElementById("ai-rec-1").innerText = activePreset.aiRecs[0];
    document.getElementById("ai-rec-2").innerText = activePreset.aiRecs[1];

    // Weekly forecast template rendering
    renderWeeklyForecast();

    // Climate comparison cards updating
    document.getElementById("climate-aqi-val").innerText = `${activePreset.aqi} ${activePreset.aqiLabel}`;
    const aqiBar = document.getElementById("climate-aqi-bar");
    aqiBar.style.width = `${Math.min(100, activePreset.aqi)}%`;
    if (activePreset.aqi > 100) {
      aqiBar.style.background = "linear-gradient(90deg, var(--accent-pink), var(--accent-purple))";
    } else {
      aqiBar.style.background = "linear-gradient(90deg, var(--accent-green), var(--accent-cyan))";
    }

    document.getElementById("climate-precip-val").innerText = `${activePreset.precip24h} mm`;
    const precipBar = document.getElementById("climate-precip-bar");
    precipBar.style.width = `${Math.min(100, (activePreset.precip24h / 50) * 100)}%`;

    // Refresh charts and map
    initTrendsChart();
    initRadarMap();

    loader.classList.remove("active");
  }, 300);
}

function renderWeeklyForecast() {
  const container = document.getElementById("weekly-forecast-container");
  container.innerHTML = ""; // reset

  // Find weekly min and max temp to scale progress bars relatively
  const minWeekTemp = Math.min(...activePreset.forecast.map(item => item.lo));
  const maxWeekTemp = Math.max(...activePreset.forecast.map(item => item.hi));
  const weekRange = maxWeekTemp - minWeekTemp || 1;

  activePreset.forecast.forEach(item => {
    // unit conversions
    let hiTemp = item.hi;
    let loTemp = item.lo;
    if (currentUnit === "F") {
      hiTemp = Math.round((hiTemp * 9/5) + 32);
      loTemp = Math.round((loTemp * 9/5) + 32);
    }

    // Relative percentage positioning
    const leftPercent = ((item.lo - minWeekTemp) / weekRange) * 100;
    const widthPercent = ((item.hi - item.lo) / weekRange) * 100;

    const row = document.createElement("div");
    row.className = "weekly-forecast-row";
    row.innerHTML = `
      <span class="forecast-day">${item.day}</span>
      <div class="forecast-condition">
        <i class="fa-solid ${item.icon}"></i>
        <span class="forecast-condition-text" title="${item.desc}">${item.desc}</span>
      </div>
      <div class="forecast-rain-prob">
        <i class="fa-solid fa-droplet"></i> ${item.rain}%
      </div>
      <div class="forecast-bar-container">
        <div class="forecast-bar-fill" style="left: ${leftPercent}%; width: ${widthPercent}%;"></div>
      </div>
      <div class="forecast-temps">
        <span class="hi">${hiTemp}°</span>
        <span class="lo">${loTemp}°</span>
      </div>
    `;
    container.appendChild(row);
  });
  document.getElementById("forecast-location-label").innerText = `${activePreset.city} Station Array`;
}

// --- CITY LOOKUP SEARCH ---
async function executeCitySearch(query) {
  if (!query) return;
  const loader = document.getElementById("hero-loader");
  loader.classList.add("active");

  const cleanQuery = query.trim();
  
  try {
    // 1. Geocoding API search
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanQuery)}&count=1&language=en&format=json`;
    const geoRes = await fetch(geoUrl);
    if (!geoRes.ok) throw new Error("Geocoding service unavailable.");
    const geoData = await geoRes.json();
    
    if (!geoData.results || geoData.results.length === 0) {
      throw new Error(`Location "${cleanQuery}" not found.`);
    }
    
    const location = geoData.results[0];
    const { latitude, longitude, name, country, country_code } = location;
    
    // 2. Fetch Forecast & Air Quality in parallel
    const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,pressure_msl,wind_speed_10m&hourly=temperature_2m,precipitation_probability,weather_code,visibility&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,sunset,precipitation_sum,precipitation_probability_max&timezone=auto`;
    const aqUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&hourly=us_aqi`;
    
    const [weatherRes, aqRes] = await Promise.all([
      fetch(forecastUrl),
      fetch(aqUrl).catch(() => null)
    ]);
    
    if (!weatherRes.ok) throw new Error("Weather forecast service unavailable.");
    
    const weatherData = await weatherRes.json();
    let aqi = 15;
    let aqiLabel = "Good";
    
    if (aqRes && aqRes.ok) {
      const aqData = await aqRes.json();
      if (aqData.hourly && aqData.hourly.us_aqi) {
        aqi = aqData.hourly.us_aqi[0] || 15;
        aqiLabel = aqi > 150 ? "Unhealthy" : aqi > 100 ? "Unhealthy for Sensitive Groups" : aqi > 50 ? "Moderate" : "Good";
      }
    }
    
    const current = weatherData.current;
    const daily = weatherData.daily;
    const hourly = weatherData.hourly;
    
    const wmo = current.weather_code;
    const wmoDetails = getWmoDetails(wmo);
    
    // Generate daily forecast arrays
    const forecastList = [];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for (let i = 0; i < 7; i++) {
      const dateStr = daily.time[i];
      const date = new Date(dateStr + 'T00:00:00');
      const dayName = days[date.getDay()];
      const dayWmo = daily.weather_code[i];
      const dayWmoDetails = getWmoDetails(dayWmo);
      const rainProb = daily.precipitation_probability_max ? daily.precipitation_probability_max[i] : (daily.precipitation_sum[i] > 0 ? 60 : 0);
      
      forecastList.push({
        day: dayName,
        icon: dayWmoDetails.icon,
        desc: dayWmoDetails.desc,
        rain: rainProb,
        hi: Math.round(daily.temperature_2m_max[i]),
        lo: Math.round(daily.temperature_2m_min[i])
      });
    }
    
    // Map visibility
    let visibilityKm = 10.0;
    let visibilityDesc = "Good visibility";
    if (hourly.visibility && hourly.visibility[0] !== undefined) {
      visibilityKm = +(hourly.visibility[0] / 1000).toFixed(1);
      visibilityDesc = visibilityKm > 10 ? "Excellent" : visibilityKm > 5 ? "Light mist" : "Dense fog haze";
    }
    
    // Construct dynamic activePreset
    activePreset = {
      city: name,
      country: country_code || country || "LOC",
      temp: Math.round(current.temperature_2m),
      feelsLike: Math.round(current.apparent_temperature),
      tempHigh: Math.round(daily.temperature_2m_max[0]),
      tempLow: Math.round(daily.temperature_2m_min[0]),
      condition: wmoDetails.condition,
      conditionDesc: wmoDetails.desc,
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m),
      pressure: Math.round(current.pressure_msl),
      uvIndex: Math.round(daily.uv_index_max[0] || 0),
      uvLabel: (daily.uv_index_max[0]) > 7 ? "Very High" : (daily.uv_index_max[0]) > 4 ? "Moderate" : "Low",
      visibility: visibilityKm,
      visibilityDesc: visibilityDesc,
      sunset: daily.sunset[0] ? daily.sunset[0].split("T")[1] : "19:00",
      aqi: aqi,
      aqiLabel: aqiLabel,
      precip24h: daily.precipitation_sum[0] || 0.0,
      coords: [latitude, longitude],
      forecast: forecastList,
      // Hourly charts data
      hourlyRain: hourly.precipitation_probability ? hourly.precipitation_probability.slice(0, 8) : [10, 20, 30, 20, 10, 0, 0, 0],
      hourlyTemp: hourly.temperature_2m ? hourly.temperature_2m.slice(0, 8).map(t => Math.round(t)) : [15, 16, 17, 18, 17, 16, 15, 14],
      hourlyLabels: hourly.time.slice(0, 8).map(tStr => tStr.split("T")[1]),
      
      // Dynamic AI insights
      ...generateAIInsights(wmoDetails.condition, Math.round(current.temperature_2m), current.relative_humidity_2m, Math.round(current.wind_speed_10m), name, daily.precipitation_sum[0] || 0.0, Math.round(daily.uv_index_max[0] || 0))
    };
    
    updateApiStatusBadge(true);
    renderDashboardMetrics();
    showToastAlert("CITY SYNCED", `Station telemetry for ${activePreset.city} loaded live.`, "success");
    
    // Save live API data to Firestore history
    saveHistoricalData(activePreset);
    
  } catch (error) {
    console.error("API error:", error);
    showToastAlert("SAT SYNC OFFLINE", `${error.message || "Could not retrieve API data."} Loading local mesh...`, "warning");
    
    // Fallback to presets
    const cleanQuery = query.toLowerCase().trim().replace(/\s+/g, '');
    if (WEATHER_PRESETS[cleanQuery]) {
      activePreset = WEATHER_PRESETS[cleanQuery];
    } else if (cleanQuery === "tokyo" || cleanQuery === "tokyo,jp" || cleanQuery === "japan") {
      activePreset = WEATHER_PRESETS.tokyo;
    } else if (cleanQuery === "london" || cleanQuery === "uk" || cleanQuery === "england") {
      activePreset = WEATHER_PRESETS.london;
    } else if (cleanQuery === "newyork" || cleanQuery === "ny" || cleanQuery === "usa" || cleanQuery === "manhattan") {
      activePreset = WEATHER_PRESETS.newyork;
    } else if (cleanQuery === "sydney" || cleanQuery === "australia" || cleanQuery === "syd") {
      activePreset = WEATHER_PRESETS.sydney;
    } else if (cleanQuery === "sahara" || cleanQuery === "desert" || cleanQuery === "egypt") {
      activePreset = WEATHER_PRESETS.sahara;
    } else if (cleanQuery === "nagpur" || cleanQuery === "nagpur,in" || cleanQuery === "maharashtra" || cleanQuery === "nagpurmaharashtra") {
      activePreset = WEATHER_PRESETS.nagpur;
    } else {
      activePreset = generateSimulatedWeather(query);
    }
    
    updateApiStatusBadge(false);
    renderDashboardMetrics();

    // Save fallback telemetry data to Firestore history
    saveHistoricalData(activePreset);
  }
}

function generateSimulatedWeather(cityName) {
  const conditions = ["Sunny", "Rainy", "Overcast", "Thunderstorm"];
  const cond = conditions[Math.floor(Math.random() * conditions.length)];
  const isRain = cond === "Rainy" || cond === "Thunderstorm";

  const preset = {
    city: cityName.charAt(0).toUpperCase() + cityName.slice(1),
    country: "LOC",
    temp: cond === "Sunny" ? Math.floor(Math.random() * 15 + 22) : Math.floor(Math.random() * 10 + 10),
    feelsLike: 0,
    tempHigh: 0,
    tempLow: 0,
    condition: cond,
    conditionDesc: cond === "Thunderstorm" ? "Convective Storm Warning" : cond === "Rainy" ? "Continuous Precipitation" : cond === "Sunny" ? "High Solar Exposure" : "Low Cloud Bound",
    humidity: isRain ? Math.floor(Math.random() * 20 + 75) : Math.floor(Math.random() * 30 + 35),
    windSpeed: Math.floor(Math.random() * 35 + 5),
    pressure: Math.floor(Math.random() * 20 + 1000),
    uvIndex: cond === "Sunny" ? Math.floor(Math.random() * 5 + 6) : Math.floor(Math.random() * 3 + 1),
    uvLabel: "",
    visibility: cond === "Sunny" ? 16.0 : Math.floor(Math.random() * 8 + 4),
    visibilityDesc: cond === "Sunny" ? "Excellent visibility" : "Dense precipitation haze",
    sunset: "19:15",
    aqi: Math.floor(Math.random() * 80 + 10),
    aqiLabel: "Good",
    precip24h: isRain ? +(Math.random() * 25 + 5).toFixed(1) : 0.0,
    coords: [35 + (Math.random() * 10 - 5), 139 + (Math.random() * 10 - 5)],
    forecast: [
      { day: "Fri", icon: isRain ? "fa-cloud-showers-heavy" : "fa-sun", desc: cond, rain: isRain ? 80 : 0, hi: 0, lo: 0 },
      { day: "Sat", icon: "fa-cloud-sun", desc: "Partly Cloudy", rain: 20, hi: 0, lo: 0 },
      { day: "Sun", icon: "fa-sun", desc: "Sunny", rain: 0, hi: 0, lo: 0 },
      { day: "Mon", icon: "fa-cloud", desc: "Overcast", rain: 10, hi: 0, lo: 0 },
      { day: "Tue", icon: "fa-cloud-bolt", desc: "Stormy", rain: 85, hi: 0, lo: 0 },
      { day: "Wed", icon: "fa-sun", desc: "Clear", rain: 0, hi: 0, lo: 0 },
      { day: "Thu", icon: "fa-cloud-sun", desc: "Passing Clouds", rain: 15, hi: 0, lo: 0 }
    ],
    hourlyRain: isRain ? [40, 50, 65, 80, 75, 60, 40, 20] : [0, 0, 5, 10, 5, 0, 0, 0],
    hourlyTemp: Array.from({length: 8}, (_, i) => Math.round((cond === "Sunny" ? 25 : 15) + [-3, -2, 0, 2, 4, 3, 1, -1][i])),
    hourlyLabels: ["00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00"],
    aiTitle: isRain ? "Localized Rain Bands Active" : "Stable Pressure Zone",
    aiDesc: isRain ? "Precipitation tracker confirms moisture dense clouds drifting through coordinate mesh." : "Atmospheric metrics display low turbulent indicators across sector grids.",
    aiInsight: `AI scanning node reports stable meteorological properties for ${cityName}. Local wind vectors are dispersing humidity parameters evenly.`,
    aiRecs: isRain ? ["Carry rain gear inside transit modules.", "Drive carefully, minor hydroplaning risk."] : ["Apply light UV shield blocks.", "Good ventilation indices inside structures."]
  };

  preset.feelsLike = preset.temp - (cond === "Sunny" ? -1 : 2);
  preset.tempHigh = preset.temp + 3;
  preset.tempLow = preset.temp - 4;
  preset.uvLabel = preset.uvIndex > 7 ? "Extreme" : preset.uvIndex > 4 ? "Moderate" : "Low";
  preset.aqiLabel = preset.aqi > 100 ? "Unhealthy" : preset.aqi > 50 ? "Moderate" : "Good";

  preset.forecast.forEach(item => {
    item.hi = preset.tempHigh + Math.floor(Math.random() * 4 - 2);
    item.lo = preset.tempLow + Math.floor(Math.random() * 4 - 2);
  });

  return preset;
}

// Bind search triggers
document.getElementById("search-input").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    executeCitySearch(e.target.value);
  }
});

const searchIcon = document.querySelector(".search-icon");
if (searchIcon) {
  searchIcon.style.cursor = "pointer";
  searchIcon.addEventListener("click", () => {
    executeCitySearch(document.getElementById("search-input").value);
  });
}

// --- WEB SPEECH API (VOICE WEATHER SEARCH) ---
const voiceSearchBtn = document.getElementById("voice-search-btn");

if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    voiceSearchBtn.classList.add("recording");
    showToastAlert("VOICE SEARCH ACTIVE", "System listening for location command...", "success");
  };

  recognition.onresult = (event) => {
    const speechResult = event.results[0][0].transcript;
    document.getElementById("search-input").value = speechResult;
    showToastAlert("VOICE RESOLVED", `Synthesized query: "${speechResult}"`, "success");
    executeCitySearch(speechResult);
  };

  recognition.onerror = (event) => {
    showToastAlert("SPEECH DECODE ERROR", "Failed to resolve coordinates from audio input.", "warning");
    voiceSearchBtn.classList.remove("recording");
  };

  recognition.onend = () => {
    voiceSearchBtn.classList.remove("recording");
  };

  voiceSearchBtn.addEventListener("click", () => {
    recognition.start();
  });
} else {
  voiceSearchBtn.style.opacity = 0.5;
  voiceSearchBtn.addEventListener("click", () => {
    showToastAlert("UNSUPPORTED NODE", "Speech synthesis module not supported by current web client.", "warning");
  });
}

// --- GPS LOCATION DETECT ---
function detectUserLocation(isAutomaticLaunch = false) {
  if (isAutomaticLaunch) {
    showToastAlert("AUTO LOCATION SCAN", "Attempting automatic GPS telemetry lock...", "success");
  } else {
    showToastAlert("GEOLOCATION HANDSHAKE", "Querying GPS coordinates...", "success");
  }
  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        if (!isAutomaticLaunch) {
          showToastAlert("GPS COORDINATES LOCK", `Synced: [Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}]`, "success");
        }
        
        const loader = document.getElementById("hero-loader");
        loader.classList.add("active");
        
        try {
          const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,pressure_msl,wind_speed_10m&hourly=temperature_2m,precipitation_probability,weather_code,visibility&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,sunset,precipitation_sum,precipitation_probability_max&timezone=auto`;
          const aqUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&hourly=us_aqi`;
          
          const [weatherRes, aqRes] = await Promise.all([
            fetch(forecastUrl),
            fetch(aqUrl).catch(() => null)
          ]);
          
          if (!weatherRes.ok) throw new Error("Weather forecast service unavailable.");
          
          const weatherData = await weatherRes.json();
          let aqi = 15;
          let aqiLabel = "Good";
          
          if (aqRes && aqRes.ok) {
            const aqData = await aqRes.json();
            if (aqData.hourly && aqData.hourly.us_aqi) {
              aqi = aqData.hourly.us_aqi[0] || 15;
              aqiLabel = aqi > 150 ? "Unhealthy" : aqi > 100 ? "Unhealthy for Sensitive Groups" : aqi > 50 ? "Moderate" : "Good";
            }
          }
          
          const current = weatherData.current;
          const daily = weatherData.daily;
          const hourly = weatherData.hourly;
          const wmo = current.weather_code;
          const wmoDetails = getWmoDetails(wmo);
          
          const forecastList = [];
          const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
          for (let i = 0; i < 7; i++) {
            const dateStr = daily.time[i];
            const date = new Date(dateStr + 'T00:00:00');
            const dayName = days[date.getDay()];
            const dayWmo = daily.weather_code[i];
            const dayWmoDetails = getWmoDetails(dayWmo);
            const rainProb = daily.precipitation_probability_max ? daily.precipitation_probability_max[i] : (daily.precipitation_sum[i] > 0 ? 60 : 0);
            
            forecastList.push({
              day: dayName,
              icon: dayWmoDetails.icon,
              desc: dayWmoDetails.desc,
              rain: rainProb,
              hi: Math.round(daily.temperature_2m_max[i]),
              lo: Math.round(daily.temperature_2m_min[i])
            });
          }
          
          let visibilityKm = 10.0;
          let visibilityDesc = "Good visibility";
          if (hourly.visibility && hourly.visibility[0] !== undefined) {
            visibilityKm = +(hourly.visibility[0] / 1000).toFixed(1);
            visibilityDesc = visibilityKm > 10 ? "Excellent" : visibilityKm > 5 ? "Light mist" : "Dense fog haze";
          }
          
          activePreset = {
            city: "Current Location",
            country: "GPS",
            temp: Math.round(current.temperature_2m),
            feelsLike: Math.round(current.apparent_temperature),
            tempHigh: Math.round(daily.temperature_2m_max[0]),
            tempLow: Math.round(daily.temperature_2m_min[0]),
            condition: wmoDetails.condition,
            conditionDesc: wmoDetails.desc,
            humidity: current.relative_humidity_2m,
            windSpeed: Math.round(current.wind_speed_10m),
            pressure: Math.round(current.pressure_msl),
            uvIndex: Math.round(daily.uv_index_max[0] || 0),
            uvLabel: (daily.uv_index_max[0]) > 7 ? "Very High" : (daily.uv_index_max[0]) > 4 ? "Moderate" : "Low",
            visibility: visibilityKm,
            visibilityDesc: visibilityDesc,
            sunset: daily.sunset[0] ? daily.sunset[0].split("T")[1] : "19:00",
            aqi: aqi,
            aqiLabel: aqiLabel,
            precip24h: daily.precipitation_sum[0] || 0.0,
            coords: [lat, lon],
            forecast: forecastList,
            hourlyRain: hourly.precipitation_probability ? hourly.precipitation_probability.slice(0, 8) : [10, 20, 30, 20, 10, 0, 0, 0],
            hourlyTemp: hourly.temperature_2m ? hourly.temperature_2m.slice(0, 8).map(t => Math.round(t)) : [15, 16, 17, 18, 17, 16, 15, 14],
            hourlyLabels: hourly.time.slice(0, 8).map(tStr => tStr.split("T")[1]),
            
            ...generateAIInsights(wmoDetails.condition, Math.round(current.temperature_2m), current.relative_humidity_2m, Math.round(current.wind_speed_10m), "Current Location", daily.precipitation_sum[0] || 0.0, Math.round(daily.uv_index_max[0] || 0))
          };
          
          updateApiStatusBadge(true);
          renderDashboardMetrics();
          showToastAlert("GPS WEATHER ACTIVE", `Current weather for coordinates synced live.`, "success");
          
          // Save GPS live data to Firestore history
          saveHistoricalData(activePreset);
          
        } catch (err) {
          console.error("GPS API fetch error, falling back to Nagpur:", err);
          showToastAlert("GPS METADATA OFFLINE", "Could not sync coordinates. Falling back to Nagpur.", "warning");
          executeCitySearch("Nagpur");
        } finally {
          loader.classList.remove("active");
        }
      },
      (error) => {
        console.warn("GPS Permission denied or unavailable:", error);
        showToastAlert("GPS DECOUPLED", "Permission denied/unavailable. Falling back to Nagpur.", "warning");
        executeCitySearch("Nagpur");
      }
    );
  } else {
    showToastAlert("HARDWARE ERROR", "Navigator coordinates matrix not found. Falling back to Nagpur.", "warning");
    executeCitySearch("Nagpur");
  }
}

document.getElementById("locate-btn").addEventListener("click", () => {
  detectUserLocation(false);
});

// --- UNIT CONTROLS (°C / °F) ---
const btnUnitC = document.getElementById("unit-c");
const btnUnitF = document.getElementById("unit-f");

btnUnitC.addEventListener("click", () => {
  if (currentUnit !== "C") {
    currentUnit = "C";
    btnUnitF.classList.remove("active");
    btnUnitC.classList.add("active");
    renderDashboardMetrics();
  }
});

btnUnitF.addEventListener("click", () => {
  if (currentUnit !== "F") {
    currentUnit = "F";
    btnUnitC.classList.remove("active");
    btnUnitF.classList.add("active");
    renderDashboardMetrics();
  }
});

// --- THEME SWAPPING CONTROLLER ---
const btnThemeDark = document.getElementById("theme-dark");
const btnThemeLight = document.getElementById("theme-light");

btnThemeDark.addEventListener("click", () => {
  if (currentTheme !== "dark") {
    currentTheme = "dark";
    document.documentElement.setAttribute("data-theme", "dark");
    btnThemeLight.classList.remove("active");
    btnThemeDark.classList.add("active");
    
    renderDashboardMetrics();
    showToastAlert("CYBER MODE ENGAGED", "Interface parameters updated to dark neon levels.", "success");
  }
});

btnThemeLight.addEventListener("click", () => {
  if (currentTheme !== "light") {
    currentTheme = "light";
    document.documentElement.setAttribute("data-theme", "light");
    btnThemeDark.classList.remove("active");
    btnThemeLight.classList.add("active");
    
    renderDashboardMetrics();
    showToastAlert("AERO MODE ENGAGED", "Interface parameters updated to high-reflectivity daylight values.", "success");
  }
});

// --- TOASTER NOTIFICATIONS AGENT ---
const toasterContainer = document.getElementById("notifications-toaster");

function showToastAlert(title, text, type = "success") {
  const toast = document.createElement("div");
  toast.className = `notification-alert ${type === 'warning' ? 'warning' : ''}`;
  
  const icon = type === 'warning' ? 'fa-triangle-exclamation' : 'fa-satellite-dish';

  toast.innerHTML = `
    <i class="fa-solid ${icon} notification-alert-icon"></i>
    <div class="notification-alert-body">
      <h5>${title}</h5>
      <p>${text}</p>
    </div>
    <button class="notification-alert-close" aria-label="Close message"><i class="fa-solid fa-xmark"></i></button>
  `;

  toast.querySelector(".notification-alert-close").addEventListener("click", () => {
    toast.classList.add("closing");
    setTimeout(() => toast.remove(), 400);
  });

  toasterContainer.appendChild(toast);

  setTimeout(() => {
    if (toast.parentNode) {
      toast.classList.add("closing");
      setTimeout(() => toast.remove(), 400);
    }
  }, 6000);
}

// --- MAP INTERFACE OVERLAY TOGGLES ---
const btnMapRadar = document.getElementById("map-radar-toggle");
const btnMapSatellite = document.getElementById("map-satellite-toggle");
const radarSweepSvg = document.getElementById("radar-sweep-svg");

btnMapRadar.addEventListener("click", () => {
  btnMapSatellite.classList.remove("active");
  btnMapRadar.classList.add("active");
  radarSweepSvg.style.display = "block";
  if (radarOverlayCircle && leafletMap) {
    radarOverlayCircle.addTo(leafletMap);
  }
  showToastAlert("RADAR ACTIVATED", "Simulated Doppler sweep scanning local cloud density.", "success");
});

btnMapSatellite.addEventListener("click", () => {
  btnMapRadar.classList.remove("active");
  btnMapSatellite.classList.add("active");
  radarSweepSvg.style.display = "none";
  if (radarOverlayCircle && leafletMap) {
    radarOverlayCircle.remove();
  }
  showToastAlert("SATELLITE ENGAGED", "Orbital infrared cloud bands synced.", "success");
});

// --- BOOTSTRAP INITIALIZATION ---
window.addEventListener("DOMContentLoaded", () => {
  // Boot and fetch live weather for user coordinates on launch, fallback to Nagpur
  detectUserLocation(true);
  animate();

  setTimeout(() => {
    showToastAlert("AETHERIS NETWORK ONLINE", "Primary weather analytics hub initialized.", "success");
  }, 1200);
});