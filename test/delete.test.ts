import { MatcherExecutor } from "mirabow";
import { deleteMatcher } from "../src";
import { lines } from "./util";

const matcher = deleteMatcher

test.each<[string]>([
    //delete
    [
        lines(
            "delete from tbl1",
            "where id = 1",
        ),
    ],
    [
        lines(
            "delete from tbl1",
        ),
    ],
])("correct delete : %p", (sql) => {
    const executor = new MatcherExecutor(matcher)
    const out = executor.execute(sql)
    expect(out.isOk)
        .toBe(true)
})

