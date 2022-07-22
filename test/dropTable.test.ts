import { execute, Tokens } from "mirabow";
import { dropTableMatcher } from "../src";
import { lines } from "./util";

const matcher = dropTableMatcher()

test.each<[string, Record<string, Tokens[]>]>([
    //drop table
    [
        lines(
            "drop table tbl1",
        ),
        {
            "drop-table-table": [["tbl1"]],
        },
    ],
])("correct drop table : %p", (sql, captures) => {
    const out = execute(matcher, sql)
    expect(out.isOk)
        .toBe(true)
    Object.entries(captures).forEach(([capName, capExpect]) => {
        expect(out.capture[capName])
            .toEqual(capExpect)
    })
})

