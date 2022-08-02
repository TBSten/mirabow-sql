import { arrayScope, capture, def, list, or, repeat } from "mirabow";
import { alterTableMatcher } from "./alterTable";
import { createTableMatcher } from "./createTable";
import { deleteMatcher } from "./delete";
import { dropTableMatcher } from "./dropTable";
import { insertMatcher } from "./insert";
import { selectMatcher } from "./select";
import { updateMatcher } from "./update";

const pre = "sql-statement-"
export const statementsKey = {
    statement: "sql-statement",
    scope: pre + "scope",
    select: pre + "select",
    insert: pre + "insert",
    update: pre + "update",
    delete: pre + "delete",
    createTable: pre + "createTable",
    alterTable: pre + "alterTable",
    dropTable: pre + "dropTable",
}
const keys = statementsKey

export const statementMatcher = def(arrayScope(keys.scope)(
    capture(keys.statement, or(
        capture(keys.select, selectMatcher),
        capture(keys.insert, insertMatcher),
        capture(keys.update, updateMatcher),
        capture(keys.delete, deleteMatcher),
        capture(keys.createTable, createTableMatcher),
        capture(keys.alterTable, alterTableMatcher),
        capture(keys.dropTable, dropTableMatcher),
    ))
))

export const statementsMatcher = def(
    repeat(";"),
    list(
        statementMatcher,
        repeat(";"),
    ),
)


