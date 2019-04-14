const TopLeft = ({ children, margin = 25 }) => (
	<div
		style={{
			position: "absolute",
			top: margin,
			left: margin,
		}}>
		{children}
	</div>
);

const TopRight = ({ children, margin = 25 }) => (
	<div
		style={{
			position: "absolute",
			top: margin,
			right: margin,
		}}>
		{children}
	</div>
);

const BottomRight = ({ children, margin = 25 }) => (
	<div
		style={{
			position: "absolute",
			bottom: margin,
			right: margin,
		}}>
		{children}
	</div>
);

const BottomLeft = ({ children, margin = 25 }) => (
	<div
		style={{
			position: "absolute",
			bottom: margin,
			left: margin,
		}}>
		{children}
	</div>
);

const BottomCenter = ({ children, margin = 25 }) => (
	<div
		style={{
			position: "absolute",
			bottom: margin,
			left: "50%",
			transform: "translateX(-50%)",
		}}>
		{children}
	</div>
);

const TopCenter = ({ children, margin = 25 }) => (
	<div
		style={{
			position: "absolute",
			top: margin,
			left: "50%",
			transform: "translateX(-50%)",
		}}>
		{children}
	</div>
);

export default {
	TopCenter,
	TopLeft,
	TopRight,
	BottomRight,
	BottomLeft,
	BottomCenter,
};
