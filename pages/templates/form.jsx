import Editor from "react-simple-code-editor";
import CopyToClipboard from "react-copy-to-clipboard";

import hljs from "highlight.js";
import "highlight.js/styles/tomorrow-night.css";

import { withRouter } from "next/router";
import { useEffect, useState } from "react";

import withSocket from "../../components/withSocket";
import DragAndDrop from "../../components/DragAndDrop";
import client from "../../common/utils/api";

const isServer = () => typeof window === "undefined";

const Toast = ({ children, visible: v, isMouseOver, ...props }) => {
	const visible = v || isMouseOver;
	const t = props.theme || "light";

	const theme = {
		dark: {
			color: "#fff",
			background: "#111",
		},
		light: {
			color: "#111",
			background: "#fff",
		},
		danger: {
			color: "white",
			background: "#FF0000",
		},
		magenta: {
			color: "white",
			background: "#FF0080",
		},
	};

	return (
		<div
			className="toast"
			style={{
				transition: "all .2s ease-in-out",
				opacity: visible ? 1 : 0,
				position: "fixed",
				bottom: visible ? 25 : -100,
				left: "50%",
				transform: `translateX(-50%)`,
				...theme[t],
			}}
			{...props}>
			{children}
		</div>
	);
};

const Page = ({
	router: {
		query: { name: qname, content },
	},
}) => {
	const [editorValue, setEditorValue] = useState(isServer() && !content ? "" : content);
	const [isWriting, setIsWriting] = useState(false);
	const [language, setLanguage] = useState(null);
	const [orLanguage, setOrLanguage] = useState(null);
	const [isToastVisible, setToastVisiblity] = useState(false);
	const [mouseStatus, setMouseStatus] = useState(false);
	const [name, setName] = useState(qname);

	function readSingleFile(files) {
		//Retrieve the first (and only!) File from the FileList object
		const f = files[0];

		if (f.name) setName(f.name);

		if (f) {
			var r = new FileReader();
			r.onload = function(e) {
				var contents = e.target.result;
				setEditorValue(contents);
			};
			r.readAsText(f);
		} else {
			alert("Failed to load file");
		}
	}

	function hightlight(code) {
		console.log(code);
		if (!code) return "";

		const highlightedCode = hljs.highlightAuto(code);

		if (highlightedCode.second_best) {
			setOrLanguage(highlightedCode.second_best.language);
		} else {
			setLanguage(highlightedCode.language);
		}

		setTimeout(() => setIsWriting(false), 500);

		return highlightedCode.value;
	}

	const deleteNote = () => {
		client.delete(name);
	};

	useEffect(() => {
		if (!isServer()) {
			const editor = document.querySelector("#editor");

			if (content) {
				if (name && content) deleteNote();
				editor.setAttribute("placeholder", `// Whoops! No Code!`);
			} else {
				editor.setAttribute(
					"placeholder",
					`// Write some code, or drag and drop a file inside the editor\n// Syntax highlight provided by Highlight.js`,
				);
			}

			editor.focus();
		}
	}, []);

	const submit = async (e) => {
		e.preventDefault();

		if (!editorValue) return;

		await client.create({ name, content: editorValue.trim(), language });

		setToastVisiblity(true);

		setTimeout(() => {
			setToastVisiblity(false);
		}, 3000);
	};

	if (isServer()) return null;

	return (
		<section style={{ background: "#111", color: "white" }}>
			<h1
				style={{
					margin: "0 auto",
					display: "felx",
					justifyContent: "center",
					alignItems: "center",
					flexDirection: "column",
					marginBottom: !!content ? 15 : 0,
				}}>
				<input
					readOnly={!!content}
					placeholder={qname}
					onChange={(e) => setName(e.target.value)}
					onBlur={(e) => (e.target.value === "" ? setName(qname) : null)}
					type="text"
					value={name}
					style={{
						background: "none",
						color: "white",
						border: "none",
						fontWeight: "bold",
						textAlign: "center",
					}}
				/>
				{!content && (
					<p
						style={{
							textAlign: "center",
							margin: 0,
							padding: 0,
							fontSize: 10,
							marginTop: -21,
							marginBottom: 15,
						}}>
						Click to edit
					</p>
				)}
			</h1>
			<DragAndDrop
				handleDrop={readSingleFile}
				style={{
					width: "100%",
					height: "80%",
				}}>
				<Editor
					readOnly={!!content}
					value={isServer() ? "" : content ? content : editorValue ? editorValue : ""}
					onValueChange={setEditorValue}
					highlight={hightlight}
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
					textareaId="editor"
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
					Detected language:{" "}
					{language && orLanguage ? (
						<>
							{language} - {orLanguage}
						</>
					) : (
						"No Code"
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
			{content ? (
				<CopyToClipboard text={content || editorValue}>
					<button className="button highlight full-on-mobile" style={{ alignSelf: "flex-end" }} onClick={() => false}>
						<b>Copy to Clipboard</b>
					</button>
				</CopyToClipboard>
			) : (
				<button
					className="button warning full-on-mobile"
					style={{ alignSelf: "flex-end" }}
					disabled={isWriting}
					onClick={submit}>
					<b>Create</b>
				</button>
			)}
			{window && (
				<Toast
					visible={isToastVisible}
					onMouseEnter={() => setMouseStatus(true)}
					onMouseLeave={() => setMouseStatus(false)}
					isMouseOver={mouseStatus}>
					<div className="message">{window.location.href}</div>
					<CopyToClipboard text={`https://highlight.rawnly.com/${name}`} onClick={() => setToastVisiblity(false)}>
						<button className="button small primary">Copy</button>
					</CopyToClipboard>
				</Toast>
			)}
		</section>
	);
};

export default withRouter(withSocket(Page));
