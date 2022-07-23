import { cap, li, opt, or, scope, toMatcher } from "mirabow";
import { expressionMatcher } from "../expression";
import { selectMatcher } from "./select";
import { ColumnName, TableName } from "./util";

export const insertKey = {
    table: "insert-tbl",
    column: "insert-col",
    values: "insert-values",
    select: "insert-select",
}
const keys = insertKey

export const insertMatcher = () => toMatcher(
    "insert", "into",
    cap(keys.table, TableName()),
    opt("(",
        li(cap(keys.column, ColumnName()), ","),
        ")",
    ),
    or(
        [
            "values",
            li(
                ["(", li(cap(keys.values, expressionMatcher()), ","), ")"],
                ",",
            ),
        ],
        scope(keys.select)(selectMatcher()),
    )
)
