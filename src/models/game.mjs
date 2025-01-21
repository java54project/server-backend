import mongoose from "mongoose";


const GameSchema = new mongoose.Schema({
  email: {
	type: String,
	required: [true, "User email is required"],
  },
  tournamentId: {
	type: String,
	default: null,
  },
  round:{
	type: String,
	default: null,
  },
  deviceId: {
	type: String,
	required: [true, "Device ID is required. Choose device ID from list"],
  },
  board: {
	type: Number,
	default: 1,
  },
  whitePlayerId: {
	type: String,
	default: null,
  },
  blackPlayerId: {
	type: String,
	default: null,
  },
  fen: {
	type: String,
	required: [true, "Starting FEN is required. Choose playing rules from list to add right starting position"],
  },
  moves: {
	type: String,
	default: "",
  },
  lastMove: {
	type: String,
	default: "",
  },
  playingRules: {
	type: String,
	enum: ["chess", "rapid", "blitz", "chess960", "blindfold", "king-of-the-hill", "armageddon", "antichess", "capablanca", "bughouse", "shuffle", "infinite"],
  },
  isGameFinished: {
	type: Boolean,
	default: false,
  },
  result: {
	type: String,
	enum: ["whites won", "blacks won", "draw", ""],
	default: "",
  },
  movesHistory: {
    type: [String],
    default: [] 
  },

  START_FEN: {
	type: String,
	default: "",
  }

});


export default mongoose.model("Game", GameSchema);
