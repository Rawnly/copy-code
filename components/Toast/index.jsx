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

export default Toast
