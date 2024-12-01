"use client";

import { useEffect, useState } from "react";

function useDirection() {
	const [direction, setDirection] = useState<"horizontal" | "vertical">(
		"horizontal",
	);

	useEffect(() => {
		function changeDirection() {
			if (window.innerWidth < 768) {
				setDirection("vertical");
			} else {
				setDirection("horizontal");
			}
		}

		changeDirection();

		window.addEventListener("resize", changeDirection);
		return () => window.removeEventListener("resize", changeDirection);
	}, []);

	return direction;
}

export default useDirection;
