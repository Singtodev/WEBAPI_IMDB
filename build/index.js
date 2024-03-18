"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var body_parser_1 = __importDefault(require("body-parser"));
var routers_1 = require("./routers");
var app = (0, express_1.default)();
require('dotenv').config();
app.use((0, cors_1.default)());
app.use((0, body_parser_1.default)());
app.use(body_parser_1.default.json());
app.get('/', function (req, res) {
    res.send("Hello World");
});
app.use('/movies', routers_1.routes.movieRouter);
app.use('/stars', routers_1.routes.starRouter);
app.use('/persons', routers_1.routes.personRouter);
app.use('/creators', routers_1.routes.creatorRouter);
var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log("Server is runing on port ".concat(process.env.ENDPOINT, ":").concat(PORT));
});
