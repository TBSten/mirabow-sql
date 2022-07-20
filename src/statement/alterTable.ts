import { opt, or, toMatcher } from "mirabow";
import { ColumnDefinition } from "./createTable";
import { ColumnName, TableName } from "./util";

export const alterTableMatcher = toMatcher(
    "alter", "table", TableName(),
    or(
        ["rename", "to", TableName()],
        ["rename", opt("column"), ColumnName(), "to", ColumnName()],
        ["add", opt("column"), ColumnDefinition("alter-table-col")],
        ["drop", opt("column"), ColumnName()],
    ),
)

