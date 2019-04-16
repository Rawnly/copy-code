import React, { useState, useEffect, Component } from "react";
import Link from "next/link";
import withSocket from "../components/withSocket";
import Layout from "../components/Layout";
import "../styles/link.scss";

class Page extends Component {
	state = {
		users: 0,
	};

	componentDidMount() {
		if (this.props.socket) this.props.socket.on("user:update", (data) => this.setState({ users: data }));
	}

	render() {
		return (
			<section>
				<div className="toast-area" />
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						flexDirection: "column",
						marginBottom: 25,
					}}>
					<h2 style={{ margin: 0 }}>SHARE YOUR CODE WITH EASE</h2>
					<small>
						Just <code>copy-paste</code> your file and click the share button
					</small>
				</div>
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						flexDirection: "row",
					}}>
					<Link href="/random">
						<a style={{ margin: "0 10px" }} className="button primary white">
							Get Started
						</a>
					</Link>
					<Link href="/random/room">
						<a style={{ margin: "0 10px" }} className="button warning">
							Live Coding
						</a>
					</Link>
				</div>
				<small className="version">v1.0</small>
				<small className="author">
					{this.state.users > 0 ? (
						<>
							{this.state.users} user{this.state.users > 1 ? "s" : ""} connected
						</>
					) : (
						<>Connecting...</>
					)}
				</small>
			</section>
		);
	}
}

export default withSocket(Page);
