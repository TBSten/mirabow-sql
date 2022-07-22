import { MatcherExecutor, Tokens } from "mirabow";
import { createTableKey, createTableMatcher } from "../src";
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
            [createTableKey.table]: [["tbl1"]],
            [createTableKey.def.column]: [
                ["col1", "integer", "primary", "key"],
                ["col2", "text"],
                ["col3", "float"],
            ],
            [createTableKey.column]: [["col1"], ["col2"], ["col3"]],
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
            [createTableKey.table]: [["tbl1"]],
            [createTableKey.def.column]: [
                ["col1", "integer"],
                ["col2", "text"],
                ["col3", "float"],
            ],
            [createTableKey.column]: [["col1"], ["col2"], ["col3"]],
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
            [createTableKey.table]: [["tbl1"]],
            [createTableKey.def.column]: [
                ["col1", "integer", "primary", "key"],
                ["col2", "integer", "unique"],
                ["col3", "integer", "not", "null"],
                ["col4", "integer", "check", "(", "col4", ">=", "6", ")"],
                ["col5", "integer", "default", "10"],
                ["col6", "integer", "references", "tbl2", "(", "colA", ")"],
            ],
            [createTableKey.column]: [["col1"], ["col2"], ["col3"], ["col4"], ["col5"], ["col6"],],
        },
    ],
])("correct create table : %p", (sql, captures) => {
    const executor = new MatcherExecutor(matcher)
    const out = executor.execute(sql)
    expect(out.isOk)
        .toBe(true)
    Object.entries(captures).forEach(([capName, capExpect]) => {
        expect(out.capture[capName])
            .toEqual(capExpect)
    })
})

