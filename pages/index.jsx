import React from "react";
import Link from "next/link";

const Page = () => {
	return (
		<section style={{ background: "#111", color: "#fff" }}>
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
		</section>
	);
};

export default Page;
