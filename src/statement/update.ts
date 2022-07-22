import { cap, li, opt, toMatcher } from "mirabow";
import { expressionMatcher } from "../expression";
import { where } from "./select";
import { ColumnName, TableName } from "./util";

export const updateKey = {
    update: "update-update",
    set: "update-set",
}
const keys = updateKey

export const updateMatcher = () => toMatcher(
    "update", cap(keys.update, TableName()),
    "set",
    li(
        cap(keys.set, [ColumnName(), "=", expressionMatcher()]),
        ","
    ),
    opt(where())
)

