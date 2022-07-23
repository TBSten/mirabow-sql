import { Capture, MatcherExecutor } from "mirabow";
import { dropTableKey, dropTableMatcher } from "../src";
import { lines } from "./util";

const matcher = dropTableMatcher()

test.each<[string, Capture]>([
    //drop table
    [
        lines(
            "drop table tbl1",
        ),
        expect.objectContaining({
            [dropTableKey.table]: [["tbl1"]],
        }),
    ],
])("correct drop table : %p", (sql, captures) => {
    const executor = new MatcherExecutor(matcher)
    const out = executor.execute(sql)
    expect(out.isOk)
        .toBe(true)
    expect(out.capture)
        .toEqual(captures)
})

