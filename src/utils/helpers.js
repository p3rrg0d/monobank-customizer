import LZString from './lz-string.js';

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

// Encodes the state object to a compressed string
export function encodeWidgetState(state) {
    try {
        const jsonString = JSON.stringify(state);
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
        return JSON.parse(jsonString);
    } catch (e) {
        console.error("Failed to decode state:", e);
        return null;
    }
}
