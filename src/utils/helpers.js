import LZString from './lz-string.js';

const KEY_MAP = {
    bgType: 'a',
    bgSolidColor: 'b',
    bgSolidOpacity: 'c',
    bgGradientString: 'd',
    bgGradientStops: 'e',
    bgGradientAngle: 'f',
    borderEnabled: 'g',
    borderStyle: 'h',
    borderWidth: 'i',
    borderColor: 'j',
    borderOpacity: 'k',
    borderRadius: 'l',
    progressRadius: 'm',
    progTrackType: 'n',
    progTrackSolidColor: 'o',
    progTrackSolidOpacity: 'p',
    progTrackGradientString: 'q',
    progTrackGradientStops: 'r',
    progTrackGradientAngle: 's',
    progFillType: 't',
    progFillSolidColor: 'u',
    progFillSolidOpacity: 'v',
    progFillGradientString: 'w',
    progFillGradientStops: 'x',
    progFillGradientAngle: 'y',
    textColor: 'z',
    textShadowEnabled: 'aa',
    textShadowColor: 'ab',
    textShadowOpacity: 'ac',
    textShadowX: 'ad',
    textShadowY: 'ae',
    textShadowBlur: 'af',
    qrFrame: 'ag'
};

const REVERSE_KEY_MAP = Object.fromEntries(
    Object.entries(KEY_MAP).map(([k, v]) => [v, k])
);

export function hexToRgba(hex, alpha) {
    let c;
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

export function generateGradientString(stops, angle) {
    if (!stops || stops.length < 2) return '';
    const sortedStops = [...stops].sort((a, b) => a.position - b.position);
    const stopsString = sortedStops
        .map(s => `${hexToRgba(s.color, s.opacity)} ${s.position}%`)
        .join(', ');
    return `linear-gradient(${angle}deg, ${stopsString})`;
}

// Compacts state for sharing
function compactState(state) {
    const compacted = {};
    for (const key in state) {
        const shortKey = KEY_MAP[key] || key;
        let value = state[key];

        // Compact gradient stops: [{color, opacity, position}, ...] -> [[color, opacity, position], ...]
        if ((key === 'bgGradientStops' || key === 'progTrackGradientStops' || key === 'progFillGradientStops') && Array.isArray(value)) {
            value = value.map(s => [s.color, s.opacity, s.position]);
        }

        compacted[shortKey] = value;
    }
    return compacted;
}

// Expands compacted state back to full form
function expandState(compacted) {
    const expanded = {};
    for (const shortKey in compacted) {
        const fullKey = REVERSE_KEY_MAP[shortKey] || shortKey;
        let value = compacted[shortKey];

        // Expand gradient stops: [[color, opacity, position], ...] -> [{id, color, opacity, position}, ...]
        if ((fullKey === 'bgGradientStops' || fullKey === 'progTrackGradientStops' || fullKey === 'progFillGradientStops') && Array.isArray(value)) {
            value = value.map((v, i) => ({
                id: i + 1,
                color: v[0],
                opacity: v[1],
                position: v[2]
            }));
        }

        expanded[fullKey] = value;
    }
    return expanded;
}

// Encodes the state object to a compressed string
export function encodeWidgetState(state) {
    try {
        const compacted = compactState(state);
        const jsonString = JSON.stringify(compacted);
        return LZString.compressToEncodedURIComponent(jsonString);
    } catch (e) {
        console.error("Failed to encode state:", e);
        return null;
    }
}

// Decodes the compressed string back to a state object
export function decodeWidgetState(encodedString) {
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
