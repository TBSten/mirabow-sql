import { MatcherExecutor } from "mirabow";
import { updateMatcher } from "../src";
import { lines } from "./util";

const matcher = updateMatcher

test.each<[string]>([
    //update set
    [
        lines(
            "update tbl1",
            "set name = 'abc'",
            "where id = 1"
        ),
    ],
    //複数列を更新
    [
        lines(
            "update tbl1",
            "set",
            "name = 'abc',",
            "old = old + 1",
            "where id = 1",
        ),
    ],
])("correct update : %p", (sql) => {
    const executor = new MatcherExecutor(matcher)
    const out = executor.execute(sql)
    expect(out.isOk)
        .toBe(true)
})

