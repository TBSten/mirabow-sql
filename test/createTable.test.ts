import { execute, Tokens } from "mirabow";
import { createTableMatcher } from "../src";
import { lines } from "./util";

const matcher = createTableMatcher()

test.each<[string, Record<string, Tokens[]>]>([
    //create table
    [
        lines(
            "create table tbl1(",
            "  col1 integer primary key ,",
            "  col2 text ,",
            "  col3 float",
            ")",
        ),
        {
            "create-table-table": [["tbl1"]],
            "create-table-col-def": [
                ["col1", "integer", "primary", "key"],
                ["col2", "text"],
                ["col3", "float"],
            ],
            "create-table-col": [["col1"], ["col2"], ["col3"]],
        },
    ],
    //table constraint
    [
        lines(
            "create table tbl1(",
            "  col1 integer,",
            "  col2 text ,",
            "  col3 float ,",
            "  primary key (col1)",
            ")",
        ),
        {
            "create-table-table": [["tbl1"]],
            "create-table-col-def": [
                ["col1", "integer"],
                ["col2", "text"],
                ["col3", "float"],
            ],
            "create-table-col": [["col1"], ["col2"], ["col3"]],
            "create-table-table-def": [["primary", "key", "(", "col1", ")"]],
        },
    ],
    //型
    [
        lines(
            "create table tbl1(",
            "  col1 integer primary key ,",
            "  col2 integer unique ,",
            "  col3 integer not null ,",
            "  col4 integer check (col4 >= 6) ,",
            "  col5 integer default 10 ,",
            "  col6 integer references tbl2(colA)",
            ")",
        ),
        {
            "create-table-table": [["tbl1"]],
            "create-table-col-def": [
                ["col1", "integer", "primary", "key"],
                ["col2", "integer", "unique"],
                ["col3", "integer", "not", "null"],
                ["col4", "integer", "check", "(", "col4", ">=", "6", ")"],
                ["col5", "integer", "default", "10"],
                ["col6", "integer", "references", "tbl2", "(", "colA", ")"],
            ],
            "create-table-col": [["col1"], ["col2"], ["col3"], ["col4"], ["col5"], ["col6"],],
        },
    ],
])("correct create table : %p", (sql, captures) => {
    const out = execute(matcher, sql)
    expect(out.isOk)
        .toBe(true)
    Object.entries(captures).forEach(([capName, capExpect]) => {
        expect(out.capture[capName])
            .toEqual(capExpect)
    })
})

