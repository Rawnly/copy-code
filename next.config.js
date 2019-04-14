const withSass = require("@zeit/next-sass");
const withCSS = require("@zeit/next-css");
const compose = require("next-compose-plugins");

module.exports = compose([withSass, withCSS]);
