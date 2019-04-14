import React from "react";
import Link from "next/link";

import "../styles/link.scss";

const Page = () => {
	return (
		<section style={{ background: "#111", color: "#fff" }}>
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
			<Link href="/random">
				<a className="button primary white">Get Started</a>
			</Link>
			<small className="version">v1.0</small>
			<small className="author">
				Made with a ⌨️ by{" "}
				<a className={"underline"} href="https://github.com/rawnly">
					Federico Vitale
				</a>
			</small>
		</section>
	);
};

export default Page;
