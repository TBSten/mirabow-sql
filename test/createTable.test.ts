import { MatcherExecutor } from "mirabow";
import { createTableMatcher } from "../src";
import { lines } from "./util";

const matcher = createTableMatcher

test.each<[string]>([
    //create table
    [
        lines(
            "create table tbl1(",
            "  col1 integer primary key ,",
            "  col2 text ,",
            "  col3 float",
            ")",
        ),
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
    ],
])("correct create table : %p", (sql) => {
    const executor = new MatcherExecutor(matcher)
    const out = executor.execute(sql)
    expect(out.isOk)
        .toBe(true)
})

