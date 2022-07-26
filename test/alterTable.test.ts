import { Capture, MatcherExecutor } from "mirabow";
import { alterTableKey, alterTableMatcher } from "../src";
import { columnDefinitionKey } from "../src/statement/definition";
import { lines } from "./util";

const matcher = alterTableMatcher()

test.each<[string, Capture]>([
    //alter table rename table
    [
        lines(
            "alter table tbl1",
            "rename to tbl2",
        ),
        expect.objectContaining({
            [alterTableKey.table]: [["tbl1"]],
            [alterTableKey.rename.table]: [["tbl2"]],
        }),
    ],
    //alter table rename column
    [
        lines(
            "alter table tbl1",
            "rename column col1 to col2",
        ),
        expect.objectContaining({
            [alterTableKey.table]: [["tbl1"]],
            [alterTableKey.rename.column.before]: [["col1"]],
            [alterTableKey.rename.column.after]: [["col2"]],
        }),
    ],
    [
        lines(
            "alter table tbl1",
            "rename col1 to col2",
        ),
        expect.objectContaining({
            [alterTableKey.table]: [["tbl1"]],
            [alterTableKey.rename.column.before]: [["col1"]],
            [alterTableKey.rename.column.after]: [["col2"]],
        }),
    ],
    //alter table add column
    [
        lines(
            "alter table tbl1",
            "add column col1 integer",
        ),
        expect.objectContaining({
            [alterTableKey.table]: [["tbl1"]],
            [alterTableKey.add.column]: [["col1", "integer"]],
            [columnDefinitionKey.name]: [["col1"]],
            [columnDefinitionKey.type]: [["integer"]],
        }),
    ],
    [
        lines(
            "alter table tbl1",
            "add col1 integer",
        ),
        expect.objectContaining({
            [alterTableKey.table]: [["tbl1"]],
            [alterTableKey.add.column]: [["col1", "integer"]],
            [columnDefinitionKey.name]: [["col1"]],
            [columnDefinitionKey.type]: [["integer"]],
        }),
    ],
    //alter table drop column
    [
        lines(
            "alter table tbl1",
            "drop column col1",
        ),
        expect.objectContaining({
            [alterTableKey.table]: [["tbl1"]],
            [alterTableKey.drop.column]: [["col1"]],
        }),
    ],
    [
        lines(
            "alter table tbl1",
            "drop col1",
        ),
        expect.objectContaining({
            [alterTableKey.table]: [["tbl1"]],
            [alterTableKey.drop.column]: [["col1"]],
        }),
    ],
])("correct alter table : %p", (sql, captures) => {
    const executor = new MatcherExecutor(matcher)
    const out = executor.execute(sql)
    expect(out.isOk)
        .toBe(true)
    expect(out.capture)
        .toEqual(captures)
})

