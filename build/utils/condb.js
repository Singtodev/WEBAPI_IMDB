"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryAsync = exports.condb = void 0;
var mysql_1 = __importDefault(require("mysql"));
var util = require('util');
exports.condb = mysql_1.default.createPool({
    connectionLimit: 10,
    host: "202.28.34.197",
    user: "web66_65011212038",
    password: "65011212038@csmsu",
    database: "web66_65011212038",
});
exports.queryAsync = util.promisify(exports.condb.query).bind(exports.condb);
