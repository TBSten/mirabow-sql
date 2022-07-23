import { CaptureNode, MatcherExecutor } from "mirabow";
import { dropTableKey, dropTableMatcher } from "../src";
import { lines } from "./util";

const matcher = dropTableMatcher()

test.each<[string, Record<string, CaptureNode[]>]>([
    //drop table
    [
        lines(
            "drop table tbl1",
        ),
        {
            [dropTableKey.table]: [["tbl1"]],
        },
    ],
])("correct drop table : %p", (sql, captures) => {
    const executor = new MatcherExecutor(matcher)
    const out = executor.execute(sql)
    expect(out.isOk)
        .toBe(true)
    Object.entries(captures).forEach(([capName, capExpect]) => {
        expect(out.capture[capName])
            .toEqual(capExpect)
    })
})

