import { MatcherExecutor } from "mirabow";
import { insertKey, insertMatcher, selectKey } from "../src";
import { lines } from "./util";


const matcher = insertMatcher()

// test.each<[string, Capture]>([
test.each<[string, any]>([
    //insert into values
    [
        lines(
            "insert into tbl1",
            "values ( 1 , 'abc' , 1234 )",
        ),
        expect.objectContaining({
            [insertKey.table]: [["tbl1"],],
            [insertKey.values.scope]: expect.objectContaining({}),
        }),
    ],
    [
        lines(
            "insert into tbl1( col1 , col2 , col3 )",
            "values ( 1 , 'abc' , 1234 )",
        ),
        expect.objectContaining({
            [insertKey.table]: [["tbl1"],],
            [insertKey.column]: [["col1"], ["col2"], ["col3"],],
            [insertKey.values.scope]: expect.objectContaining({}),
        }),
    ],
    [
        lines(
            "insert into tbl1( col1 , col2 , col3 )",
            "values ( 1 , 'abc' , 1234 ) , ( 2 , 'abc' , 1234 )",
        ),
        expect.objectContaining({
            [insertKey.table]: [["tbl1"],],
            [insertKey.column]: [["col1"], ["col2"], ["col3"],],
            [insertKey.values.scope]: expect.arrayContaining([
                {
                    [insertKey.values.value]: [["1"], ["'abc'"], ["1234"]],
                },
                {
                    [insertKey.values.value]: [["2"], ["'abc'"], ["1234"]],
                },
            ]),
        }),
    ],
    //insert into select
    [
        lines(
            "insert into tbl1( col1 , col2 , col3 )",
            "select col4,col5,col6 from tbl2,tbl3",
        ),
        expect.objectContaining({
            [insertKey.table]: [["tbl1"],],
            [insertKey.column]: [["col1"], ["col2"], ["col3"],],
            [insertKey.select]: expect.objectContaining({
                [selectKey.select]: [["col4"], ["col5"], ["col6"],],
                [selectKey.from]: [["tbl2"], ["tbl3"]],
            }),
        }),
    ],
    [
        lines(
            "insert into tbl1( col1 , col2 , col3 )",
            "select col4 from tbl2 where id = 1001",
        ),
        expect.objectContaining({
            [insertKey.table]: [["tbl1"],],
            [insertKey.column]: [["col1"], ["col2"], ["col3"],],
            [insertKey.select]: expect.objectContaining({
                [selectKey.select]: [["col4"]],
                [selectKey.from]: [["tbl2"]],
                "where-condition": [["id", "=", "1001"]],
            }),
        }),
    ],
])("correct insert : %p", (sql, captures) => {
    const executor = new MatcherExecutor(matcher)
    const out = executor.execute(sql)
    expect(out.isOk)
        .toBe(true)
    expect(out.capture)
        .toEqual(captures)
})

