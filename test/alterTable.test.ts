import { execute, Tokens } from "mirabow";
import { alterTableMatcher } from "../src";
import { lines } from "./util";

const matcher = alterTableMatcher()

test.each<[string, Record<string, Tokens[]>]>([
    //alter table rename table
    [
        lines(
            "alter table tbl1",
            "rename to tbl2",
        ),
        {
            "alter-table-table": [["tbl1"]],
            "alter-table-rename-table": [["tbl2"]],
        },
    ],
    //alter table rename column
    [
        lines(
            "alter table tbl1",
            "rename column col1 to col2",
        ),
        {
            "alter-table-table": [["tbl1"]],
            "alter-table-rename-column-before": [["col1"]],
            "alter-table-rename-column-after": [["col2"]],
        },
    ],
    [
        lines(
            "alter table tbl1",
            "rename col1 to col2",
        ),
        {
            "alter-table-table": [["tbl1"]],
            "alter-table-rename-column-before": [["col1"]],
            "alter-table-rename-column-after": [["col2"]],
        },
    ],
    //alter table add column
    [
        lines(
            "alter table tbl1",
            "add column col1 integer",
        ),
        {
            "alter-table-table": [["tbl1"]],
            "alter-table-add-column": [["col1"]],
            "alter-table-add-column-def": [["col1", "integer"]],
        },
    ],
    [
        lines(
            "alter table tbl1",
            "add col1 integer",
        ),
        {
            "alter-table-table": [["tbl1"]],
            "alter-table-add-column": [["col1"]],
            "alter-table-add-column-def": [["col1", "integer"]],
        },
    ],
    //alter table drop column
    [
        lines(
            "alter table tbl1",
            "drop column col1",
        ),
        {
            "alter-table-table": [["tbl1"]],
            "alter-table-drop-column": [["col1"]],
        },
    ],
    [
        lines(
            "alter table tbl1",
            "drop col1",
        ),
        {
            "alter-table-table": [["tbl1"]],
            "alter-table-drop-column": [["col1"]],
        },
    ],
])("correct create table : %p", (sql, captures) => {
    const out = execute(matcher, sql)
    expect(out.isOk)
        .toBe(true)
    Object.entries(captures).forEach(([capName, capExpect]) => {
        expect(out.capture[capName])
            .toEqual(capExpect)
    })
})

