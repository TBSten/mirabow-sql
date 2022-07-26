import { arrayScope, cap, li, or, toMatcher } from "mirabow";
import { ColumnDefinition, TableDefinition } from "./definition";
import { TableName } from "./util";

//create table

export const createTableKey = {
    table: "create-table-table",
    def: {
        column: "create-table-col-def",
        table: "create-table-table-def",
    },
    column: "create-table-col",
}
const keys = createTableKey

export const createTableMatcher = () => toMatcher(
    "create", "table", cap(keys.table, TableName()), "(",
    li(or(
        arrayScope(keys.def.column)(
            ColumnDefinition(),
        ),
        arrayScope(keys.def.table)(
            TableDefinition(),
        )
    ), ","),
    ")",
)


