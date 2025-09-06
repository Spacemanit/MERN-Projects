let divinputcolor1 = document.querySelector('#divChosenColor1')
let divButton = document.querySelector('#divButton');
let holder = document.querySelector('#divholder');

import { getName } from './colorname.js';

function getColor() {
    let inputColor1 = divinputcolor1.value
    
    const baseHex1 = inputColor1.startsWith("#") ? inputColor1 : "#" + inputColor1;

    const generatedColors = generatePalette(baseHex1) // generateColorBlend(baseHex1, baseHex2, 7);

    holder.innerHTML = ''; // empty inside contents of holder div

    for (let color of generatedColors) {
        let eachholder = document.createElement('div');
        eachholder.classList.add('flex', 'flex-col');

        let colortext = document.createElement('div');
        colortext.classList.add('text-center', 'w-50', 'h-2.5', 'm-2.5', 'text-white', 'font-mono');
        colortext.innerHTML = getName(color).toUpperCase();

        let colorBox = document.createElement('div');
        colorBox.classList.add('w-50', 'h-40', 'm-2.5', 'border-2', 'border-gray-300');
        colorBox.style.background = color;

        eachholder.appendChild(colortext);
        eachholder.appendChild(colorBox);
        holder.appendChild(eachholder);
    }
}

// FUNCTION TO FIND WHETHER BLACK OR WHITE LOOKS GOOD ON IT
function blackorwhite(hexcolor) {
    if (!hexcolor.startsWith('#')) {
        const tempDiv = document.createElement('div');
        tempDiv.style.color = hexcolor;
        document.body.appendChild(tempDiv);
        const rgb = window.getComputedStyle(tempDiv).color;
        document.body.removeChild(tempDiv);
        const rgbMatch = rgb.match(/\d+/g);
        if (rgbMatch && rgbMatch.length === 3) {
            hexcolor = rgbToHex(parseInt(rgbMatch[0]), parseInt(rgbMatch[1]), parseInt(rgbMatch[2]));
        } else {
            return 'black';
        }
    }
    const r = parseInt(hexcolor.substr(1, 2), 16);
    const g = parseInt(hexcolor.substr(3, 2), 16);
    const b = parseInt(hexcolor.substr(5, 2), 16);
    const y = (r * 299 + g * 587 + b * 114) / 1000;
    return (y >= 128) ? '#000000' : '#ffffff';
}

function generatePalette(baseColorHex) {
    const [r, g, b] = hexToRgb(baseColorHex);
    let [h, s, l] = rgbToHsl(r, g, b);

    let palette = [];
    palette.push(baseColorHex); // ADDED ORIGINAL COLOUR AS IT LOOKS GOOD :)

    // ----------------USE THESE PALETTE OPTIONS IF YOU WANT TO SEE MORE OPTIONS-------------
    // CREATED THESE PALETTE OPTIONS USING GEMINI, I DONT KNOW MUCH ABOUT COLOUR THEORY (ITS IRREVALENT TO MY FIELD OF WORK):(

    // ANALOGOUS PALETTE
    // palette.push(rgbToHex(...hslToRgb((h + 330) % 360, s, l))); // H - 30
    // palette.push(rgbToHex(...hslToRgb((h + 30) % 360, s, l)));   // H + 30

    // COMPLEMENTARY PALETTE
    // palette.push(rgbToHex(...hslToRgb((h + 180) % 360, s, l)));

    // TRIADIC PALETTE
    // palette.push(rgbToHex(...hslToRgb((h + 120) % 360, s, l)));
    // palette.push(rgbToHex(...hslToRgb((h + 240) % 360, s, l)));

    // TETRADIC PALETTE
    palette.push(rgbToHex(...hslToRgb((h + 90) % 360, s, l)));
    palette.push(rgbToHex(...hslToRgb((h + 180) % 360, s, l)));
    palette.push(rgbToHex(...hslToRgb((h + 270) % 360, s, l)));

    //SPLIT COMPLEMENTARY PALETTE
    const compHue = (h + 180) % 360;
    const angleOffset = 30; // Adjust this angle for more or less "split"
    
    palette.push(rgbToHex(...hslToRgb((compHue - angleOffset + 360) % 360, s, l)));
    palette.push(rgbToHex(...hslToRgb((compHue + angleOffset) % 360, s, l)));
    // Optionally add variations of the split complements for more options
    palette.push(rgbToHex(...hslToRgb((compHue - angleOffset + 360) % 360, s, Math.min(100, l + 15))));
    palette.push(rgbToHex(...hslToRgb((compHue + angleOffset) % 360, s, Math.max(0, l - 15))));

    palette.push(blackorwhite(baseColorHex));

    return palette;
}

// CREATED THESE COLOR TYPE CONVERTERS USING GEMINI

// Function to convert RGB to HSL
function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;

    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h * 360, s * 100, l * 100];
}

// Function to convert HSL to RGB
function hslToRgb(h, s, l) {
    h /= 360; s /= 100; l /= 100;
    let r, g, b;
    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// Function to convert RGB to Hex
function rgbToHex(r, g, b) {
    // Ensuring values are within bounds and converting to 2-digit hex
    const toHex = c => Math.round(Math.max(0, Math.min(255, c))).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

// Function to convert Hex to RGB
function hexToRgb(hex) {
    const cleanHex = hex.startsWith("#") ? hex.slice(1) : hex;
    const isShort = cleanHex.length === 3;
    const r = parseInt(isShort ? cleanHex[0] + cleanHex[0] : cleanHex.substring(0, 2), 16);
    const g = parseInt(isShort ? cleanHex[1] + cleanHex[1] : cleanHex.substring(2, isShort ? 3 : 4), 16);
    const b = parseInt(isShort ? cleanHex[2] + cleanHex[2] : cleanHex.substring(isShort ? 3 : 4, isShort ? 4 : 6), 16);
    return [r, g, b];
}

divButton.addEventListener('click', getColor);