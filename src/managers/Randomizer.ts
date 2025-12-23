import { PALETTES } from "../data/Palettes.ts";
import { generateGradientString } from "../utils/helpers.ts";
import { FillSettings, BorderSettings, ShadowSettings, GradientStop, Palette } from "../data/types.ts";

interface RandomizerOverrides {
  background?: FillSettings;
  border?: BorderSettings;
  progress?: {
    radius: number;
    track: FillSettings;
    fill: FillSettings;
  };
  text?: {
    color: string;
    shadow: ShadowSettings;
  };
  qrFrame?: "standard" | "frame1" | "frame2" | "frame3";
}

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

export class Randomizer {
  static hexToRGB(hex: string): RGB {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  }
  static rgbToHex(r: number, g: number, b: number): string {
    return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
  }
  static RGBToHSL(r: number, g: number, b: number): HSL {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h: number = 0;
    let s: number = 0;
    let l: number = (max + min) / 2;
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
  }

  static HSLToRGB(h: number, s: number, l: number): RGB {
    h /= 360;
    s /= 100;
    l /= 100;
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
    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };
  }
  static jitterColor(hex: string, amount: number = 10) {
    try {
      const rgb = this.hexToRGB(hex);
      const hsl = this.RGBToHSL(rgb.r, rgb.g, rgb.b);
      hsl.h = (hsl.h + (Math.random() * amount * 2 - amount) + 360) % 360;
      hsl.l = Math.max(
        0,
        Math.min(100, hsl.l + (Math.random() * amount - amount / 2)),
      );
      const newRgb = this.HSLToRGB(hsl.h, hsl.s, hsl.l);
      return this.rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    } catch (e) {
      return hex;
    }
  }

  static generate(): RandomizerOverrides {
    const randomInt = (min: number, max: number): number =>
      Math.floor(Math.random() * (max - min + 1)) + min;
    const randomFloat = (min: number, max: number): number =>
      Math.random() * (max - min) + min;
    const randomChoice = <Type>(arr: Type[]): Type =>
      arr[Math.floor(Math.random() * arr.length)];
    const chance = (percent: number): boolean => Math.random() * 100 < percent;

    const palette: Palette = randomChoice(PALETTES);
    const overrides: RandomizerOverrides = {};

    //Chances
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
      if (chance(40))
        colors.splice(randomInt(1, colors.length - 1), 0, palette.accent);
      if (chance(CHANCE_JITTER))
        colors = colors.map((c) => this.jitterColor(c, 15));
      return colors;
    };

    const baseBgOpacity: number = isGlassy
      ? randomFloat(0.2, 0.5)
      : randomFloat(0.8, 1);

    // BACKGROUND
    const background: FillSettings = {
      type: "solid",
      color: palette.bg[0],
      opacity: baseBgOpacity,
      gradientStops: [],
      gradientAngle: 0,
      gradientString: ""
    };

    if (chance(CHANCE_GRADIENT)) {
      const colors = getBaseColors();
      background.type = "gradient";
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
        colors.forEach((color: string, i: number) => {
          let pos = (i === 0) ? 0 : (i === colors.length - 1) ? 100 : randomInt(20, 80);
          const op = hasTransGrad ? randomFloat(0.1, 1) : baseBgOpacity;
          stops.push({ id: i + 1, color, opacity: op, position: pos });
        });
      }
      background.gradientStops = stops.sort((a, b) => a.position - b.position);
      background.gradientAngle = randomInt(0, 360);
      background.gradientString = generateGradientString(background.gradientStops, background.gradientAngle);
    } else {
      background.color = chance(CHANCE_JITTER) ? this.jitterColor(palette.bg[0]) : palette.bg[0];
    }
    overrides.background = background;

    // TEXT
    const shadow: ShadowSettings = {
      enabled: chance(CHANCE_SHADOW),
      color: palette.accent,
      opacity: randomFloat(0.5, 1),
      x: 0,
      y: 0,
      blur: 0
    };

    if (shadow.enabled) {
      const shadowType = randomChoice(["glow", "brutal", "soft"]);
      const shadowBaseColor = shadowType === "brutal" ? (palette.text === "#ffffff" ? "#000000" : palette.accent) : palette.accent;
      shadow.color = chance(CHANCE_JITTER) ? this.jitterColor(shadowBaseColor) : shadowBaseColor;
      shadow.blur = shadowType === "brutal" ? 0 : randomInt(5, 20);
      shadow.x = shadowType === "brutal" ? randomChoice([-3, 3]) : 0;
      shadow.y = shadowType === "brutal" ? randomChoice([-3, 3]) : (shadowType === "soft" ? 4 : 0);
    }

    overrides.text = {
      color: chance(CHANCE_JITTER) ? this.jitterColor(palette.text, 5) : palette.text,
      shadow
    };

    // PROGRESS
    const track: FillSettings = {
      type: "solid",
      color: palette.text === "#ffffff" ? "#ffffff" : "#000000",
      opacity: randomFloat(0.1, 0.25),
      gradientStops: [],
      gradientAngle: 0
    };

    const fill: FillSettings = {
      type: chance(CHANCE_PROG_GRAD) ? "gradient" : "solid",
      color: palette.accent,
      opacity: 1,
      gradientStops: [],
      gradientAngle: 0,
      gradientString: ""
    };

    if (fill.type === "solid") {
      fill.color = chance(CHANCE_JITTER) ? this.jitterColor(palette.accent) : palette.accent;
    } else {
      const c1 = chance(CHANCE_JITTER) ? this.jitterColor(palette.accent) : palette.accent;
      const c2 = chance(CHANCE_JITTER) ? this.jitterColor(palette.secondary) : palette.secondary;
      fill.gradientStops = [
        { id: 1, color: c1, opacity: 1, position: 0 },
        { id: 2, color: c2, opacity: randomFloat(0.8, 1), position: 100 },
      ];
      fill.gradientAngle = randomInt(0, 360);
      fill.gradientString = generateGradientString(fill.gradientStops, fill.gradientAngle);
    }

    overrides.progress = {
      radius: randomChoice([0, 4, 8, 12, 25, 50]),
      track,
      fill
    };

    // BORDER
    const border: BorderSettings = {
      enabled: chance(CHANCE_BORDER),
      style: "solid",
      width: 0,
      color: "transparent",
      opacity: 0,
      radius: randomChoice([0, 0, 4, 8, 12, 16, 20, 24, 32, 48, 64, 100])
    };

    if (border.enabled) {
      border.style = randomChoice(["solid", "dashed", "dotted", "double", "groove", "ridge"]);
      border.width = randomInt(1, 8);
      border.color = Math.random() > 0.5 ? palette.text : palette.accent;
      if (chance(CHANCE_JITTER)) border.color = this.jitterColor(border.color);
      border.opacity = isGlassy ? randomFloat(0.3, 0.7) : randomFloat(0.2, 1);
    }
    overrides.border = border;

    overrides.qrFrame = randomChoice(["standard", "frame1", "frame2", "frame3"]);

    return overrides;
  }
}
