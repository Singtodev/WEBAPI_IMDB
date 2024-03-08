// To parse this data:
//
//   import { Convert } from "./file";
//
//   const star = Convert.toStar(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface Star {
    s_id:            number;
    p_id:            number;
    p_name:          string;
    p_url:           string;
    p_categories:    PCategories;
    p_bio:           string;
    p_birth_date:    string;
    m_id:            number;
    m_name:          MName;
    m_rate_tv:       MRateTv;
    m_duration_time: MDurationTime;
    m_categories:    MCategories;
    m_poster:        string;
}

export enum MCategories {
    ActionAdventureFantasy = "action,adventure,fantasy",
    DramaFantasyHorror = "drama,fantasy,horror",
}

export enum MDurationTime {
    The2H28M = "2h 28m",
    The51M = "51m",
}

export enum MName {
    SpiderManNoWayHome = "Spider-Man: No Way Home",
    StrangerThings123 = "Stranger Things 123",
}

export enum MRateTv {
    TVSeries20162025TV14 = "TV Series , 2016–2025 , TV-14",
    The2021PG13 = "2021 PG-13",
}

export enum PCategories {
    ActorDirectorWriter = "Actor,Director,Writer",
    ActorProducer = "Actor,Producer",
    ActorProducerAdditionalCrew = "Actor,Producer,Additional Crew",
    ActorProducerDirector = "Actor,Producer,Director",
    ActorProducerSoundtrack = "Actor,Producer,Soundtrack",
    ActorProducerWriter = "Actor,Producer,Writer",
    ActressProducerDirector = "Actress,Producer,Director",
    ActressProducerExecutive = "Actress,Producer,Executive",
    ActressProducerSoundDepartment = "Actress,Producer,Sound Department",
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toStar(json: string): Star[] {
        return cast(JSON.parse(json), a(r("Star")));
    }

    public static starToJson(value: Star[]): string {
        return JSON.stringify(uncast(value, a(r("Star"))), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? ` on ${parent}` : '';
    const keyText = key ? ` for key "${key}"` : '';
    throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`;
        } else {
            return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
        }
    } else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    } else {
        return typeof typ;
    }
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key, parent);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val, key, parent);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false) return invalidValue(typ, val, key, parent);
    let ref: any = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
    return { literal: typ };
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
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
