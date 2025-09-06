import { GetColorName } from 'hex-color-to-color-name';

export function getName(color) {
    if (!color) {
        return "Please provide a color code.";
    }
    try {
        const cleanHex = color.startsWith('#') ? color.substring(1) : color; // To make sure hex code doesnt have # in it
        const colorName = GetColorName(cleanHex);
        return colorName || "Unknown Color";
    } catch (error) {
        console.error("Error getting color name:", error);
        return "Error getting color name.";
    }
}