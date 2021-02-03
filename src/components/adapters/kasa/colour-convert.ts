import {HSVColor} from "./picker/picker";
import {HSLColor, RGBColor} from "react-color";
import {KasaBulbLightStateData} from "./models";
import convert from "color-convert"
import {HSL, HSV} from "color-convert/conversions";


export const kasaColourToHSV = (colour: KasaBulbLightStateData): HSVColor => {
    const hue = colour.hue;
    const saturation = colour.saturation;
    const value = colour.brightness;
    return {h: hue, s: saturation / 100., v: value / 100.}
}

// The color-convert library expects s & v to be in range 0...100.
// The react-picker API gives them in the range 0...1
// We need to convert into an array and set the magnitude, than reverse it on the way out.
export const hsvToHsl = (hsv: HSVColor): HSLColor => {
    const hsl = convert.hsv.hsl([hsv.h, 100 * hsv.s, 100 * hsv.v].map(Math.round) as HSL);
    return {h: hsl[0], s: hsl[1] / 100, l: hsl[2] / 100};
}

export const hslToHsv = (hsl: HSLColor): HSVColor => {
    const hsv = convert.hsl.hsv([hsl.h, 100 * hsl.s, 100 * hsl.l].map(Math.round) as HSV);
    return {h: hsv[0], s: hsv[1] / 100, v: hsv[2] / 100};
}

// Convert HSV from the picker to a comma-delimited set of HSL values for the API
export const hsvToColourSpec = (hsv: HSVColor): string => {
    const colour = [hsv.h, 100 * hsv.s, 100 * hsv.v].map(Math.round);
    return colour.join(",");
}

export const rgbToHsl = (rgb: RGBColor) => {
    const hsl = convert.rgb.hsl([rgb.r, rgb.g, rgb.b]);
    return {h: hsl[0], s: hsl[1] / 100., l: hsl[2] / 100.} as HSLColor
}

// Algorithm based on this one:
// https://tannerhelland.com/2012/09/18/convert-temperature-rgb-algorithm-code.html
export const colourTempToRGB = (kelvin: number): RGBColor => {
    const clamp = (x: number, min: number = 0, max: number = 255) => Math.min(Math.max(x, min), max);
    kelvin = clamp(kelvin, 1000, 40000) / 100;
    const rgb: RGBColor = {r: 0, g: 0, b: 0};

    if (kelvin <= 66) {
        rgb.r = 255;
        rgb.g = clamp(99.4708025861 * Math.log(kelvin) - 161.1195681661);
    } else {
        rgb.r = clamp(329.698727446 * ((kelvin - 60) ^ -0.1332047592));
        rgb.g = clamp(288.1221695283 * ((kelvin - 60) ^ -0.0755148492));
    }

    if (kelvin >= 66) {
        rgb.b = 255;
    } else if (kelvin <= 19) {
        rgb.b = 0;
    } else {
        rgb.b = clamp(138.5177312231 * Math.log(kelvin - 10) - 305.0447927307)
    }
    return rgb;
}