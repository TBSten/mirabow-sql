import { execute, Tokens } from "mirabow";
import { insertMatcher } from "../src";
import { lines } from "./util";

const matcher = insertMatcher()

test.each<[string, Record<string, Tokens[]>]>([
    //insert into values
    [
        lines(
            "insert into tbl1",
            "values ( 1 , 'abc' , 1234 )",
        ),
        {
            "insert-tbl": [["tbl1"],],
            "insert-values": [["1"], ["'abc'"], ["1234"],],
        },
    ],
    [
        lines(
            "insert into tbl1( col1 , col2 , col3 )",
            "values ( 1 , 'abc' , 1234 )",
        ),
        {
            "insert-tbl": [["tbl1"],],
            "insert-col": [["col1"], ["col2"], ["col3"],],
            "insert-values": [["1"], ["'abc'"], ["1234"],],
        },
    ],
    //insert into select
    [
        lines(
            "insert into tbl1( col1 , col2 , col3 )",
            "select col4,col5,col6 from tbl2,tbl3",
        ),
        {
            "insert-tbl": [["tbl1"],],
            "insert-col": [["col1"], ["col2"], ["col3"],],
            "select-select": [["col4"], ["col5"], ["col6"],],
            "select-from": [["tbl2"], ["tbl3"]],
        },
    ],
    [
        lines(
            "insert into tbl1( col1 , col2 , col3 )",
            "select col4 from tbl2 where id = 1001",
        ),
        {
            "insert-tbl": [["tbl1"],],
            "insert-col": [["col1"], ["col2"], ["col3"],],
            "select-select": [["col4"]],
            "select-from": [["tbl2"]],
            "where-condition": [["id", "=", "1001"]],
        },
    ],
])("correct insert : %p", (sql, captures) => {
    const out = execute(matcher, sql)
    expect(out.isOk)
        .toBe(true)
    Object.entries(captures).forEach(([capName, capExpect]) => {
        expect(out.capture[capName])
            .toEqual(capExpect)
    })
})

