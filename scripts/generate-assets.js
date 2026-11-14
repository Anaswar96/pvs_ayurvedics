const fs = require('fs');
const path = require('path');

const dirs = [
  'public/images',
  'public/images/products',
  'public/images/services',
  'public/images/banners',
  'public/images/testimonials',
  'public/images/categories',
];

dirs.forEach((dir) => {
  const fullPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// Helper to write SVG
function writeSvg(relPath, svgContent) {
  const fullPath = path.join(__dirname, '..', relPath);
  fs.writeFileSync(fullPath, svgContent.trim(), 'utf8');
  console.log(`Generated: ${relPath}`);
}

// 1. Hero Ayurvedic Visual Composition
writeSvg(
  'public/images/hero-ayurvedic.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
    <defs>
      <linearGradient id="heroBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#F4EFE6" />
        <stop offset="100%" stop-color="#E2D9C8" />
      </linearGradient>
      <linearGradient id="brass" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#DFBA73" />
        <stop offset="50%" stop-color="#B8860B" />
        <stop offset="100%" stop-color="#8B6508" />
      </linearGradient>
      <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#4CAF50" />
        <stop offset="100%" stop-color="#1B5E20" />
      </linearGradient>
      <linearGradient id="oilGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#DAA520" />
        <stop offset="100%" stop-color="#8B4500" />
      </linearGradient>
      <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="15" stdDeviation="20" flood-opacity="0.15" />
      </filter>
    </defs>

    <!-- Background Card / Table Surface -->
    <rect width="800" height="600" rx="24" fill="url(#heroBg)"/>

    <!-- Soft Botanical Leaves in Background -->
    <path d="M 650 50 C 720 100, 750 200, 700 280 C 660 220, 600 150, 650 50 Z" fill="url(#leafGrad)" opacity="0.3"/>
    <path d="M 720 120 C 780 180, 800 260, 760 320 C 720 280, 680 200, 720 120 Z" fill="url(#leafGrad)" opacity="0.2"/>

    <!-- Traditional Kerala Uruli / Brass Vessel -->
    <ellipse cx="400" cy="420" rx="240" ry="80" fill="url(#brass)" filter="url(#softShadow)"/>
    <ellipse cx="400" cy="410" rx="220" ry="70" fill="#3E2723" opacity="0.8"/>
    <!-- Water / Oil with floating Jasmine & Hibiscus flowers -->
    <ellipse cx="400" cy="410" rx="210" ry="65" fill="url(#oilGrad)" opacity="0.85"/>
    
    <!-- Floating Flowers -->
    <circle cx="340" cy="400" r="14" fill="#FFEB3B"/>
    <circle cx="340" cy="400" r="8" fill="#F44336"/>
    <circle cx="450" cy="420" r="16" fill="#FFFFFF"/>
    <circle cx="450" cy="420" r="6" fill="#FFC107"/>
    <circle cx="390" cy="430" r="12" fill="#E91E63"/>

    <!-- Ayurvedic Herbal Oil Glass Bottle -->
    <g transform="translate(480, 180)" filter="url(#softShadow)">
      <!-- Bottle Body -->
      <rect x="0" y="70" width="90" height="180" rx="16" fill="#2E4A34" opacity="0.9"/>
      <rect x="25" y="20" width="40" height="50" rx="4" fill="#2E4A34"/>
      <!-- Wooden Cork -->
      <rect x="30" y="0" width="30" height="20" rx="4" fill="#8D6E63"/>
      <!-- Product Label -->
      <rect x="8" y="110" width="74" height="90" rx="6" fill="#FDFBF7"/>
      <text x="45" y="140" font-family="serif" font-size="11" font-weight="bold" fill="#0D3B27" text-anchor="middle">PVS AYUR</text>
      <text x="45" y="160" font-family="sans-serif" font-size="9" fill="#1B5E20" text-anchor="middle">HAIR OIL</text>
      <line x1="20" y1="170" x2="70" y2="170" stroke="#B8860B" stroke-width="1"/>
    </g>

    <!-- Ayurvedic Wooden Bowl with Herbal Powder & Spices -->
    <g transform="translate(180, 240)" filter="url(#softShadow)">
      <ellipse cx="90" cy="140" rx="90" ry="40" fill="#5D4037"/>
      <ellipse cx="90" cy="130" rx="80" ry="32" fill="#8D6E63"/>
      <ellipse cx="90" cy="128" rx="72" ry="28" fill="#D7CCC8"/>
      <!-- Herbal Powder Mound -->
      <path d="M 40 130 Q 90 90 140 130 Z" fill="#C8B560"/>
    </g>

    <!-- Rolled Linen Spa Towel -->
    <g transform="translate(260, 280)" filter="url(#softShadow)">
      <ellipse cx="60" cy="50" rx="30" ry="50" fill="#EFEBE9"/>
      <rect x="60" y="0" width="120" height="100" rx="10" fill="#FAFAFA"/>
      <line x1="90" y1="0" x2="90" y2="100" stroke="#D7CCC8" stroke-dasharray="4,4"/>
    </g>

    <!-- Fresh Green Herbal Sprigs in Front -->
    <g transform="translate(140, 360)">
      <path d="M 0 80 Q 50 30 100 0" stroke="#1B5E20" stroke-width="4" fill="none"/>
      <path d="M 30 55 C 20 40, 35 25, 45 40 Z" fill="#4CAF50"/>
      <path d="M 60 35 C 75 20, 90 35, 75 50 Z" fill="#4CAF50"/>
      <path d="M 90 10 C 105 0, 115 15, 100 25 Z" fill="#2E7D32"/>
    </g>

    <!-- Floating Badge: Goodness of Nature for a Better Tomorrow -->
    <g transform="translate(560, 50)" filter="url(#softShadow)">
      <text x="0" y="30" font-family="'Brush Script MT', 'Playfair Display', cursive, serif" font-size="28" fill="#1B5E20" font-style="italic">Goodness</text>
      <text x="25" y="60" font-family="'Brush Script MT', 'Playfair Display', cursive, serif" font-size="28" fill="#1B5E20" font-style="italic">of Nature</text>
      <text x="0" y="90" font-family="sans-serif" font-size="12" letter-spacing="2" fill="#556B2F">FOR A BETTER TOMORROW</text>
    </g>
  </svg>`
);

// 2. Product Visual Generator Helper
const productList = [
  { name: 'Herbal Hair Oil', file: 'herbal-hair-oil.svg', color: '#1B5E20', form: 'bottle', tag: 'HAIR OIL' },
  { name: 'Immunity Care', file: 'immunity-care.svg', color: '#B8860B', form: 'jar', tag: 'IMMUNITY' },
  { name: 'Digestive Support', file: 'digestive-support.svg', color: '#795548', form: 'bottle', tag: 'DIGESTION' },
  { name: 'Skin Care Cream', file: 'skin-care-cream.svg', color: '#E91E63', form: 'jar', tag: 'SKIN GLOW' },
  { name: 'Respiratory Care', file: 'respiratory-care.svg', color: '#00796B', form: 'bottle', tag: 'BREATHE' },
  { name: 'Pain Relief Oil', file: 'pain-relief-oil.svg', color: '#C62828', form: 'bottle', tag: 'PAIN CARE' },
  { name: 'Detox Herbal Drink', file: 'detox-drink.svg', color: '#33691E', form: 'box', tag: 'DETOX TEA' },
  { name: 'Women\'s Wellness', file: 'womens-wellness.svg', color: '#8E24AA', form: 'jar', tag: 'WOMEN' },
  { name: 'Joint Care', file: 'joint-care.svg', color: '#D84315', form: 'jar', tag: 'JOINT CARE' },
  { name: 'Kids Care', file: 'kids-care.svg', color: '#F57F17', form: 'bottle', tag: 'KIDS HEALTH' },
];

productList.forEach((prod) => {
  const isJar = prod.form === 'jar';
  const isBox = prod.form === 'box';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <defs>
      <linearGradient id="bgG" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FBF9F5" />
        <stop offset="100%" stop-color="#F0EBE1" />
      </linearGradient>
      <linearGradient id="prodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#2E4A34" />
        <stop offset="100%" stop-color="#0E2315" />
      </linearGradient>
      <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${prod.color}" />
        <stop offset="100%" stop-color="#1B5E20" />
      </linearGradient>
      <filter id="sh" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="12" stdDeviation="15" flood-opacity="0.12" />
      </filter>
    </defs>

    <rect width="400" height="400" rx="16" fill="url(#bgG)"/>

    <!-- Botanical Leaf Accent Behind -->
    <path d="M 280 80 C 350 120, 370 220, 310 300 C 270 240, 220 160, 280 80 Z" fill="#2E7D32" opacity="0.15"/>
    <circle cx="200" cy="330" rx="120" ry="20" fill="#000000" opacity="0.08"/>

    <!-- Container Rendering -->
    ${
      isJar
        ? `<!-- Ayurvedic Medicine Jar -->
      <g transform="translate(125, 120)" filter="url(#sh)">
        <!-- Jar Body -->
        <rect x="0" y="50" width="150" height="150" rx="20" fill="url(#prodGrad)"/>
        <!-- Golden Cap -->
        <rect x="15" y="10" width="120" height="45" rx="8" fill="url(#accent)"/>
        <line x1="20" y1="25" x2="130" y2="25" stroke="#FFFFFF" stroke-width="1.5" opacity="0.4"/>
        <!-- Front Label -->
        <rect x="15" y="75" width="120" height="105" rx="8" fill="#FDFBF7"/>
        <text x="75" y="105" font-family="'Cinzel', serif" font-size="10" font-weight="bold" fill="#0D3B27" text-anchor="middle">PVS AYURVEDICS</text>
        <line x1="30" y1="112" x2="120" y2="112" stroke="#B8860B" stroke-width="1"/>
        <text x="75" y="135" font-family="sans-serif" font-size="12" font-weight="bold" fill="${prod.color}" text-anchor="middle">${prod.tag}</text>
        <text x="75" y="155" font-family="sans-serif" font-size="8" fill="#555555" text-anchor="middle">100% Herbal &amp; Natural</text>
      </g>`
        : isBox
        ? `<!-- Herbal Box Pack -->
      <g transform="translate(130, 100)" filter="url(#sh)">
        <rect x="0" y="20" width="140" height="200" rx="10" fill="#1E3F20"/>
        <rect x="10" y="40" width="120" height="160" rx="6" fill="#FDFBF7"/>
        <text x="70" y="70" font-family="'Cinzel', serif" font-size="10" font-weight="bold" fill="#0D3B27" text-anchor="middle">PVS AYURVEDICS</text>
        <text x="70" y="105" font-family="sans-serif" font-size="13" font-weight="bold" fill="${prod.color}" text-anchor="middle">${prod.tag}</text>
        <line x1="30" y1="118" x2="110" y2="118" stroke="#B8860B" stroke-width="1"/>
        <text x="70" y="145" font-family="sans-serif" font-size="8" fill="#444444" text-anchor="middle">Pure Wellness Infusion</text>
      </g>`
        : `<!-- Amber/Green Ayurvedic Bottle -->
      <g transform="translate(140, 80)" filter="url(#sh)">
        <!-- Cap -->
        <rect x="42" y="10" width="36" height="30" rx="4" fill="#5D4037"/>
        <!-- Neck -->
        <rect x="46" y="38" width="28" height="35" rx="3" fill="url(#prodGrad)"/>
        <!-- Body -->
        <rect x="10" y="70" width="100" height="180" rx="18" fill="url(#prodGrad)"/>
        <!-- Label -->
        <rect x="20" y="105" width="80" height="125" rx="8" fill="#FCFAF2"/>
        <text x="60" y="132" font-family="'Cinzel', serif" font-size="8" font-weight="bold" fill="#0D3B27" text-anchor="middle">PVS AYURVEDICS</text>
        <line x1="30" y1="138" x2="90" y2="138" stroke="#B8860B" stroke-width="1"/>
        <text x="60" y="162" font-family="sans-serif" font-size="11" font-weight="bold" fill="${prod.color}" text-anchor="middle">${prod.tag}</text>
        <text x="60" y="185" font-family="sans-serif" font-size="7.5" fill="#555555" text-anchor="middle">Kerala Authentic Care</text>
      </g>`
    }

    <!-- Herbal leaf in foreground corner -->
    <path d="M 60 360 C 90 320, 150 330, 160 370 C 110 380, 80 370, 60 360 Z" fill="#4CAF50" opacity="0.6"/>
  </svg>`;

  writeSvg(`public/images/products/${prod.file}`, svg);
});

// 3. Promotional Sidebar Banner
writeSvg(
  'public/images/banners/promo-banner.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="100%" height="100%">
    <defs>
      <linearGradient id="bannerBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0F3D24" />
        <stop offset="100%" stop-color="#072213" />
      </linearGradient>
    </defs>
    <rect width="600" height="800" rx="20" fill="url(#bannerBg)"/>
    
    <!-- Botanical pattern overlay -->
    <path d="M 0 0 C 150 100, 200 300, 100 450 C 50 350, 20 200, 0 0 Z" fill="#1B5E20" opacity="0.25"/>
    <path d="M 400 800 C 350 650, 450 500, 600 450 L 600 800 Z" fill="#2E7D32" opacity="0.2"/>

    <!-- Natural solutions composition -->
    <g transform="translate(180, 480)">
      <!-- Brass Mortar and Pestle with Fresh Herbs -->
      <ellipse cx="120" cy="180" rx="110" ry="40" fill="#B8860B"/>
      <ellipse cx="120" cy="170" rx="95" ry="32" fill="#5D4037"/>
      <!-- Bottle behind mortar -->
      <rect x="60" y="20" width="60" height="120" rx="10" fill="#2E7D32"/>
      <rect x="75" y="0" width="30" height="25" rx="4" fill="#D7CCC8"/>
      <!-- Herb Leaves -->
      <path d="M 120 150 C 160 100, 190 140, 170 170 Z" fill="#81C784"/>
      <path d="M 90 140 C 60 90, 40 130, 70 160 Z" fill="#A5D6A7"/>
    </g>
  </svg>`
);

// 4. Kerala Heritage Visual
writeSvg(
  'public/images/kerala-heritage.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
    <defs>
      <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#E0F2F1" />
        <stop offset="100%" stop-color="#FFF8E1" />
      </linearGradient>
      <linearGradient id="roofGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#A04000" />
        <stop offset="100%" stop-color="#5B2C05" />
      </linearGradient>
    </defs>
    <rect width="800" height="500" rx="20" fill="url(#skyGrad)"/>

    <!-- Kerala Nalukettu / Traditional House Outline -->
    <!-- Lush Coconut Palms in Background -->
    <path d="M 120 220 Q 80 140 140 80 Q 200 130 180 220" fill="#2E7D32" opacity="0.7"/>
    <path d="M 680 200 Q 640 120 700 60 Q 760 110 740 200" fill="#2E7D32" opacity="0.7"/>
    
    <!-- Traditional Kerala Roof Gable -->
    <polygon points="400,120 250,220 550,220" fill="url(#roofGrad)"/>
    <polygon points="400,105 230,225 570,225" fill="none" stroke="#D35400" stroke-width="4"/>
    <!-- Wooden Pillars & Verandah -->
    <rect x="270" y="220" width="260" height="150" fill="#FFFBF0" stroke="#795548" stroke-width="3"/>
    <rect x="300" y="220" width="16" height="150" fill="#5D4037"/>
    <rect x="390" y="220" width="16" height="150" fill="#5D4037"/>
    <rect x="480" y="220" width="16" height="150" fill="#5D4037"/>
    <!-- Traditional Hanging Brass Bell/Lamp (Nilavilakku) -->
    <ellipse cx="400" cy="380" rx="30" ry="10" fill="#B8860B"/>
    <line x1="400" y1="340" x2="400" y2="380" stroke="#B8860B" stroke-width="4"/>
    <polygon points="390,340 410,340 400,320" fill="#FF9800"/>

    <!-- Calming Green Lawn & Tropical Garden -->
    <rect x="0" y="370" width="800" height="130" rx="0" fill="#1B4D2E"/>
    <path d="M 50 420 C 150 380, 250 440, 350 400" stroke="#2E7D32" stroke-width="6" fill="none"/>
  </svg>`
);

// 5. Testimonial Avatars
const avatars = [
  { file: 'anjali.svg', name: 'Anjali', bg: '#F8BBD0', color: '#880E4F' },
  { file: 'rashid.svg', name: 'Rashid', bg: '#C8E6C9', color: '#1B5E20' },
  { file: 'priya.svg', name: 'Dr. Priya', bg: '#FFE082', color: '#E65100' },
];

avatars.forEach((av) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="100%" height="100%">
    <circle cx="80" cy="80" r="80" fill="${av.bg}"/>
    <circle cx="80" cy="65" r="30" fill="${av.color}"/>
    <path d="M 30 145 C 30 110, 60 100, 80 100 C 100 100, 130 110, 130 145 Z" fill="${av.color}"/>
  </svg>`;
  writeSvg(`public/images/testimonials/${av.file}`, svg);
});

// 6. Manjeri Map Preview Graphic
writeSvg(
  'public/images/manjeri-map.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
    <defs>
      <linearGradient id="mapBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#E8F4EC" />
        <stop offset="100%" stop-color="#D7EADF" />
      </linearGradient>
    </defs>
    <rect width="600" height="400" rx="16" fill="url(#mapBg)"/>
    <!-- Map Grid Roads -->
    <path d="M 50 180 L 550 210" stroke="#FFFFFF" stroke-width="14" stroke-linecap="round"/>
    <path d="M 280 50 L 320 350" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round"/>
    <path d="M 100 80 Q 250 120 450 60" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round"/>
    <path d="M 120 320 Q 300 260 520 330" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round"/>

    <!-- River Chaliyar / Kadalundi branch tint -->
    <path d="M 0 300 Q 200 240 400 370 L 600 350" stroke="#B2DFDB" stroke-width="16" fill="none" opacity="0.7"/>

    <!-- Pin Marker at Manjeri -->
    <g transform="translate(300, 170)">
      <!-- Pulsing Ring -->
      <circle cx="0" cy="0" r="30" fill="#2E7D32" opacity="0.2"/>
      <circle cx="0" cy="0" r="18" fill="#1B5E20" opacity="0.4"/>
      <!-- Pin Icon -->
      <path d="M 0 -32 C -16 -32, -24 -18, 0 8 C 24 -18, 16 -32, 0 -32 Z" fill="#C62828"/>
      <circle cx="0" cy="-18" r="7" fill="#FFFFFF"/>
    </g>

    <!-- Location Label Card -->
    <g transform="translate(230, 240)">
      <rect x="0" y="0" width="160" height="42" rx="8" fill="#FFFFFF" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.12))"/>
      <text x="80" y="18" font-family="sans-serif" font-size="12" font-weight="bold" fill="#0D3B27" text-anchor="middle">PVS Ayurvedics</text>
      <text x="80" y="32" font-family="sans-serif" font-size="10" fill="#555555" text-anchor="middle">Manjeri, Malappuram</text>
    </g>
  </svg>`
);

console.log('Asset generation complete!');
