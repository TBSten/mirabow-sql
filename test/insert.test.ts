import { MatcherExecutor, Tokens } from "mirabow";
import { insertKey, insertMatcher, selectKey } from "../src";
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
            [insertKey.table]: [["tbl1"],],
            [insertKey.values]: [["1"], ["'abc'"], ["1234"],],
        },
    ],
    [
        lines(
            "insert into tbl1( col1 , col2 , col3 )",
            "values ( 1 , 'abc' , 1234 )",
        ),
        {
            [insertKey.table]: [["tbl1"],],
            [insertKey.column]: [["col1"], ["col2"], ["col3"],],
            [insertKey.values]: [["1"], ["'abc'"], ["1234"],],
        },
    ],
    //insert into select
    [
        lines(
            "insert into tbl1( col1 , col2 , col3 )",
            "select col4,col5,col6 from tbl2,tbl3",
        ),
        {
            [insertKey.table]: [["tbl1"],],
            [insertKey.column]: [["col1"], ["col2"], ["col3"],],
            [selectKey.select]: [["col4"], ["col5"], ["col6"],],
            [selectKey.from]: [["tbl2"], ["tbl3"]],
        },
    ],
    [
        lines(
            "insert into tbl1( col1 , col2 , col3 )",
            "select col4 from tbl2 where id = 1001",
        ),
        {
            [insertKey.table]: [["tbl1"],],
            [insertKey.column]: [["col1"], ["col2"], ["col3"],],
            [selectKey.select]: [["col4"]],
            [selectKey.from]: [["tbl2"]],
            "where-condition": [["id", "=", "1001"]],
        },
    ],
])("correct insert : %p", (sql, captures) => {
    const executor = new MatcherExecutor(matcher)
    const out = executor.execute(sql)
    expect(out.isOk)
        .toBe(true)
    Object.entries(captures).forEach(([capName, capExpect]) => {
        expect(out.capture[capName])
            .toEqual(capExpect)
    })
})

