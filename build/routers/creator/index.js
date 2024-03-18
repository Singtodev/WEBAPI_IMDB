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
// get all creators 
router.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var sql, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                sql = "SELECT DISTINCT hw5_creators.p_id ,hw5_creators.c_id,hw5_persons.*\n        FROM hw5_creators\n        LEFT JOIN hw5_movies ON hw5_movies.m_id = hw5_creators.m_id\n        LEFT JOIN hw5_persons ON hw5_persons.p_id = hw5_creators.p_id;";
                return [4 /*yield*/, condb_1.condb.query(sql, function (err, result) {
                        if (err) {
                            return res.status(500).json({
                                msg: "Error get all",
                                code: err.code
                            });
                        }
                        return res.json(result);
                    })];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                return [2 /*return*/, res.status(500).send('Something went wrong!')];
            case 3: return [2 /*return*/];
        }
    });
}); });
// create a creator
router.post('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, m_id, p_id, sql, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, m_id = _a.m_id, p_id = _a.p_id;
                // Check if all required properties are present
                if (!m_id || !p_id) {
                    return [2 /*return*/, res.status(400).send('Missing required data')];
                }
                sql = "INSERT INTO hw5_creators(m_id,p_id) VALUES (?, ?)";
                return [4 /*yield*/, condb_1.condb.query(sql, [m_id, p_id], function (err, result) {
                        if (err) {
                            return res.status(500).json({
                                msg: "Insert creator error",
                                code: err.code
                            });
                        }
                        return res.json({
                            msg: "Insert creator success!"
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
// update a creator
router.put('/:c_id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var c_id, star, update, sql;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                c_id = req.params.c_id;
                if (!c_id)
                    return [2 /*return*/, res.status(400).send("Required c_id")];
                return [4 /*yield*/, (0, condb_1.queryAsync)("SELECT * FROM hw5_creators WHERE c_id = ?", [c_id])];
            case 1:
                star = _a.sent();
                if (star.length === 0) {
                    return [2 /*return*/, res.status(404).send("Creator not found")];
                }
                update = __assign(__assign({}, star[0]), req.body);
                sql = "UPDATE hw5_creators SET m_id = ?, p_id = ? where c_id = ?";
                return [4 /*yield*/, condb_1.condb.query(sql, [update.m_id, update.p_id, c_id], function (err, result) {
                        if (err) {
                            return res.status(500).json({
                                msg: "Error updating creator",
                                code: err.code
                            });
                        }
                        return res.json({
                            msg: "Update creator success!",
                            affectedRows: result.affectedRows
                        });
                    })];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
// get a creator by id
router.get('/:c_id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var c_id, sql, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                c_id = req.params.c_id;
                if (!c_id)
                    return [2 /*return*/, res.status(400).send("Required c_id")];
                sql = "SELECT DISTINCT hw5_creators.p_id ,hw5_creators.c_id,hw5_persons.*\n        FROM hw5_creators\n        LEFT JOIN hw5_movies ON hw5_movies.m_id = hw5_creators.m_id\n        LEFT JOIN hw5_persons ON hw5_persons.p_id = hw5_creators.p_id WHERE c_id = ?";
                return [4 /*yield*/, condb_1.condb.query(sql, [c_id], function (err, result) {
                        if (err) {
                            return res.status(500).json({
                                msg: "Get creator error",
                                code: err.code
                            });
                        }
                        return res.json(result);
                    })];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                err_3 = _a.sent();
                return [2 /*return*/, res.status(500).send('Something went wrong!')];
            case 3: return [2 /*return*/];
        }
    });
}); });
// delete a creator by id
router.delete('/:c_id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var c_id, sql, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                c_id = req.params.c_id;
                if (!c_id)
                    return [2 /*return*/, res.status(400).send("Required c_id")];
                sql = "DELETE FROM hw5_creators where c_id = ?";
                return [4 /*yield*/, condb_1.condb.query(sql, [c_id], function (err, result) {
                        if (err)
                            throw err;
                        return res.json({
                            msg: "Delete creator success",
                            affectedRows: result.affectedRows
                        });
                    })];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                err_4 = _a.sent();
                return [2 /*return*/, res.status(500).send('Something went wrong!')];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
