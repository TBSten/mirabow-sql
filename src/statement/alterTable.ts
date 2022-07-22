import { capture, opt, or, toMatcher } from "mirabow";
import { ColumnDefinition } from "./createTable";
import { ColumnName, TableName } from "./util";

export const alterTableMatcher = () => toMatcher(
    "alter", "table", capture("alter-table-table", TableName()),
    or(
        ["rename", "to", capture("alter-table-rename-table", TableName())],
        ["rename", opt("column"), capture("alter-table-rename-column-before", ColumnName()),
            "to", capture("alter-table-rename-column-after", ColumnName())],
        ["add", opt("column"), capture("alter-table-add-column-def", ColumnDefinition("alter-table-add-column"))],
        ["drop", opt("column"), capture("alter-table-drop-column", ColumnName())],
    ),
)

