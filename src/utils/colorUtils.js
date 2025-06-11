export const rgbToHex = (rgb) => {
    const result = rgb.match(/\d+/g);
    if (!result) return "#000000";
    return (
        "#" +
        result
            .map((val) => {
                const hex = parseInt(val).toString(16);
                return hex.length === 1 ? "0" + hex : hex;
            })
            .join("")
    );
};

export const getTextColor = (color) => {
    const hex = color.replace("#", "");

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b);

    return luminance > 186 ? "black" : "white";
};