/**
 * Basic color module. No need to be extra and load chalk.
 * @module color
 * @see https://en.wikipedia.org/wiki/ANSI_escape_code#Colors
 */

/**
 * Formats a string as red.
 * @param {string} string 
 * @returns {string}
 */
const red = (string) => {
    return '\x1b[31m' + string + '\x1b[0m';
};

/**
 * Formats a string as green.
 * @param {string} string 
 * @returns {string}
 */
const green = (string) => {
    return '\x1b[32m' + string + '\x1b[0m';
};

/**
 * Formats a string as yellow.
 * @param {string} string 
 * @returns {string}
 */
const yellow = (string) => {
    return '\x1b[33m' + string + '\x1b[0m';
};

/**
 * Formats a string as blue.
 * @param {string} string 
 * @returns {string}
 */
const blue = (string) => {
    return '\x1b[34m' + string + '\x1b[0m';
};

export {
    red,
    green,
    yellow,
    blue
};