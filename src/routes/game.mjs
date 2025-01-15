import express from "express";
  import asyncHandler from "express-async-handler";
  import gameService from "../services/gameService.mjs";
  import { createGameSchema } from "../validation/gameValidation.mjs";
  import { authenticate, authorizeRole } from "../middleware/auth.mjs";


  const router = express.Router();

  // Create a new game
  router.post(
    "/",
    authenticate,
    authorizeRole("user"),

    
    

    asyncHandler(async (req, res) => {
     
     const { error } = createGameSchema.validate(req.body);
      if (error) {
      
        return res.status(400).json({ status: "fail", message: error.details[0].message });
      }

      const {
        tournamentId,
        deviceId,
        board,
        whitePlayerId,
        blackPlayerId,
        fen,
        playingRules,
       
      } = req.body;

      try {
        const newGame = await gameService.registerGame({   
            tournamentId,
            deviceId,
            board,
            whitePlayerId,
            blackPlayerId,
            fen,
            moves,
            playingRules,
            isGameFinished,
            result,   
        });
        res.status(201).json({
          status: "success",
          message: "Adding new game completed successfully",
          data: {
           
            tournamentId: newGame.tournamentId,
            deviceId:newGame. deviceId,
            board:newGame.board,
            whitePlayerId:newGame.whitePlayerId,
            blackPlayerId:newGame. blackPlayerId,
            fen:newGame.fen,
            moves:newGame.moves,
            playingRules:newGame.playingRules,
            isGameFinished:newGame.isGameFinished,
            result:newGame.result,
          },
        });
      } catch (err) {
       
        res.status(400).json({ status: "fail", message: err.message });
      };
   } ));
     

  // Get current fen of unfinished games
//   router.get(
//     "/currentFen",
//     asyncHandler(async (req, res) => {
//       const { } = req.query; 

//       if () {
//         return res.status(400).json({
//           status: "fail",
//           message: "... are required",
//         });
//       }
     
      

//       const fen[] = await Game.find({
        
//       });

//       res.status(200).json({
//         status: "success",
//         data: fens,
//       });
    // })
//   );

  

  export default router;