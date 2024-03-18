"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
var movies_1 = __importDefault(require("./movies"));
var stars_1 = __importDefault(require("./stars"));
var person_1 = __importDefault(require("./person"));
var creator_1 = __importDefault(require("./creator"));
exports.routes = {
    movieRouter: movies_1.default,
    starRouter: stars_1.default,
    personRouter: person_1.default,
    creatorRouter: creator_1.default
};
