import { MatcherExecutor } from "mirabow"
import { selectMatcher } from "../src"
import { lines } from "./util"


const matcher = selectMatcher

test.each<[string]>([
    //select,from句
    [
        "select col1 from tbl1",
    ],
    //複数列・表
    [
        "select col1,col2 from tbl1,tbl2",
    ],
    //where句
    [
        lines(
            "select * from tbl1",
            "where col1=col2",
        ),
    ],
    //where句 複数条件
    [
        lines(
            "select * from tbl1",
            "where col1 = col2 and col3 >= col4",
        ),
    ],
    //各比較演算子
    [
        lines(
            "select * from tbl1",
            "where col1 = col2 and col3 != col4 ",
            "or col5 >= col6 and col7 <= col8",
            "or col9 > col10 and col11 < col12",
        ),
    ],
    //group by句
    [
        lines(
            "select col1 from tbl1",
            "group by col1",
        ),
    ],
    //group by句 複数
    [
        lines(
            "select col1,col2,col3 from tbl1",
            "group by col1,col2,col3,col4",
        ),
    ],
    //order by句
    [
        lines(
            "select col1,col2 from tbl1",
            "order by col1",
        ),
    ],
    //order by句 asc,desc
    [
        lines(
            "select col1,col2 from tbl1",
            "order by col1 asc",
        ),
    ],
    [
        lines(
            "select col1,col2 from tbl1",
            "order by col1 desc",
        ),
    ],
    //order by句 複数
    [
        lines(
            "select col1,col2 from tbl1",
            "order by col1 , col2",
        ),
    ],
    [
        lines(
            "select col1,col2 from tbl1",
            "order by col1 asc , col2",
        ),
    ],
    [
        lines(
            "select col1,col2 from tbl1",
            "order by col1 , col2 desc",
        ),
    ],
    [
        lines(
            "select col1,col2 from tbl1",
            "order by col1 asc, col2 desc",
        ),
    ],
    //limit句
    [
        lines(
            "select col1,col2 from tbl1",
            "limit 10",
        ),
    ],
    //offset句
    [
        lines(
            "select col1,col2 from tbl1",
            "offset 5",
        ),
    ],
])("correct select : %p", (sql) => {
    const executor = new MatcherExecutor(matcher)
    const out = executor.execute(sql)
    expect(out.isOk)
        .toBe(true)
})
