"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var condb_1 = require("../../utils/condb");
var router = express_1.default.Router();
// get all movies 
router.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var search, datasets, moviesQuery, params, movies, _i, movies_1, movie, creatorsQuery, creators, starsQuery, stars, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                search = req.query.search;
                datasets = [];
                moviesQuery = "SELECT * FROM hw5_movies";
                params = [];
                if (search) {
                    moviesQuery += " WHERE m_name LIKE ?";
                    params.push("%".concat(search, "%"));
                }
                return [4 /*yield*/, (0, condb_1.queryAsync)(moviesQuery, params)];
            case 1:
                movies = _a.sent();
                if (movies.length === 0) {
                    return [2 /*return*/, res.send("No movies found!")];
                }
                _i = 0, movies_1 = movies;
                _a.label = 2;
            case 2:
                if (!(_i < movies_1.length)) return [3 /*break*/, 6];
                movie = movies_1[_i];
                creatorsQuery = "\n                SELECT hw5_creators.c_id, hw5_persons.*\n                FROM hw5_creators\n                LEFT JOIN hw5_persons ON hw5_creators.p_id = hw5_persons.p_id\n                WHERE hw5_creators.m_id = ?\n            ";
                return [4 /*yield*/, (0, condb_1.queryAsync)(creatorsQuery, [movie.m_id])];
            case 3:
                creators = _a.sent();
                starsQuery = "\n            SELECT hw5_stars.s_id, hw5_persons.*\n            FROM hw5_stars\n            LEFT JOIN hw5_persons ON hw5_stars.p_id = hw5_persons.p_id\n            WHERE hw5_stars.m_id = ?\n            ";
                return [4 /*yield*/, (0, condb_1.queryAsync)(starsQuery, [movie.m_id])];
            case 4:
                stars = _a.sent();
                datasets.push(__assign(__assign({}, movie), { creators: creators, stars: stars }));
                _a.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 2];
            case 6: return [2 /*return*/, res.json(datasets)];
            case 7:
                err_1 = _a.sent();
                return [2 /*return*/, res.status(500).send('Something went wrong!')];
            case 8: return [2 /*return*/];
        }
    });
}); });
// create a movie
router.post('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, m_name, m_rate_tv, m_duration_time, m_categories, m_poster, sql, values, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, m_name = _a.m_name, m_rate_tv = _a.m_rate_tv, m_duration_time = _a.m_duration_time, m_categories = _a.m_categories, m_poster = _a.m_poster;
                // Check if all required properties are present
                if (!m_name || !m_rate_tv || !m_duration_time || !m_categories || !m_poster) {
                    return [2 /*return*/, res.status(400).send('Missing required data')];
                }
                sql = "INSERT INTO hw5_movies(m_name,m_rate_tv, m_duration_time, m_categories, m_poster) VALUES (?, ?, ?, ?, ?)";
                values = [m_name, m_rate_tv, m_duration_time, m_categories, m_poster];
                return [4 /*yield*/, condb_1.condb.query(sql, values, function (err, result) {
                        if (err) {
                            console.log(err);
                            throw err;
                        }
                        return res.json({
                            msg: "Insert movie success!"
                        });
                    })];
            case 1:
                _b.sent();
                return [3 /*break*/, 3];
            case 2:
                err_2 = _b.sent();
                return [2 /*return*/, res.status(500).send('Something went wrong!')];
            case 3: return [2 /*return*/];
        }
    });
}); });
// update a moive
router.put('/:m_id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var m_id, movie, update, sql, values, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                m_id = req.params.m_id;
                if (!m_id)
                    return [2 /*return*/, res.status(400).send("Required m_id")];
                return [4 /*yield*/, (0, condb_1.queryAsync)("SELECT * FROM hw5_movies WHERE m_id = ?", [m_id])];
            case 1:
                movie = _a.sent();
                if (movie.length === 0) {
                    return [2 /*return*/, res.status(404).send("Movie not found")];
                }
                update = __assign(__assign({}, movie[0]), req.body);
                sql = "UPDATE hw5_movies SET m_rate_tv = ?, m_duration_time = ?, m_categories = ?, m_poster = ?, m_name = ? where m_id = ?";
                values = [update.m_rate_tv, update.m_duration_time, update.m_categories, update.m_poster, update.m_name, m_id];
                return [4 /*yield*/, condb_1.condb.query(sql, values, function (err, result) {
                        if (err) {
                            console.log(err);
                            return res.status(500).send("Error updating person");
                        }
                        return res.json({
                            msg: "Update movie success!",
                            affectedRows: result.affectedRows
                        });
                    })];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                err_3 = _a.sent();
                return [2 /*return*/, res.status(500).send('Something went wrong!')];
            case 4: return [2 /*return*/];
        }
    });
}); });
// get a movie by id
router.get('/:m_id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var m_id, moviesQuery, datasets, params, movies, _i, movies_2, movie, creatorsQuery, creators, starsQuery, stars, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                m_id = req.params.m_id;
                if (!m_id)
                    return [2 /*return*/, res.status(400).send("Required m_id")];
                moviesQuery = "SELECT * FROM hw5_movies where m_id = ?";
                datasets = [];
                params = [m_id];
                return [4 /*yield*/, (0, condb_1.queryAsync)(moviesQuery, params)];
            case 1:
                movies = _a.sent();
                if (movies.length === 0) {
                    return [2 /*return*/, res.send("No movies found!")];
                }
                _i = 0, movies_2 = movies;
                _a.label = 2;
            case 2:
                if (!(_i < movies_2.length)) return [3 /*break*/, 6];
                movie = movies_2[_i];
                creatorsQuery = "\n                SELECT hw5_creators.c_id, hw5_persons.*\n                FROM hw5_creators\n                LEFT JOIN hw5_persons ON hw5_creators.p_id = hw5_persons.p_id\n                WHERE hw5_creators.m_id = ?\n            ";
                return [4 /*yield*/, (0, condb_1.queryAsync)(creatorsQuery, [movie.m_id])];
            case 3:
                creators = _a.sent();
                starsQuery = "\n            SELECT hw5_stars.s_id, hw5_persons.*\n            FROM hw5_stars\n            LEFT JOIN hw5_persons ON hw5_stars.p_id = hw5_persons.p_id\n            WHERE hw5_stars.m_id = ?\n            ";
                return [4 /*yield*/, (0, condb_1.queryAsync)(starsQuery, [movie.m_id])];
            case 4:
                stars = _a.sent();
                datasets.push(__assign(__assign({}, movie), { creators: creators, stars: stars }));
                _a.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 2];
            case 6: return [2 /*return*/, res.json(datasets)];
            case 7:
                err_4 = _a.sent();
                return [2 /*return*/, res.status(500).send('Something went wrong!')];
            case 8: return [2 /*return*/];
        }
    });
}); });
// delete a movie by id
router.delete('/:m_id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var m_id, sql, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                m_id = req.params.m_id;
                if (!m_id)
                    return [2 /*return*/, res.status(400).send("Required m_id")];
                sql = "DELETE FROM hw5_movies where m_id = ?";
                return [4 /*yield*/, condb_1.condb.query(sql, [m_id], function (err, result) {
                        if (err)
                            throw err;
                        return res.json({
                            msg: "Delete movie success",
                            affectedRows: result.affectedRows
                        });
                    })];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                err_5 = _a.sent();
                return [2 /*return*/, res.status(500).send('Something went wrong!')];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
