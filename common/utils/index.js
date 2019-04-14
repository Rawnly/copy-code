module.exports.stringifyHTML = function stringifyHTML(html) {
	return html.replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
};
