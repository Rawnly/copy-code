import { Component } from "react";
import Editor from "react-simple-code-editor";
import CopyToClipboard from "react-copy-to-clipboard";

import hljs from "highlight.js";
import "highlight.js/styles/tomorrow-night.css";

import DragAndDrop from "../../components/DragAndDrop";
import Toast from "../../components/Toast";
import withSocket from "../../components/withSocket";

class Page extends Component {
	static async getInitialProps(ctx) {
		return {
			room: ctx.query.room,
		};
	}

	state = {
		needsUpdate: true,
		editorValue: "",
		connectedUsers: 0,
		showToast: false,
		hasJoined: null,
	};

	hightlight(code) {
		if (!code) return "";
		const highlightedCode = hljs.highlightAuto(code);
		return highlightedCode.value;
	}

	readSingleFile = (files) => {
		//Retrieve the first (and only!) File from the FileList object
		const f = files[0];

		if (f) {
			var r = new FileReader();
			r.onload = (e) => {
				var contents = e.target.result;
				if (contents) {
					this.setState({
						editorValue: contents,
					});
				}
			};
			r.readAsText(f);
		} else {
			alert("Failed to load file");
		}
	};

	componentDidMount() {
		// On a new connection
		this.props.socket.emit("room:join", {
			room: this.props.room,
		});

		this.props.socket.emit("request-update");

		// Receive the update
		this.props.socket.on("update-received", (data) => {
			console.log("UPDATE RECEIVED");
			if (this.state.needsUpdate) {
				this.setState({
					editorValue: data,
					needsUpdate: false,
				});
			}
		});

		// Send an update when requested
		this.props.socket.on("request-update", () => {
			console.log("UPDATE REQUEST RECEIVED");
			this.props.socket.emit("send-update", this.state.editorValue);
		});

		// livecoding
		this.props.socket.on("user:update", (count) => {
			const hasJoined = count > this.state.connectedUsers;

			this.setState({ showToast: true, hasJoined });
			setTimeout(() => {
				this.setState({ showToast: false });
			}, 1000);

			this.setState({
				connectedUsers: count,
			});
		});

		this.props.socket.on("server:text-update", (code) => {
			this.setState({
				editorValue: code,
			});
		});
	}

	updateEditorValue = (code) => {
		this.props.socket.emit("client:text-update", code);
		this.setState({
			editorValue: code,
		});
	};

	render() {
		return (
			<section>
				<h1
					style={{
						margin: "0 auto",
						display: "felx",
						justifyContent: "center",
						alignItems: "center",
						flexDirection: "column",
						marginBottom: 15,
					}}>
					{this.props.room}
				</h1>
				<DragAndDrop
					handleDrop={this.readSingleFile}
					style={{
						width: "100%",
						height: "70%",
					}}>
					<Editor
						value={this.state.editorValue}
						onValueChange={this.updateEditorValue}
						highlight={this.hightlight}
						padding={25}
						style={{
							fontFamily: '"Fira code", "Fira Mono", monospace',
							fontSize: 14,
							width: "100%",
							height: "100%",
							lineHeight: 1.3,
							border: "1px solid #222",
							borderRadius: "10px",
							marginBottom: 10,
							overflowY: "scroll",
						}}
						textareaId="live-editor"
					/>
				</DragAndDrop>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						width: "100%",
					}}>
					<small
						style={{
							marginRight: "auto",
							opacity: 0.5,
							fontWeight: "lighter",
							alignSelf: "flex-start",
							marginBottom: "50px",
							fontSize: 14,
							width: 250,
						}}>
						{this.state.connectedUsers > 1 ? (
							<>Users in the room: {this.state.connectedUsers}</>
						) : (
							<>No other users... Invite someone!</>
						)}
					</small>
					<small
						style={{
							marginLeft: "auto",
							fontWeight: "lighter",
							alignSelf: "flex-end",
							marginBottom: "50px",
							fontSize: 14,
							alignSelf: "flex-end",
						}}>
						<a
							style={{
								color: "#0080ff",
								fontWeight: "bold",
							}}
							href="https://github.com/rawnly/copy-code">
							Source
						</a>
					</small>
				</div>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						flexDirection: "row",
						width: "100%",
					}}>
					<CopyToClipboard text={`https://hightlight.rawnly.com/${this.props.room}`}>
						<button className="button warning" style={{ alignSelf: "flex-start" }}>
							<b>Invite People</b>
						</button>
					</CopyToClipboard>
					<CopyToClipboard text={this.state.editorValue}>
						<button className="button highlight" style={{ alignSelf: "flex-end" }}>
							<b>Copy to Clipboard</b>
						</button>
					</CopyToClipboard>
				</div>
				{this.state.connectedUsers > 1 && (
					<Toast visible={this.state.showToast}>A user {this.state.hasJoined ? "joined" : "left"}.</Toast>
				)}
			</section>
		);
	}
}

export default withSocket(Page);
