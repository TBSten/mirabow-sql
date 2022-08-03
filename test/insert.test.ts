import { MatcherExecutor } from "mirabow";
import { insertMatcher } from "../src";
import { lines } from "./util";



// test.each<[string, Capture]>([
test.each<[string]>([
    //insert into values
    [
        lines(
            "insert into tbl1",
            "values ( 1 , 'abc' , 1234 )",
        ),
    ],
    [
        lines(
            "insert into tbl1( col1 , col2 , col3 )",
            "values ( 1 , 'abc' , 1234 )",
        ),
    ],
    [
        lines(
            "insert into tbl1( col1 , col2 , col3 )",
            "values ( 1 , 'abc' , 1234 ) , ( 2 , 'abc' , 1234 )",
        ),
    ],
    //insert into select
    [
        lines(
            "insert into tbl1( col1 , col2 , col3 )",
            "select col4,col5,col6 from tbl2,tbl3",
        ),
    ],
    [
        lines(
            "insert into tbl1( col1 , col2 , col3 )",
            "select col4 from tbl2 where id = 1001",
        ),
    ],
])("correct insert : %p", (sql) => {
    const matcher = insertMatcher
    const executor = new MatcherExecutor(matcher)
    const out = executor.execute(sql)
    expect(out.isOk)
        .toBe(true)
})

