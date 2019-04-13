const mongoose = require("mongoose");

const {
	ClipboardSchema
} = require("../schemas");

module.exports = mongoose.model('Clipboard', ClipboardSchema);