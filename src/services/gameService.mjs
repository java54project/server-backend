
import Game from "../models/game.mjs";
import logger from "../middleware/logger.mjs";


const gameService = {
  async registerGame({
	email,
	tournamentId,
	deviceId,
	board,
	whitePlayerId,
	blackPlayerId,
	fen,
	moves = "",
	lastMove = "",
	playingRules,
	isGameFinished = false,
	result = "",
  }) {
	// Checking if game already exists
	const existingGame = await Game.findOne({ deviceId, board });
	if (existingGame && !isGameFinished) {
  	logger.error("Game already exists:", deviceId, board);
  	throw new Error("Game already exists");
	}


	// Creating new game
	const newGame = new Game({
  	email,
  	tournamentId,
  	deviceId,
  	board,
  	whitePlayerId,
  	blackPlayerId,
  	fen,
  	moves,
  	lastMove,
  	playingRules,
  	isGameFinished,
  	result,
	});


	return await newGame.save();
  },
};


export default gameService;
