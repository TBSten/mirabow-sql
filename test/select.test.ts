import { MatcherExecutor, Tokens } from "mirabow"
import { selectKey, selectMatcher } from "../src"
import { lines } from "./util"


const matcher = selectMatcher()

test.each<[string, Record<string, Tokens[]>]>([
    //select,from句
    [
        "select col1 from tbl1",
        {
            [selectKey.select]: [["col1"]],
            [selectKey.from]: [["tbl1"]],
        }
    ],
    //複数列・表
    [
        "select col1,col2 from tbl1,tbl2",
        {
            [selectKey.select]: [["col1"], ["col2"]],
            [selectKey.from]: [["tbl1"], ["tbl2"]],
        }
    ],
    //where句
    [
        lines(
            "select * from tbl1",
            "where col1=col2",
        ),
        {
            [selectKey.select]: [["*"]],
            [selectKey.from]: [["tbl1"]]
        }
    ],
    //where句 複数条件
    [
        lines(
            "select * from tbl1",
            "where col1 = col2 and col3 >= col4",
        ),
        {
            [selectKey.select]: [["*"]],
            [selectKey.from]: [["tbl1"]],
            "where-condition": [["col1", "=", "col2"], ["col3", ">=", "col4"]],
        }
    ],
    //各比較演算子
    [
        lines(
            "select * from tbl1",
            "where col1 = col2 and col3 != col4 ",
            "or col5 >= col6 and col7 <= col8",
            "or col9 > col10 and col11 < col12",
        ),
        {
            [selectKey.select]: [["*"]],
            [selectKey.from]: [["tbl1"]],
            "where-condition": [
                ["col1", "=", "col2"], ["col3", "!=", "col4"],
                ["col5", ">=", "col6"], ["col7", "<=", "col8"],
                ["col9", ">", "col10"], ["col11", "<", "col12"],
            ],
        }
    ],
    //group by句
    [
        lines(
            "select col1 from tbl1",
            "group by col1",
        ),
        {
            [selectKey.select]: [["col1"]],
            [selectKey.from]: [["tbl1"]],
            [selectKey.groupBy]: [["col1"]],
        }
    ],
    //group by句 複数
    [
        lines(
            "select col1,col2,col3 from tbl1",
            "group by col1,col2,col3,col4",
        ),
        {
            [selectKey.select]: [["col1"], ["col2"], ["col3"]],
            [selectKey.from]: [["tbl1"]],
            [selectKey.groupBy]: [["col1"], ["col2"], ["col3"], ["col4"]],
        }
    ],
    //order by句
    [
        lines(
            "select col1,col2 from tbl1",
            "order by col1",
        ),
        {
            [selectKey.select]: [["col1"], ["col2"]],
            [selectKey.from]: [["tbl1"]],
            [selectKey.orderBy]: [["col1"]],
        },
    ],
    //order by句 asc,desc
    [
        lines(
            "select col1,col2 from tbl1",
            "order by col1 asc",
        ),
        {
            [selectKey.select]: [["col1"], ["col2"]],
            [selectKey.from]: [["tbl1"]],
            [selectKey.orderBy]: [["col1", "asc"]],
        },
    ],
    [
        lines(
            "select col1,col2 from tbl1",
            "order by col1 desc",
        ),
        {
            [selectKey.select]: [["col1"], ["col2"]],
            [selectKey.from]: [["tbl1"]],
            [selectKey.orderBy]: [["col1", "desc"]],
        },
    ],
    //order by句 複数
    [
        lines(
            "select col1,col2 from tbl1",
            "order by col1 , col2",
        ),
        {
            [selectKey.select]: [["col1"], ["col2"]],
            [selectKey.from]: [["tbl1"]],
            [selectKey.orderBy]: [["col1"], ["col2"]],
        },
    ],
    [
        lines(
            "select col1,col2 from tbl1",
            "order by col1 asc , col2",
        ),
        {
            [selectKey.select]: [["col1"], ["col2"]],
            [selectKey.from]: [["tbl1"]],
            [selectKey.orderBy]: [["col1", "asc"], ["col2"]],
        },
    ],
    [
        lines(
            "select col1,col2 from tbl1",
            "order by col1 , col2 desc",
        ),
        {
            [selectKey.select]: [["col1"], ["col2"]],
            [selectKey.from]: [["tbl1"]],
            [selectKey.orderBy]: [["col1"], ["col2", "desc"]],
        },
    ],
    [
        lines(
            "select col1,col2 from tbl1",
            "order by col1 asc, col2 desc",
        ),
        {
            [selectKey.select]: [["col1"], ["col2"]],
            [selectKey.from]: [["tbl1"]],
            [selectKey.orderBy]: [["col1", "asc"], ["col2", "desc"]],
        },
    ],
    //limit句
    [
        lines(
            "select col1,col2 from tbl1",
            "limit 10",
        ),
        {
            [selectKey.select]: [["col1"], ["col2"]],
            [selectKey.from]: [["tbl1"]],
            [selectKey.limit]: [["10"]],
        },
    ],
    //offset句
    [
        lines(
            "select col1,col2 from tbl1",
            "offset 5",
        ),
        {
            [selectKey.select]: [["col1"], ["col2"]],
            [selectKey.from]: [["tbl1"]],
            [selectKey.offset]: [["5"]],
        },
    ],
])("correct select : %p", (sql, captures) => {
    const executor = new MatcherExecutor(matcher)
    const out = executor.execute(sql)
    expect(out.isOk)
        .toBe(true)
    Object.entries(captures).forEach(([capName, capExpect]) => {
        expect(out.capture[capName])
            .toEqual(capExpect)
    })
})
