import LZString from 'lz-string';

const KEY_MAP: Record<string, string> = {
    background: 'a',
    border: 'b',
    progress: 'c',
    text: 'd',
    qrFrame: 'e',

    type: 'f',
    color: 'g',
    opacity: 'h',
    gradientString: 'i',
    gradientStops: 'j',
    gradientAngle: 'k',
    enabled: 'l',
    style: 'm',
    width: 'n',
    radius: 'o',
    track: 'p',
    fill: 'q',
    shadow: 'r',
    x: 's',
    y: 't',
    blur: 'u'
};

const REVERSE_KEY_MAP = Object.fromEntries(
    Object.entries(KEY_MAP).map(([k, v]) => [v, k])
);

export function hexToRgba(hex: string, alpha: number): string {
    let c: any;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split("");
        if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = "0x" + c.join("");
        return (
            "rgba(" +
            [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",") +
            "," +
            alpha +
            ")"
        );
    }
    return `rgba(0,0,0,${alpha})`;
}

export function generateGradientString(stops: any[], angle: number): string {
    if (!stops || stops.length < 2) return '';
    const sortedStops = [...stops].sort((a, b) => a.position - b.position);
    const stopsString = sortedStops
        .map(s => `${hexToRgba(s.color, s.opacity)} ${s.position}%`)
        .join(', ');
    return `linear-gradient(${angle}deg, ${stopsString})`;
}

// Compacts state for sharing (Recursive)
function compactState(obj: any): any {
    if (Array.isArray(obj)) {
        return obj.map(item => {
            // Special optimization for gradient stops: {color, opacity, position} -> [color, opacity, position]
            if (typeof item === 'object' && item !== null && 'color' in item && 'position' in item) {
                return [item.color, item.opacity, item.position];
            }
            return compactState(item);
        });
    }

    if (typeof obj !== 'object' || obj === null) return obj;

    const compacted: any = {};
    for (const key in obj) {
        const shortKey = KEY_MAP[key] || key;
        compacted[shortKey] = compactState(obj[key]);
    }
    return compacted;
}


function expandState(obj: any, parentKey: string = ''): any {
    if (Array.isArray(obj)) {
        return obj.map((item, i) => {
            const isGradientStopArray = Array.isArray(item) && item.length === 3;

            if (isGradientStopArray && (parentKey === 'j' || parentKey === 'gradientStops')) {
                return {
                    id: i + 1,
                    color: item[0],
                    opacity: item[1],
                    position: item[2]
                };
            }
            return expandState(item);
        });
    }

    if (typeof obj !== 'object' || obj === null) return obj;

    const expanded: any = {};
    for (const shortKey in obj) {
        const fullKey = REVERSE_KEY_MAP[shortKey] || shortKey;
        expanded[fullKey] = expandState(obj[shortKey], shortKey);
    }
    return expanded;
}

export function encodeWidgetState(state: any): string | null {
    try {
        const compacted = compactState(state);
        const jsonString = JSON.stringify(compacted);
        return LZString.compressToEncodedURIComponent(jsonString);
    } catch (e) {
        console.error("Failed to encode state:", e);
        return null;
    }
}

export function decodeWidgetState(encodedString: string): any {
    try {
        const jsonString = LZString.decompressFromEncodedURIComponent(encodedString);
        if (!jsonString) return null;

        const decoded = JSON.parse(jsonString);
        return expandState(decoded);
    } catch (e) {
        console.error("Failed to decode state:", e);
        return null;
    }
}
