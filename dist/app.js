"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = require("dotenv");
const app = (0, express_1.default)();
const db_1 = __importDefault(require("./db"));
const router_1 = __importDefault(require("./routes/router"));
(0, dotenv_1.config)();
const PORT = process.env.PORT || "5005";
app.use(body_parser_1.default.json());
app.use('/movies', router_1.default);
(0, db_1.default)()
    .then(() => {
    app.listen(PORT, () => {
        console.log(`server running at http://localhost:${PORT}`);
    });
})
    .catch((error) => {
    console.log("Error connecting to the database:", error);
});
