import React from "react";
import Document, { Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
	static async getInitialProps(ctx) {
		const initialProps = await Document.getInitialProps(ctx);

		return { ...initialProps };
	}

	render() {
		return (
			<html>
				<Head>
					<meta charSet="UTF-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1.0" />
					<meta httpEquiv="X-UA-Compatible" content="ie=edge" />

					<link rel="stylesheet" href="/static/css/zeit/buttons.css" />
					<link rel="stylesheet" href="/static/css/inputs.css" />
					<link rel="stylesheet" href="/static/css/master.css" />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</html>
		);
	}
}
