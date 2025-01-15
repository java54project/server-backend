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
  	
	} = req.body;


	try {
  	const newGame = await gameService.registerGame({
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


export default router;
