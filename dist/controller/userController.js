"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Movies_1 = __importDefault(require("../models/Movies"));
const singIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const getUser = yield User_1.default.findOne({ email });
        if (getUser) {
            res.status(400).send({ error: "User Already Exists" });
        }
        else {
            const newUser = new User_1.default({
                email,
                password: hashedPassword,
            });
            yield newUser.save();
            res.status(200).send({ message: "User Successfully Registerd" });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const checkUserEmail = yield User_1.default.findOne({ email });
        if (!checkUserEmail) {
            //invalid email
            res.status(404).send({ error: "Invalid User name" });
        }
        else {
            //check password
            const isValidatePassword = yield bcrypt_1.default.compare(password, checkUserEmail.password);
            if (isValidatePassword) {
                //create jwt
                const payload = { email: email };
                const jwtToken = yield jsonwebtoken_1.default.sign(payload, "secret_key", {
                    expiresIn: "30d",
                });
                res.status(200).send({ jwtToken: jwtToken });
            }
            else {
                //invalid password
                res.status(401).send({ error: "Invalid Password" });
            }
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});
const moviesList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch("https://freetestapi.com/api/v1/movies");
        const data = yield response.json();
        console.log(data);
        for (let movie of data) {
            console.log(movie);
            const { title, year, poster, director, language } = movie;
            const newMovieListData = new Movies_1.default({
                title,
                year,
                poster,
                director,
                language,
            });
            yield newMovieListData.save();
        }
        res.status(200).send({ message: "data Successfully inserted" });
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});
exports.default = { singIn, login, moviesList };
