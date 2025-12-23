export interface BorderSettings {
    enabled: boolean;
    style: "solid" | "dashed" | "dotted" | "double" | "groove" | "ridge";
    width: number;
    color: string;
    opacity: number;
    radius: number;
}

export interface ShadowSettings {
    enabled: boolean;
    color: string;
    opacity: number;
    x: number;
    y: number;
    blur: number;
}

export interface GradientStop {
    id: number;
    color: string;
    opacity: number;
    position: number;
}

export interface FillSettings {
    type: "solid" | "gradient";
    color: string;
    opacity: number;
    gradientString?: string;
    gradientStops: GradientStop[];
    gradientAngle: number;
}

export interface Preset {
    name: string;
    state: {
        background: FillSettings;
        border: BorderSettings;
        progress: {
            radius: number;
            track: FillSettings;
            fill: FillSettings;
        };
        text: {
            color: string;
            shadow: ShadowSettings;
        };
        qrFrame: "standard" | "frame1" | "frame2" | "frame3";
    };
}

export interface Palette {
    name: string;
    bg: string[];
    accent: string;
    secondary: string;
    text: string;
}
