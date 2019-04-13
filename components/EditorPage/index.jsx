import React from "react";
import Editor from "react-simple-code-editor";

import hljs from "highlight.js";
import "highlight.js/styles/tomorrow-night.css";

function hightlight(code, setLanguage) {
	const highlightedCode = hljs.highlightAuto(code);

	if (setLanguage) {
		setLanguage(highlightedCode.language, highlightedCode.second_best.language);
	}

	return highlightedCode.value;
}

export default ({ title, setLanguage, onValueChange, value, textareaId = "editor", submitButtonText, onSubmit, lang, secondaryLang }) => (
	<section style={{ background: "#111", color: "white" }}>
		<h3>{title}</h3>
		<Editor
			value={value}
			onValueChange={onValueChange}
			highlight={(code) => hightlight(code, setLanguage)}
			padding={25}
			textareaId={textareaId}
			readonly
			style={{
				fontFamily: '"Fira code", "Fira Mono", monospace',
				fontSize: 18,
				width: "100%",
				height: "90%",
				border: "1px solid #222",
				borderRadius: "10px",
				marginBottom: 10,
			}}
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
				{lang && secondaryLang ? (
					<>
						{lang} - {secondaryLang}
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
		<button className="button warning" style={{ alignSelf: "flex-end" }} onClick={onSubmit}>
			{submitButtonText}
		</button>
	</section>
);
