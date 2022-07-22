import { capture, toMatcher } from "mirabow";
import { TableName } from "./util";

export const dropTableMatcher = () => toMatcher(
    "drop", "table", capture("drop-table-table", TableName()),
)
