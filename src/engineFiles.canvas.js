module.exports = {
	gameDriver: require("@akashic/game-driver"),
	akashicEngine: require("./akashicEngine"),
	pdiBrowser: typeof window !== "undefined" ? require("@akashic/pdi-browser/lib/canvas") : null
};
