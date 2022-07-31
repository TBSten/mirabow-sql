import { MatcherExecutor } from "mirabow";
import { statementsMatcher } from "../src";
import { lines } from "./util";

const matcher = statementsMatcher

test.each<[string]>([
    [
        lines(
            "drop table tbl1 ; drop table tbl2",
        ),
    ],
])("correct statement : %p", (sql) => {
    const executor = new MatcherExecutor(matcher)
    const out = executor.execute(sql)
    expect(out.isOk)
        .toBe(true)
})

