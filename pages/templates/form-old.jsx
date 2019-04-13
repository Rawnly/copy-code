import React, { Component } from "react";

import { withRouter } from "next/router";

import Editor from "react-simple-code-editor";

import hljs from "highlight.js";
import "highlight.js/styles/tomorrow-night.css";

import Highlight from "react-highlight";
import CopyToClipboard from "react-copy-to-clipboard";
import client from "../../common/utils/api";

class GetCreate extends Component {
	state = {
		copied: false,
		placeholder: "",
		languages: ["javascript", "css", "html"],
		form: {
			name: this.props.router.query.name,
			content: "",
			selectedLanguage: 0,
		},
	};

	submit = async (e) => {
		e.preventDefault();

		const { content, name, selectedLanguage } = this.state.form;

		console.log({ name, content, language: this.state.languages[selectedLanguage] });

		await client.create({ name, content: content.trim(), language: this.state.languages[selectedLanguage] });

		window.location = "/";
	};

	delete = async () => {
		const name = this.state.form.name;
		await client.delete(name);
	};

	componentDidMount() {
		this.setState((state) => ({
			form: {
				...state.form,
				name: this.props.router.query.name,
			},
			placeholder: this.props.router.query.name,
		}));
	}

	render() {
		const {
			router: { query },
		} = this.props;

		if (query.content && query.content !== "") {
			this.delete();

			return (
				<React.Fragment>
					<section>
						<div className="container">
							<Highlight language={query.language}>{`${query.content}`}</Highlight>
							<CopyToClipboard text={query.content} onCopy={() => this.setState((s) => ({ ...s, copied: true }))}>
								<button className="button secondary flex-end">{this.state.copied ? "Copied!" : "Copy"}</button>
							</CopyToClipboard>
						</div>
					</section>
				</React.Fragment>
			);
		}

		const {
			form: { name },
			placeholder,
		} = this.state;

		// Write
		return (
			<React.Fragment>
				<section>
					<div className="container">
						<input
							value={name}
							className="title flex-start"
							placeholder={placeholder}
							ref={(el) => (this.title = el)}
							onChange={() => {
								this.setState((state) => ({
									form: {
										...state.form,
										name: this.title.value
											.toLowerCase()
											.replace(/\s+/g, "-")
											.trim(),
									},
									placeholder: this.title.value
										.toLowerCase()
										.replace(/\s+/g, "-")
										.trim(),
								}));
							}}
							onBlur={() => {
								if (this.state.form.name === "") {
									this.setState((state) => ({
										form: {
											...state.form,
											name: query.name,
										},
										placeholder: query.name,
									}));
								}
							}}
							onFocus={() => {
								this.setState((state) => ({
									form: {
										...state.form,
										name: "",
									},
									placeholder: state.form.name,
								}));
							}}
						/>
						<textarea
							className="input"
							ref={(el) => (this.textarea = el)}
							placeholder="Your code here"
							value={this.state.form.content}
							onBlur={() => {
								if (this.state.form.content === "") {
									this.submitButton.setAttribute("disabled", true);
								} else {
									this.submitButton.removeAttribute("disabled");
								}
							}}
							onChange={() => {
								const text = this.textarea.value.replace(/\\t+/g, "    ");

								this.setState((state) => ({
									form: {
										...state.form,
										content: text,
									},
								}));

								if (this.textarea.value === "") {
									this.submitButton.setAttribute("disabled", true);
								} else {
									this.submitButton.removeAttribute("disabled");
								}
							}}
						/>
						<div className="footer">
							<select
								className="flex-start button primary"
								ref={(el) => (this.select = el)}
								defaultValue={this.state.languages[this.state.form.selectedLanguage]}
								onChange={(e) => {
									this.setState((state) => ({
										form: {
											...state.form,
											selectedLanguage: state.languages.indexOf(this.select.value),
										},
									}));
								}}>
								{this.state.languages.map((item, index) => (
									<option key={index} value={item}>
										{item}
									</option>
								))}
							</select>
							<button ref={(el) => (this.submitButton = el)} className="button primary flex-end" onClick={this.submit}>
								<b>Upload</b>
							</button>
						</div>
					</div>
				</section>
			</React.Fragment>
		);
	}
}

export default withRouter(GetCreate);
