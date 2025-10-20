/**
 * Ambil teks murni dari HTML dan batasi maksimal N kata.
 * Default: 100 kata.
 */
export const limitWords = (html, maxWords = 100) => {
    if (!html)
        return "";
    const textOnly = html
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    const words = textOnly.split(/\s+/);
    return words.length <= maxWords
        ? textOnly
        : words.slice(0, maxWords).join(" ") + "…";
};
