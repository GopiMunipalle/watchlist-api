"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const moviesShcema = new mongoose_1.default.Schema({
    title: {
        type: String,
    },
    year: {
        type: Number,
    },
    poster: {
        type: String,
    },
    director: {
        type: String,
    },
    language: {
        type: String,
    },
});
const Movies = mongoose_1.default.model("Movies", moviesShcema);
exports.default = Movies;
