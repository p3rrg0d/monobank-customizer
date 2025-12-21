import { PALETTES } from '../data/Palettes.js';
import { generateGradientString } from '../utils/helpers.js';

interface RGB {
      r: number;
      g: number;
      b: number;
    }

    interface HSL {
      h: number;
      s: number;
      l: number;
    }
    interface GradientStop {
        id: number;
        color: string;
        opacity: number;
        position: number;
    }

    interface RandomizerOverrides {
        bgType?: 'solid' | 'gradient';
        bgSolidColor?: string;
        bgSolidOpacity?: number;
        bgGradientStops?: GradientStop[];
        bgGradientAngle?: number;
        bgGradientString?: string;
        textColor?: string;
        textShadowEnabled?: boolean;
            textShadowColor?: string;
            textShadowOpacity?: number;
            textShadowBlur?: number;
            textShadowX?: number;
            textShadowY?: number;
    }
    interface Palette {
      bg: string[];
      accent: string;
      secondary: string;
      text: string;
    }
export class Randomizer {
    static hexToRGB(hex: string): RGB {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return { r, g, b };
    }
    static rgbToHex(r: number, g: number, b: number): string {
        return "#" + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
    }
    static RGBToHSL(r: number, g: number, b: number): HSL {
      r /= 255; g /= 255; b /= 255;
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h: number = 0;
      let s: number = 0;
      let l: number = (max + min) / 2;
      if (max === min) {
        h = s = 0;
      } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
            }
            return { h: h * 360, s: s * 100, l: l * 100 };
        }

        static HSLToRGB(h: number, s: number, l: number): RGB {
            h /= 360; s /= 100; l /= 100;
            let r: number = 0;
            let g: number = 0;
            let b: number = 0;
            if (s === 0) {
                r = g = b = l;
            } else {
                const hue2rgb = (p: number, q: number, t: number) => {
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
            return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
        }
        static jitterColor(hex: string, amount: number = 10) {
            try {
                const rgb = this.hexToRGB(hex);
                const hsl = this.RGBToHSL(rgb.r, rgb.g, rgb.b);
                hsl.h = (hsl.h + (Math.random() * amount * 2 - amount) + 360) % 360;
                hsl.l = Math.max(0, Math.min(100, hsl.l + (Math.random() * amount - amount / 2)));
                const newRgb = this.HSLToRGB(hsl.h, hsl.s, hsl.l);
                return this.rgbToHex(newRgb.r, newRgb.g, newRgb.b);
            } catch (e) { return hex; }
        }

  static generate() {
    const randomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
    const randomFloat = (min: number, max: number): number => Math.random() * (max - min) + min;
    const randomChoice = (arr: any[]): any => arr[Math.floor(Math.random() * arr.length)];
    const chance = (percent: number): boolean => Math.random() * 100 < percent;

    const palette: Palette = randomChoice(PALETTES);
    const overrides: RandomizerOverrides = {};

    const CHANCE_GLASS: number = 80;
    const CHANCE_BORDER: number = 10;
    const CHANCE_SHADOW: number = 25;
    const CHANCE_GRADIENT: number = 65;
    const CHANCE_PROG_GRAD: number = 35;
    const CHANCE_STEPPED: number = 15;
    const CHANCE_JITTER: number = 85;
    const CHANCE_TRANS_GRAD: number = 90;

    const isGlassy: boolean = chance(CHANCE_GLASS);
    const isStepped: boolean = chance(CHANCE_STEPPED);
    const hasTransGrad: boolean = chance(CHANCE_TRANS_GRAD);

    const getBaseColors = (): string[] => {
      let colors: string[] = [...palette.bg];
      if (chance(40)) colors.splice(randomInt(1, colors.length - 1), 0, palette.accent);
      if (chance(CHANCE_JITTER)) colors = colors.map(c => this.jitterColor(c, 15));
      return colors;
    };

    const baseBgOpacity: number = isGlassy ? randomFloat(0.2, 0.5) : randomFloat(0.8, 1);

    if (chance(CHANCE_GRADIENT)) {
      const colors = getBaseColors();
      overrides.bgType = "gradient";

      const stops: GradientStop[] = [];
      if (isStepped) {
        colors.forEach((color: string, i: number) => {
          const pos = Math.round((i / colors.length) * 100);
          const nextPos = Math.round(((i + 1) / colors.length) * 100);
          const op = hasTransGrad ? randomFloat(0.1, 0.9) : baseBgOpacity;
          stops.push({ id: stops.length + 1, color, opacity: op, position: pos });
          if (i < colors.length - 1) {
            stops.push({ id: stops.length + 1, color, opacity: op, position: nextPos });
          }
        });
      } else {
        colors.forEach((color: string, i: number)=> {
          let pos: number;
          if (i === 0) pos = 0;
          else if (i === colors.length - 1) pos = 100;
          else pos = randomInt(20, 80);
          const op = hasTransGrad ? randomFloat(0.1, 1) : baseBgOpacity;
          stops.push({ id: i + 1, color, opacity: op, position: pos });
        });
      }
      overrides.bgGradientStops = stops.sort((a: GradientStop, b: GradientStop) => a.position - b.position);
      overrides.bgGradientAngle = randomInt(0, 360);
      overrides.bgGradientString = generateGradientString(overrides.bgGradientStops, overrides.bgGradientAngle);
  } else {
      overrides.bgType = "solid";
      overrides.bgSolidColor = chance(CHANCE_JITTER) ? this.jitterColor(palette.bg[0]) : palette.bg[0];
      overrides.bgSolidOpacity = baseBgOpacity;
      overrides.bgGradientString = "";
  }
    }
