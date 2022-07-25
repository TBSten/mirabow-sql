import { arrayScope, cap, li, opt, or, scope, toMatcher } from "mirabow";
import { expressionMatcher } from "../expression";
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

const valuesMatcher = () => [
    "values",
    li([
        "(",
        arrayScope(keys.values.scope)(
            li(cap(keys.values.value, expressionMatcher()), ",")
        ),
        ")"
    ], ",",),
]
export const insertMatcher = () => toMatcher(
    "insert", "into",
    cap(keys.table, TableName()),
    opt("(",
        li(cap(keys.column, ColumnName()), ","),
        ")",
    ),
    or(
        valuesMatcher(),
        scope(keys.select)(
            selectMatcher(),
        ),
    )
)
