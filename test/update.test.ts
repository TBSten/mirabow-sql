import { execute, Tokens } from "mirabow";
import { updateKey, updateMatcher } from "../src";
import { lines } from "./util";

const matcher = updateMatcher()

test.each<[string, Record<string, Tokens[]>]>([
    //update set
    [
        lines(
            "update tbl1",
            "set name = 'abc'",
            "where id = 1"
        ),
        {
            [updateKey.update]: [["tbl1"]],
            [updateKey.set]: [["name", "=", "'abc'"]],
            "where-condition": [["id", "=", "1"]],
        },
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
        {
            [updateKey.update]: [["tbl1"]],
            [updateKey.set]: [["name", "=", "'abc'"], ["old", "=", "old", "+", "1"],],
            "where-condition": [["id", "=", "1"]],
        },
    ],
])("correct update : %p", (sql, captures) => {
    const out = execute(matcher, sql)
    expect(out.isOk)
        .toBe(true)
    Object.entries(captures).forEach(([capName, capExpect]) => {
        expect(out.capture[capName])
            .toEqual(capExpect)
    })
})

