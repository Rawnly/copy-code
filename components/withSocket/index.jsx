import io from "socket.io-client";
import { Component } from "react";

export default (Page) =>
	class extends Component {
		static async getInitialProps(ctx) {
			let pageProps = {};
			if (Page.getInitialProps) {
				pageProps = await Page.getInitialProps(ctx);
			}

			return {
				...pageProps,
			};
		}

		socket = null;

		constructor(props) {
			super(props);
			this.socket = io();
		}

		render() {
			return <Page {...this.props} socket={this.socket} />;
		}
	};
