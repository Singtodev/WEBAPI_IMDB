"use strict";
// To parse this data:
//
//   import { Convert } from "./file";
//
//   const star = Convert.toStar(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Convert = exports.PCategories = exports.MRateTv = exports.MName = exports.MDurationTime = exports.MCategories = void 0;
var MCategories;
(function (MCategories) {
    MCategories["ActionAdventureFantasy"] = "action,adventure,fantasy";
    MCategories["DramaFantasyHorror"] = "drama,fantasy,horror";
})(MCategories || (exports.MCategories = MCategories = {}));
var MDurationTime;
(function (MDurationTime) {
    MDurationTime["The2H28M"] = "2h 28m";
    MDurationTime["The51M"] = "51m";
})(MDurationTime || (exports.MDurationTime = MDurationTime = {}));
var MName;
(function (MName) {
    MName["SpiderManNoWayHome"] = "Spider-Man: No Way Home";
    MName["StrangerThings123"] = "Stranger Things 123";
})(MName || (exports.MName = MName = {}));
var MRateTv;
(function (MRateTv) {
    MRateTv["TVSeries20162025TV14"] = "TV Series , 2016\u20132025 , TV-14";
    MRateTv["The2021PG13"] = "2021 PG-13";
})(MRateTv || (exports.MRateTv = MRateTv = {}));
var PCategories;
(function (PCategories) {
    PCategories["ActorDirectorWriter"] = "Actor,Director,Writer";
    PCategories["ActorProducer"] = "Actor,Producer";
    PCategories["ActorProducerAdditionalCrew"] = "Actor,Producer,Additional Crew";
    PCategories["ActorProducerDirector"] = "Actor,Producer,Director";
    PCategories["ActorProducerSoundtrack"] = "Actor,Producer,Soundtrack";
    PCategories["ActorProducerWriter"] = "Actor,Producer,Writer";
    PCategories["ActressProducerDirector"] = "Actress,Producer,Director";
    PCategories["ActressProducerExecutive"] = "Actress,Producer,Executive";
    PCategories["ActressProducerSoundDepartment"] = "Actress,Producer,Sound Department";
})(PCategories || (exports.PCategories = PCategories = {}));
// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
var Convert = /** @class */ (function () {
    function Convert() {
    }
    Convert.toStar = function (json) {
        return cast(JSON.parse(json), a(r("Star")));
    };
    Convert.starToJson = function (value) {
        return JSON.stringify(uncast(value, a(r("Star"))), null, 2);
    };
    return Convert;
}());
exports.Convert = Convert;
function invalidValue(typ, val, key, parent) {
    if (parent === void 0) { parent = ''; }
    var prettyTyp = prettyTypeName(typ);
    var parentText = parent ? " on ".concat(parent) : '';
    var keyText = key ? " for key \"".concat(key, "\"") : '';
    throw Error("Invalid value".concat(keyText).concat(parentText, ". Expected ").concat(prettyTyp, " but got ").concat(JSON.stringify(val)));
}
function prettyTypeName(typ) {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return "an optional ".concat(prettyTypeName(typ[1]));
        }
        else {
            return "one of [".concat(typ.map(function (a) { return prettyTypeName(a); }).join(", "), "]");
        }
    }
    else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    }
    else {
        return typeof typ;
    }
}
function jsonToJSProps(typ) {
    if (typ.jsonToJS === undefined) {
        var map_1 = {};
        typ.props.forEach(function (p) { return map_1[p.json] = { key: p.js, typ: p.typ }; });
        typ.jsonToJS = map_1;
    }
    return typ.jsonToJS;
}
function jsToJSONProps(typ) {
    if (typ.jsToJSON === undefined) {
        var map_2 = {};
        typ.props.forEach(function (p) { return map_2[p.js] = { key: p.json, typ: p.typ }; });
        typ.jsToJSON = map_2;
    }
    return typ.jsToJSON;
}
function transform(val, typ, getProps, key, parent) {
    if (key === void 0) { key = ''; }
    if (parent === void 0) { parent = ''; }
    function transformPrimitive(typ, val) {
        if (typeof typ === typeof val)
            return val;
        return invalidValue(typ, val, key, parent);
    }
    function transformUnion(typs, val) {
        // val must validate against one typ in typs
        var l = typs.length;
        for (var i = 0; i < l; i++) {
            var typ_1 = typs[i];
            try {
                return transform(val, typ_1, getProps);
            }
            catch (_) { }
        }
        return invalidValue(typs, val, key, parent);
    }
    function transformEnum(cases, val) {
        if (cases.indexOf(val) !== -1)
            return val;
        return invalidValue(cases.map(function (a) { return l(a); }), val, key, parent);
    }
    function transformArray(typ, val) {
        // val must be an array with no invalid elements
        if (!Array.isArray(val))
            return invalidValue(l("array"), val, key, parent);
        return val.map(function (el) { return transform(el, typ, getProps); });
    }
    function transformDate(val) {
        if (val === null) {
            return null;
        }
        var d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }
    function transformObject(props, additional, val) {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        var result = {};
        Object.getOwnPropertyNames(props).forEach(function (key) {
            var prop = props[key];
            var v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach(function (key) {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref);
            }
        });
        return result;
    }
    if (typ === "any")
        return val;
    if (typ === null) {
        if (val === null)
            return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false)
        return invalidValue(typ, val, key, parent);
    var ref = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ))
        return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems") ? transformArray(typ.arrayItems, val)
                : typ.hasOwnProperty("props") ? transformObject(getProps(typ), typ.additional, val)
                    : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number")
        return transformDate(val);
    return transformPrimitive(typ, val);
}
function cast(val, typ) {
    return transform(val, typ, jsonToJSProps);
}
function uncast(val, typ) {
    return transform(val, typ, jsToJSONProps);
}
function l(typ) {
    return { literal: typ };
}
function a(typ) {
    return { arrayItems: typ };
}
function u() {
    var typs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        typs[_i] = arguments[_i];
    }
    return { unionMembers: typs };
}
function o(props, additional) {
    return { props: props, additional: additional };
}
function m(additional) {
    return { props: [], additional: additional };
}
function r(name) {
    return { ref: name };
}
var typeMap = {
    "Star": o([
        { json: "s_id", js: "s_id", typ: 0 },
        { json: "p_id", js: "p_id", typ: 0 },
        { json: "p_name", js: "p_name", typ: "" },
        { json: "p_url", js: "p_url", typ: "" },
        { json: "p_categories", js: "p_categories", typ: r("PCategories") },
        { json: "p_bio", js: "p_bio", typ: "" },
        { json: "p_birth_date", js: "p_birth_date", typ: "" },
        { json: "m_id", js: "m_id", typ: 0 },
        { json: "m_name", js: "m_name", typ: r("MName") },
        { json: "m_rate_tv", js: "m_rate_tv", typ: r("MRateTv") },
        { json: "m_duration_time", js: "m_duration_time", typ: r("MDurationTime") },
        { json: "m_categories", js: "m_categories", typ: r("MCategories") },
        { json: "m_poster", js: "m_poster", typ: "" },
    ], false),
    "MCategories": [
        "action,adventure,fantasy",
        "drama,fantasy,horror",
    ],
    "MDurationTime": [
        "2h 28m",
        "51m",
    ],
    "MName": [
        "Spider-Man: No Way Home",
        "Stranger Things 123",
    ],
    "MRateTv": [
        "TV Series , 2016–2025 , TV-14",
        "2021 PG-13",
    ],
    "PCategories": [
        "Actor,Director,Writer",
        "Actor,Producer",
        "Actor,Producer,Additional Crew",
        "Actor,Producer,Director",
        "Actor,Producer,Soundtrack",
        "Actor,Producer,Writer",
        "Actress,Producer,Director",
        "Actress,Producer,Executive",
        "Actress,Producer,Sound Department",
    ],
};
