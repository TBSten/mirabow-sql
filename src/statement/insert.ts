import { arrayScope, cap, def, li, opt, or, scope } from "mirabow";
import { expression } from "../expression";
import { selectMatcher } from "./select";
import { ColumnName, TableName } from "./util";

export const insertKey = {
    table: "insert-tbl",
    column: "insert-col",
    values: {
        scope: "insert-values",
        value: "insert-values-value",
    },
    select: "insert-select",
}
const keys = insertKey

const valuesMatcher = def([
    "values",
    li([
        "(",
        arrayScope(keys.values.scope)(
            li(cap(keys.values.value, expression), ",")
        ),
        ")"
    ], ",",),
])
export const insertMatcher = def(
    "insert", "into",
    cap(keys.table, TableName()),
    opt("(",
        li(cap(keys.column, ColumnName), ","),
        ")",
    ),
    or(
        valuesMatcher,
        scope(keys.select)(
            selectMatcher,
        ),
    )
)
