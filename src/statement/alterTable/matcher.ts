import { cap, def, opt, or } from "mirabow";
import { ColumnName, TableName } from "../../util/matcher";
import { ColumnDefinition } from "../definition";

export const alterTableKey = {
    table: "alter-table-table",
    rename: {
        table: "alter-table-rename-table",
        column: {
            before: "alter-table-rename-column-before",
            after: "alter-table-rename-column-after",
        },
    },
    add: {
        column: "alter-table-add-column-def",
    },
    drop: {
        column: "alter-table-drop-column",
    },
}
const keys = alterTableKey

export const alterTableMatcher = def(
    "alter", "table", cap(alterTableKey.table, TableName()),
    or(
        ["rename", "to", cap(alterTableKey.rename.table, TableName())],
        ["rename", opt("column"), cap(keys.rename.column.before, ColumnName),
            "to", cap(keys.rename.column.after, ColumnName)],
        ["add", opt("column"), cap(keys.add.column, ColumnDefinition)],
        ["drop", opt("column"), cap(keys.drop.column, ColumnName)],
    ),
)

