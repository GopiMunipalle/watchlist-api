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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const middleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let jwtToken = null;
        const authHeader = req.headers["authorization"];
        if (authHeader) {
            jwtToken = authHeader.split(" ")[1];
        }
        if (jwtToken === null) {
            return res.status(404).send({ error: "JWT token not found" });
        }
        else {
            yield jsonwebtoken_1.default.verify(jwtToken, "secret_key", (error, payload) => __awaiter(void 0, void 0, void 0, function* () {
                if (error || !payload) {
                    return res.status(404).send({ error: "Invalid access token" });
                }
                else {
                    req.email = payload.email;
                    next();
                }
            }));
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});
exports.default = middleware;
