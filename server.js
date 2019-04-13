const Express = require("express");
const next = require("next");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const session = require("express-session");

mongoose.connect("mongodb://127.0.0.1/syntax-clip");
mongoose.Promise = global.Promise;
const db = mongoose.connection;

db.on("connected", () => {
	console.log("DB Connected");
});

db.on("disconnected", () => {
	console.log("DB Disconnected");
});

const { Clipboard } = require("./db/index");

const dev = process.env.NODE_ENV !== "production";
const PORT = process.env.PORT || 3000;

const app = next({
	dir: ".",
	dev,
});

const handle = app.getRequestHandler();
const apiRoutes = require("./server/routes/api");

app.prepare().then(() => {
	const server = Express();

	server.use(morgan("dev"));
	server.use(bodyParser.json());

	server.use(
		session({
			saveUninitialized: false,
			resave: true,
			secret: "123",
		}),
	);

	server.use(
		bodyParser.urlencoded({
			extended: true,
		}),
	);

	server.use(
		"/monaco-editor-external",
		Express.static(`${__dirname}/node_modules/@timkendrick/monaco-editor/dist/external`),
	);

	server.all("/templates/*", (req, res) => app.render404(req, res));
	server.use("/api", apiRoutes);

	server.get("/random", (req, res) => {
		let route = "/";

		// Generate a random route
		const a = "abcdefghijklmnopqrstuvwxyz0123456789";
		for (let i = 0; i < 7; i++) {
			route += a[Math.floor(Math.random() * a.length)];
		}

		res.redirect(route);
	});

	server.get("/:name", async (req, res) => {
		const item = await Clipboard.findOne({
			name: req.params.name.toLowerCase(),
		});

		let params = {};

		if (item && item.content) {
			params = item;
		} else {
			params = {
				name: req.params.name,
			};
		}

		app.render(req, res, "/templates/form", params);
	});

	server.get("*", (req, res) => handle(req, res));

	server.listen(PORT, (err) => {
		if (err) throw err;
		console.log(`Listening at: --> http://localhost:${PORT} <--`);
	});
});
