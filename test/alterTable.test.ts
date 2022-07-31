import { MatcherExecutor } from "mirabow";
import { alterTableMatcher } from "../src";
import { lines } from "./util";

const matcher = alterTableMatcher

test.each<[string]>([
    //alter table rename table
    [
        lines(
            "alter table tbl1",
            "rename to tbl2",
        ),
    ],
    //alter table rename column
    [
        lines(
            "alter table tbl1",
            "rename column col1 to col2",
        ),
    ],
    [
        lines(
            "alter table tbl1",
            "rename col1 to col2",
        ),
    ],
    //alter table add column
    [
        lines(
            "alter table tbl1",
            "add column col1 integer",
        ),
    ],
    [
        lines(
            "alter table tbl1",
            "add col1 integer",
        ),
    ],
    //alter table drop column
    [
        lines(
            "alter table tbl1",
            "drop column col1",
        ),
    ],
    [
        lines(
            "alter table tbl1",
            "drop col1",
        ),
    ],
])("correct alter table : %p", (sql) => {
    const executor = new MatcherExecutor(matcher)
    const out = executor.execute(sql)
    expect(out.isOk)
        .toBe(true)
})

