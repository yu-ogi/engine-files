module.exports = {
	gameDriver: require("@akashic/game-driver"),
	akashicEngine: require("@akashic/akashic-engine"),
	pdiBrowser: typeof window !== "undefined" ? require("@akashic/pdi-browser/lib/canvas") : null
};
