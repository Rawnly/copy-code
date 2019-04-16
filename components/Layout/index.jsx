import { IoMdPlanet as PlanetIcon } from "react-icons/io";

import Link from "next/link";
import withSocket from "../withSocket";

const Layout = ({ children, ...props }) => {
	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				padding: 0,
				margin: 0,
				gridTemplateRows: "60px calc(100vh - 60px)",
				gridTemplateColumns: "auto",
				display: "grid",
			}}>
			<ul
				style={{
					width: "100%",
					height: 60,
					padding: 0,
					margin: 0,
					display: "flex",
					justifyContent: "flex-start",
					alignItems: "center",
				}}>
				<li style={{ padding: 10, margin: 0, fontWeight: "bold", color: "white" }}>

				</li>
			</ul>
			<section>{children}</section>
		</div>
	);
};

export default withSocket(Layout);
