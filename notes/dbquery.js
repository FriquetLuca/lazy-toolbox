class JSONQuery {
    static isNumeric(value) {
        return /^-?\d+$/.test(value);
    }
    static querySelect(json, select) {
        const queries = [];
        if(!select) {
            return undefined;
        }
        for(let depthName of select.split('.')) {
            const arrays = depthName.split(']');
            queries.push(...arrays);
        }
        const filtered = queries.filter((val) => val.length > 0);
        if(filtered.length === 0) {
            return undefined;
        }
        let currentQuery = json;
        for(let i = 0; i < filtered.length; i++) {
            if(filtered[i].length === 0) {
                continue;
            }
            if(!currentQuery) {
                return undefined;
            }
            const nestedArray = filtered[i].split('[');
            if(nestedArray.length === 1) {
                if(currentQuery[nestedArray[0]]) {
                    currentQuery = currentQuery[nestedArray[0]];
                } else {
                    return undefined;
                }
            } else if(nestedArray.length > 1) {
                if(currentQuery[nestedArray[0]]) {
                    currentQuery = currentQuery[nestedArray[0]][JSONQuery.isNumeric(nestedArray[1]) ? Number(nestedArray[1]) : JSONQuery.querySelect(nestedArray[1])];
                } else {
                    return undefined;
                }
            }
            else {
                return undefined;
            }
        }
        return currentQuery;
    }
    static queryWhere(json, where) {

    }
}

const obj = {
    aProp: 'A property',
    propObj: {
        msg: 'Hewwo',
        nested: {
            alsoNested: {
                lol: 1
            }
        },
        nbr: 25
    },
    anotherPropArray: [
        {
            msg: 'Hewwo',
            nbr: 25
        },
        {
            msg: 'Word',
            nbr: 8
        },
        {
            msg: 'l!',
            nbr: 0
        }
    ]
};
const jsonlog = (x) => console.log(JSON.stringify(x));
jsonlog(JSONQuery.querySelect(obj, 'propName'));
jsonlog(JSONQuery.querySelect(obj, 'propName.subProperty'));
jsonlog(JSONQuery.querySelect(obj, 'propName[0]'));
jsonlog(JSONQuery.querySelect(obj, 'propName[otherProp.foreighKey]'));

/*
Character operator:
$   root element
@   current element
.   child operator
[]  child operator / subscript operator
{}  object concatenator
,   union concatenator

Example:
'select (aProp, {propObj.msg, propObj.nbr as msgId})'

*/
