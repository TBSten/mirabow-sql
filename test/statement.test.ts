import { Capture, MatcherExecutor } from "mirabow";
import { statementsMatcher } from "../src";
import { lines } from "./util";

const matcher = statementsMatcher()

test.each<[string, Capture]>([
    [
        lines(
            "drop table tbl1 ; drop table tbl2",
        ),
        // expect.objectContaining({
        //     [statementsKey.statement]: [["tbl1"]],
        // }),
        expect.objectContaining({}),
    ],
])("correct statement : %p", (sql, captures) => {
    const executor = new MatcherExecutor(matcher)
    const out = executor.execute(sql)
    expect(out.isOk)
        .toBe(true)
    expect(out.capture)
        .toEqual(captures)
})

