import { execute, Tokens } from "mirabow";
import { updateMatcher } from "../src";
import { lines } from "./util";

const matcher = updateMatcher()

test.each<[string, Record<string, Tokens[]>]>([
    //insert into values
    [
        lines(
            "update tbl1",
            "set name = 'abc'",
            "where id = 1"
        ),
        {
            "update-update": [["tbl1"]],
            "update-set": [["name", "=", "'abc'"]],
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

