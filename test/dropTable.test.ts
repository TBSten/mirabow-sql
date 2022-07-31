import { MatcherExecutor } from "mirabow";
import { dropTableMatcher } from "../src";
import { lines } from "./util";

const matcher = dropTableMatcher

test.each<[string]>([
    //drop table
    [
        lines(
            "drop table tbl1",
        ),
    ],
])("correct drop table : %p", (sql) => {
    const executor = new MatcherExecutor(matcher)
    const out = executor.execute(sql)
    expect(out.isOk)
        .toBe(true)
})

