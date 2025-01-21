
import Game from "../models/game.mjs";
import logger from "../middleware/logger.mjs";


const gameService = {
  async registerGame({
	email,
	tournamentId,
	round,
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
	const existingGame = await Game.findOne({ tournamentId, round, deviceId, board });
	if (existingGame) {
  	logger.error("Game already exists:", tournamentId, round, deviceId, board);
  	throw new Error("Game already exists");
	}


	// Creating new game
	const newGame = new Game({
  	email,
  	tournamentId,
	round,
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

  async getCurrentGameData (email, tournamentId) {
	return await Game.find({ email: email, tournamentId: tournamentId }, "tournamentId round deviceId board whitePlayerId blackPlayerId fen moves lastMove isGameFinished result");
	}
	
};


export default gameService;
