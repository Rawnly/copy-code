const { Schema } = require("mongoose");
const { stringifyHTML } = require("../../common/utils");

const ClipboardSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	language: {
		type: String,
	},
	content: {
		type: String,
		required: true,
	},
	deadline: Date,
	created_on: Date,
});

ClipboardSchema.on("save", function() {
	this.created_on = new Date();

	if (typeof this.deadline === "undefined") {
		// + 24h
		this.deadline = new Date(new Date().getTime() + 1000 * 60 * 24);
	}

	if (this.language.toLowerCase() === "html") {
		this.content = stringifyHTML(this.content);
	}
});

module.exports = ClipboardSchema;
