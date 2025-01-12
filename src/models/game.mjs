import mongoose from "mongoose";

const GameSchema = new mongoose.Schema({

    tournamentId: {//TODO on front - add logic; TODO on back - add database
        type: String,
        default: null,
    },

    deviceId: {
        type: String,
        required: [true, "Device ID is required. Choose device ID from list"],
    },


    board: {  //TODO on front - add logic; TODO on back - add database
        type: Number,
        default: 1,
    },

    whitePlayerId: {//TODO on front - add logic; TODO on back - add database
        type: String,
        default: null,

    },

    blackPlayerId: {//TODO on front - add logic; TODO on back - add database
        type: String,
        default: null,

    },

    fen: {
        type: String,
        required: [true, "Starting FEN is required. Choose playing rules from list to add right starting position"],
    },

    moves: {
        type: String,
        default: null,
    },

    playingRules: {
        type: String,
        enum: [
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

            
        ],
    },

    isGameFinished: {
        type: Boolean,
        default: false,
    },

    
    result: {
        type: String,
        enum: [
            "whites won",
            "blacks won",
            "draw", 
        ],

    },



});



export default mongoose.model("Game", GameSchema);