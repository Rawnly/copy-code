import React, { useEffect, useState } from "react";
import Editor from "react-simple-code-editor";

import hljs from "highlight.js";
import "highlight.js/styles/tomorrow-night.css";

const isServer = () => typeof window === "undefined";

export default (props) => {
	const [editorValue, setEditorValue] = useState("");
	const [isWriting, setIsWriting] = useState(false);
	const [language, setLanguage] = useState(null);
	const [orLanguage, setOrLanguage] = useState(null);

	function hightlight(code) {
		const highlightedCode = hljs.highlightAuto(code);

		if (highlightedCode.second_best) {
			setOrLanguage(highlightedCode.second_best.language);
		} else {
			setLanguage(highlightedCode.language);
		}

		setTimeout(() => setIsWriting(false), 500);

		return highlightedCode.value;
	}

	useEffect(() => {
		if (!isServer()) {
			const editor = document.querySelector("#editor");
			editor.setAttribute(
				"placeholder",
				`// Just write some code,\n// the language will be automatically detected\n\n// Syntax highlight provided by Highlight.js`,
			);
			editor.focus();
		}
	}, []);

	return (
		<section style={{ background: "#111", color: "white" }}>
			<h3>Just write some Code</h3>
			<Editor
				value={editorValue}
				onValueChange={setEditorValue}
				highlight={hightlight}
				padding={25}
				style={{
					fontFamily: '"Fira code", "Fira Mono", monospace',
					fontSize: 18,
					width: "100%",
					height: "90%",
					border: "1px solid #222",
					borderRadius: "10px",
					marginBottom: 10,
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
			<button className="button warning" style={{ alignSelf: "flex-end" }} disabled={isWriting}>
				<b>SAVE</b>
			</button>
		</section>
	);
};
