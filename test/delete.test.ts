import { execute, Tokens } from "mirabow";
import { deleteMatcher } from "../src";
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
            "delete-from": [["tbl1"]],
            "where-condition": [["id", "=", "1"]],
        },
    ],
    [
        lines(
            "delete from tbl1",
        ),
        {
            "delete-from": [["tbl1"]],
        },
    ],
])("correct delete : %p", (sql, captures) => {
    const out = execute(matcher, sql)
    expect(out.isOk)
        .toBe(true)
    Object.entries(captures).forEach(([capName, capExpect]) => {
        expect(out.capture[capName])
            .toEqual(capExpect)
    })
})
