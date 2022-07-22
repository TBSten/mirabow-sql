import { capture, toMatcher } from "mirabow";
import { TableName } from "./util";

export const dropTableKey = {
    table: "drop-table-table",
}
const keys = dropTableKey

export const dropTableMatcher = () => toMatcher(
    "drop", "table", capture(keys.table, TableName()),
)
