import Joi from "joi";

const fenRegex = /^([rnbqkpRNBQKP1-8]{1,8}\/){7}[rnbqkpRNBQKP1-8]{1,8} [wb] [KQkq\-]{1,4} [a-h1-8\-] \d+ \d+$/;

// Schema for creating a new game
export const createGameSchema = Joi.object({
    email:Joi.string().email().required(),
    tournamentId: Joi.string().min(3).max(30), //TODO has to be improved
    round:Joi.string().min(3).max(30), //TODO has to be improved
    deviceId: Joi.string().min(3).max(30).required(),
    board: Joi.number()
        .min(1)
        .max(100)
        .required()
        .messages({
            "number.base": "Board number has to be a digit ",
            "number.min": "Board number couldn't be less than 1",
            "number.max": "Board number couldn't be more than 100",
        }),
    whitePlayerId: Joi.string().min(3).max(30), //TODO has to be improved
    blackPlayerId: Joi.string().min(3).max(30), //TODO has to be improved
    fen: Joi.string()
        .pattern(fenRegex)
        .message('Invalid FEN format')
        .required(),
   

    playingRules:Joi.string().valid(  
        "chess",
        "rapid",
        "blitz",
        "chess960",
        "blindfold",
        "king-of-the-hill",
        "armageddon",
        "antichess",
        "capablanca",
        "bughouse",
        "shuffle",
        "infinite"
    ),
    
   
});