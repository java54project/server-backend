import express from "express";
import asyncHandler from "express-async-handler";
import gameService from "../services/gameService.mjs";
import { createGameSchema } from "../validation/gameValidation.mjs";



const router = express.Router();


// Create a new game
router.post(
	"/registerGame",

	asyncHandler(async (req, res) => {
		const { error } = createGameSchema.validate(req.body);
		if (error) {
			return res.status(400).json({ status: "fail", message: error.details[0].message });
		}


		const {
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
			movesHistory,
			START_FEN



		} = req.body;


		try {
			const newGame = await gameService.registerGame({
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
				movesHistory,
				START_FEN
			});


			res.status(201).json({
				status: "success",
				message: "Adding new game completed successfully",
				data: newGame,
			});
		} catch (err) {
			res.status(400).json({ status: "fail", message: err.message });
		}
	})
);

// Get current status of game data by email
router.get(
	"/getCurrentData",
	asyncHandler(async (req, res) => {
	const { email, tournamentId } = req.query;
	if (!email||!tournamentId) {
	return res.status(400).json({ status: "fail", message: "Email and Tournament ID are required" });
	}
	
	try {
	const currentData = await gameService.getCurrentGameData(email);
	res.status(200).json({
	status: "success",
	data: currentData,
	});
	} catch (err) {
	res.status(400).json({ status: "fail", message: err.message });
	}
	})
	);
	


export default router;
