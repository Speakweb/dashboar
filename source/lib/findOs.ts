// @ts-ignore
export function findOs() {

		const isWin = process.platform === "win32";
		const isMac = process.platform === "darwin";
		const isLnx = process.platform === "linux"

		if (isWin) {
			return "win32"

		}

		if (isMac || isLnx) {
			return "MacOrLnx"

		}
	}
