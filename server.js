const app = require("express")();
const next = require("next");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const session = require("express-session");
const server = require("http").Server(app);
const io = require("socket.io")(server);

const { Clipboard } = require("./db/index");
const apiRoutes = require("./server/routes/api");
const dev = process.env.NODE_ENV !== "production";
const PORT = process.env.PORT || 3000;

mongoose.connect(!dev ? process.env.MONGO_URL : "mongodb://127.0.0.1/syntax-clip");
mongoose.Promise = global.Promise;
const db = mongoose.connection;

db.on("connected", () => {
	console.log("DB Connected");
});

db.on("disconnected", () => {
	console.log("DB Disconnected");
});

const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

/** Socket */
let values = {};

io.on("connection", (socket) => {
	io.emit("user:update", io.engine.clientsCount);

	// join the room
	socket.on("room:join", (data) => {
		console.log("A user joined " + data.room);
		socket.room = data.room;
		socket.join(data.room);
		io.sockets.in(data.room).emit("user:update", Object.keys(io.sockets.clients(() => data.room).sockets).length);
	});

	// request an update
	socket.on("request-update", () => {
		console.log(`A Socket has requested an update`);
		io.sockets.to(socket.room).emit("request-update");
	});

	// clients in the rooms sends the update
	socket.on("send-update", (value) => {
		console.log(`Socket ${socket.id} sent an update`);
		io.sockets.to(socket.room).emit("update-received", value);
	});

	// live coding
	socket.on("client:text-update", (data) => {
		socket.broadcast.to(socket.room).emit("server:text-update", data || "");
	});

	socket.on("room:leave", (data) => {
		console.log("A user has left " + data.room);
		io.sockets.in(data.room).emit("user:update", Object.keys(io.sockets.clients(() => data.room).sockets).length);
		socket.leave(data.room);
	});

	socket.on("disconnect", () => {
		io.emit("user:update", io.engine.clientsCount);
	});
});

/** Server */
nextApp.prepare().then(() => {
	app.use(morgan("dev"));
	app.use(bodyParser.json());

	app.use(
		session({
			saveUninitialized: false,
			resave: true,
			secret: "123",
		}),
	);

	app.use(
		bodyParser.urlencoded({
			extended: true,
		}),
	);

	app.all("/templates/*", (req, res) => app.render404(req, res));
	app.use("/api", apiRoutes);

	app.get("/test", (req, res) => {
		app.render(req, res, "/test", {});
	});

	app.get("/random", (req, res) => {
		let route = "/";

		// Generate a random route
		const a = "abcdefghijklmnopqrstuvwxyz0123456789";
		for (let i = 0; i < 7; i++) {
			route += a[Math.floor(Math.random() * a.length)];
		}

		res.redirect(route);
	});

	app.get("/random/room", (req, res) => {
		let route = "/live/";

		// Generate a random route
		const a = "abcdefghijklmnopqrstuvwxyz0123456789";
		for (let i = 0; i < 7; i++) {
			route += a[Math.floor(Math.random() * a.length)];
		}

		res.redirect(route);
	});

	app.get("/live/:room", async (req, res) => {
		nextApp.render(req, res, "/templates/live", { room: req.params.room });
	});

	app.get("/:name", async (req, res) => {
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

		nextApp.render(req, res, "/templates/form", params);
	});

	app.get("*", (req, res) => nextHandler(req, res));

	server.listen(PORT, (err) => {
		if (err) throw err;
		console.log(`Listening at: http://localhost:${PORT}`);
	});
});
