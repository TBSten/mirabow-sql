import { execute, Tokens } from "mirabow"
import { selectMatcher } from "../src"


const matcher = selectMatcher()
const lines = (...lines: string[]) => lines.join(" ")

describe("", () => { })

// test("select-basic", () => {
//     const data = lines(
//         "select col1",
//         "from tbl1",
//     )
//     const out = execute(matcher, data)
//     expect(out.isOk)
//         .toBe(true)
//     expect(out.capture["select-select"])
//         .toEqual([["col1"],])
//     expect(out.capture["select-from"])
//         .toEqual([["tbl1"],])
// })

test.each<[string, Record<string, Tokens[]>]>([
    //select,from句
    [
        "select col1 from tbl1",
        {
            "select-select": [["col1"]],
            "select-from": [["tbl1"]],
        }
    ],
    //複数列・表
    [
        "select col1,col2 from tbl1,tbl2",
        {
            "select-select": [["col1"], ["col2"]],
            "select-from": [["tbl1"], ["tbl2"]],
        }
    ],
    //where句
    [
        lines(
            "select * from tbl1",
            "where col1=col2",
        ),
        {
            "select-select": [["*"]],
            "select-from": [["tbl1"]]
        }
    ],
    //where句 複数条件
    [
        lines(
            "select * from tbl1",
            "where col1 = col2 and col3 >= col4",
        ),
        {
            "select-select": [["*"]],
            "select-from": [["tbl1"]],
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
            "select-select": [["*"]],
            "select-from": [["tbl1"]],
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
            "select-select": [["col1"]],
            "select-from": [["tbl1"]],
            "select-group-by": [["col1"]],
        }
    ],
    //group by句 複数
    [
        lines(
            "select col1,col2,col3 from tbl1",
            "group by col1,col2,col3,col4",
        ),
        {
            "select-select": [["col1"], ["col2"], ["col3"]],
            "select-from": [["tbl1"]],
            "select-group-by": [["col1"], ["col2"], ["col3"], ["col4"]],
        }
    ],
    //order by句
    [
        lines(
            "select col1,col2 from tbl1",
            "order by col1",
        ),
        {
            "select-select": [["col1"], ["col2"]],
            "select-from": [["tbl1"]],
            "select-order-by": [["col1"]],
        },
    ],
    //order by句 asc,desc
    [
        lines(
            "select col1,col2 from tbl1",
            "order by col1 asc",
        ),
        {
            "select-select": [["col1"], ["col2"]],
            "select-from": [["tbl1"]],
            "select-order-by": [["col1", "asc"]],
        },
    ],
    [
        lines(
            "select col1,col2 from tbl1",
            "order by col1 desc",
        ),
        {
            "select-select": [["col1"], ["col2"]],
            "select-from": [["tbl1"]],
            "select-order-by": [["col1", "desc"]],
        },
    ],
    //order by句 複数
    [
        lines(
            "select col1,col2 from tbl1",
            "order by col1 , col2",
        ),
        {
            "select-select": [["col1"], ["col2"]],
            "select-from": [["tbl1"]],
            "select-order-by": [["col1"], ["col2"]],
        },
    ],
    [
        lines(
            "select col1,col2 from tbl1",
            "order by col1 asc , col2",
        ),
        {
            "select-select": [["col1"], ["col2"]],
            "select-from": [["tbl1"]],
            "select-order-by": [["col1", "asc"], ["col2"]],
        },
    ],
    [
        lines(
            "select col1,col2 from tbl1",
            "order by col1 , col2 desc",
        ),
        {
            "select-select": [["col1"], ["col2"]],
            "select-from": [["tbl1"]],
            "select-order-by": [["col1"], ["col2", "desc"]],
        },
    ],
    [
        lines(
            "select col1,col2 from tbl1",
            "order by col1 asc, col2 desc",
        ),
        {
            "select-select": [["col1"], ["col2"]],
            "select-from": [["tbl1"]],
            "select-order-by": [["col1", "asc"], ["col2", "desc"]],
        },
    ],
    //limit句
    [
        lines(
            "select col1,col2 from tbl1",
            "limit 10",
        ),
        {
            "select-select": [["col1"], ["col2"]],
            "select-from": [["tbl1"]],
            "select-limit": [["10"]],
        },
    ],
    //offset句
    [
        lines(
            "select col1,col2 from tbl1",
            "offset 5",
        ),
        {
            "select-select": [["col1"], ["col2"]],
            "select-from": [["tbl1"]],
            "select-offset": [["5"]],
        },
    ],
])("correct select : %p", (sql, captures) => {
    const out = execute(matcher, sql)
    expect(out.isOk)
        .toBe(true)
    Object.entries(captures).forEach(([capName, capExpect]) => {
        console.log(out);
        expect(out.capture[capName])
            .toEqual(capExpect)
    })
})
