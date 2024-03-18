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
Object.defineProperty(exports, "__esModule", { value: true });
var condb_1 = require("../../utils/condb");
var express = require("express");
var router = express.Router();
// get all persons 
router.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var sql, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                sql = "SELECT * FROM hw5_persons";
                return [4 /*yield*/, condb_1.condb.query(sql, function (err, result) {
                        if (err)
                            throw err;
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
// create a person
router.post('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, p_name, p_categories, p_bio, p_birth_date, p_url, sql, values, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, p_name = _a.p_name, p_categories = _a.p_categories, p_bio = _a.p_bio, p_birth_date = _a.p_birth_date, p_url = _a.p_url;
                // Check if all required properties are present
                if (!p_name || !p_categories || !p_bio || !p_birth_date || !p_url) {
                    return [2 /*return*/, res.status(400).send('Missing required data')];
                }
                sql = "INSERT INTO hw5_persons(p_name, p_categories, p_bio, p_birth_date, p_url) VALUES (?, ?, ?, ?, ?)";
                values = [p_name, p_categories, p_bio, p_birth_date, p_url];
                return [4 /*yield*/, condb_1.condb.query(sql, values, function (err, result) {
                        if (err) {
                            console.log(err);
                            throw err;
                        }
                        return res.json({
                            msg: "Insert person success!"
                        });
                    })];
            case 1:
                _b.sent();
                return [3 /*break*/, 3];
            case 2:
                err_2 = _b.sent();
                console.log(err_2);
                return [2 /*return*/, res.status(500).send('Something went wrong!')];
            case 3: return [2 /*return*/];
        }
    });
}); });
// update a person
router.put('/:p_id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var p_id, person, update, sql, values, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                p_id = req.params.p_id;
                if (!p_id)
                    return [2 /*return*/, res.status(400).send("Required p_id")];
                return [4 /*yield*/, (0, condb_1.queryAsync)("SELECT * FROM hw5_persons WHERE p_id = ?", [p_id])];
            case 1:
                person = _a.sent();
                if (person.length === 0) {
                    return [2 /*return*/, res.status(404).send("Person not found")];
                }
                update = __assign(__assign({}, person[0]), req.body);
                sql = "\n            UPDATE hw5_persons \n            SET p_name = ?, p_categories = ?, p_bio = ?, p_birth_date = ?, p_url = ? \n            WHERE p_id = ?";
                values = [update.p_name, update.p_categories, update.p_bio, update.p_birth_date, update.p_url, p_id];
                return [4 /*yield*/, condb_1.condb.query(sql, values, function (err, result) {
                        if (err) {
                            console.log(err);
                            return res.status(500).send("Error updating person");
                        }
                        return res.json({
                            msg: "Update person success!",
                            affectedRows: result.affectedRows
                        });
                    })];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                err_3 = _a.sent();
                console.log(err_3);
                return [2 /*return*/, res.status(500).send('Something went wrong!')];
            case 4: return [2 /*return*/];
        }
    });
}); });
// get a person by id
router.get('/:p_id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var p_id, sql, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                p_id = req.params.p_id;
                if (!p_id)
                    return [2 /*return*/, res.status(400).send("Required p_id")];
                sql = "SELECT * FROM hw5_persons where p_id = ?";
                return [4 /*yield*/, condb_1.condb.query(sql, [p_id], function (err, result) {
                        if (err)
                            throw err;
                        return res.json(result);
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
// delete a person by id
router.delete('/:p_id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var p_id, sql, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                p_id = req.params.p_id;
                if (!p_id)
                    return [2 /*return*/, res.status(400).send("Required p_id")];
                sql = "DELETE FROM hw5_persons where p_id = ?";
                return [4 /*yield*/, condb_1.condb.query(sql, [p_id], function (err, result) {
                        if (err)
                            throw err;
                        return res.json({
                            msg: "Delete person success",
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
// searching persons by params
router.get('/search', function (req, res) {
    try {
    }
    catch (err) {
    }
});
exports.default = router;
