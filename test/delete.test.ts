import { MatcherExecutor, Tokens } from "mirabow";
import { deleteKey, deleteMatcher } from "../src";
import { lines } from "./util";

const matcher = deleteMatcher()

test.each<[string, Record<string, Tokens[]>]>([
    //delete
    [
        lines(
            "delete from tbl1",
            "where id = 1",
        ),
        {
            [deleteKey.from]: [["tbl1"]],
            "where-condition": [["id", "=", "1"]],
        },
    ],
    [
        lines(
            "delete from tbl1",
        ),
        {
            [deleteKey.from]: [["tbl1"]],
        },
    ],
])("correct delete : %p", (sql, captures) => {
    const executor = new MatcherExecutor(matcher)
    const out = executor.execute(sql)
    expect(out.isOk)
        .toBe(true)
    Object.entries(captures).forEach(([capName, capExpect]) => {
        expect(out.capture[capName])
            .toEqual(capExpect)
    })
})

