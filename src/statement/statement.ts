import { list, or, repeat, toMatcher } from "mirabow";
import { alterTableMatcher } from "./alterTable";
import { createTableMatcher } from "./createTable";
import { deleteMatcher } from "./delete";
import { dropTableMatcher } from "./dropTable";
import { insertMatcher } from "./insert";
import { selectMatcher } from "./select";
import { updateMatcher } from "./update";

export const statementMatcher = () => or(
    selectMatcher(),
    insertMatcher(),
    updateMatcher(),
    deleteMatcher(),
    createTableMatcher(),
    alterTableMatcher(),
    dropTableMatcher(),
)

export const statementsMatcher = () => toMatcher(
    repeat(";"),
    list(
        statementMatcher(),
        repeat(";")
    ),
)


