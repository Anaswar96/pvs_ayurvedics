const fs = require('fs');
const path = require('path');

function writeSvg(relPath, svgContent) {
  const fullPath = path.join(__dirname, '..', relPath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, svgContent.trim(), 'utf8');
  console.log(`Generated: ${relPath}`);
}

// Story / About image
writeSvg(
  'public/images/story-ayurveda.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
    <defs>
      <linearGradient id="stBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FCFAF5" />
        <stop offset="100%" stop-color="#EDE6D8" />
      </linearGradient>
    </defs>
    <rect width="600" height="400" rx="16" fill="url(#stBg)"/>
    <circle cx="300" cy="200" r="140" fill="#E8F5E9" opacity="0.6"/>
    <!-- Mortar and Botanical Branch -->
    <g transform="translate(210, 100)">
      <ellipse cx="90" cy="180" rx="80" ry="30" fill="#2E4A34"/>
      <ellipse cx="90" cy="170" rx="70" ry="24" fill="#1B3323"/>
      <!-- Leaves emerging -->
      <path d="M 90 170 C 60 100, 30 70, 0 80 C 10 120, 50 140, 90 170 Z" fill="#4CAF50"/>
      <path d="M 90 170 C 120 90, 160 60, 190 70 C 180 110, 140 140, 90 170 Z" fill="#2E7D32"/>
      <path d="M 90 170 C 90 70, 90 40, 90 20 C 100 60, 100 120, 90 170 Z" fill="#81C784"/>
    </g>
  </svg>`
);

// Journey Banner
writeSvg(
  'public/images/journey-banner.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 300" width="100%" height="100%">
    <defs>
      <linearGradient id="jBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0F3D24" />
        <stop offset="100%" stop-color="#082616" />
      </linearGradient>
    </defs>
    <rect width="800" height="300" rx="16" fill="url(#jBg)"/>
    <!-- Botanical Curves -->
    <path d="M 600 0 C 700 80, 750 200, 800 300 L 800 0 Z" fill="#1B5E20" opacity="0.4"/>
    <circle cx="700" cy="180" r="80" fill="#2E7D32" opacity="0.3"/>
  </svg>`
);

// Service SVGs
const services = ['consultation', 'wellness', 'herbal-products', 'follow-up'];
services.forEach((s) => {
  writeSvg(
    `public/images/services/${s}.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
      <rect width="400" height="300" rx="12" fill="#F4F8F4"/>
      <circle cx="200" cy="150" r="70" fill="#E8F5E9"/>
      <circle cx="200" cy="150" r="50" fill="#C8E6C9"/>
      <path d="M 180 150 C 180 130, 220 130, 220 150 C 220 170, 180 170, 180 150 Z" fill="#1B5E20"/>
    </svg>`
  );
});

// Category SVGs
const categories = ['hair', 'immunity', 'digestive', 'skin', 'respiratory', 'pain', 'women', 'joint', 'kids'];
categories.forEach((c) => {
  writeSvg(
    `public/images/categories/${c}.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
      <rect width="200" height="200" rx="16" fill="#F7FAF7"/>
      <circle cx="100" cy="100" r="60" fill="#E0ECE4"/>
      <circle cx="100" cy="100" r="40" fill="#A5D6A7"/>
      <path d="M 100 70 C 120 90, 120 120, 100 135 C 80 120, 80 90, 100 70 Z" fill="#1B5E20"/>
    </svg>`
  );
});

console.log('Additional assets created successfully.');
