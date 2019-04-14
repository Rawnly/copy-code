import Editor from "react-simple-code-editor";
import CopyToClipboard from "react-copy-to-clipboard";

import hljs from "highlight.js";
import "highlight.js/styles/tomorrow-night.css";

import { withRouter } from "next/router";
import { useEffect, useState } from "react";

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
		query: { name, content },
	},
}) => {
	const [editorValue, setEditorValue] = useState(isServer() && !content ? "" : content);
	const [isWriting, setIsWriting] = useState(false);
	const [language, setLanguage] = useState(null);
	const [orLanguage, setOrLanguage] = useState(null);
	const [isToastVisible, setToastVisiblity] = useState(false);
	const [mouseStatus, setMouseStatus] = useState(false);

	function hightlight(code) {
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
					`// Just write some code,\n// the language will be automatically detected\n// Syntax highlight provided by Highlight.js`,
				);
			}

			editor.focus();
		}
	}, []);

	const submit = async (e) => {
		e.preventDefault();

		await client.create({ name, content: editorValue.trim(), language });
		// window.location = "/";

		setToastVisiblity(true);

		setTimeout(() => {
			setToastVisiblity(false);
		}, 3000);
	};

	if (isServer()) return null;

	console.log({ content, name, editorValue });

	const getValue = () => {
		if (isServer()) return "";
		if (content) return content;
		return editorValue;
	};

	return (
		<section style={{ background: "#111", color: "white" }}>
			<h3>{name}</h3>
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
					height: "90%",
					lineHeight: 1.3,
					border: "1px solid #222",
					borderRadius: "10px",
					marginBottom: 10,
					overflowY: "scroll",
				}}
				textareaId="editor"
			/>
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
					<button className="button highlight" style={{ alignSelf: "flex-end" }} onClick={() => false}>
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
					<CopyToClipboard text={window.location.href} onClick={() => setToastVisiblity(false)}>
						<button className="button small primary">Copy</button>
					</CopyToClipboard>
				</Toast>
			)}
		</section>
	);
};

export default withRouter(Page);
