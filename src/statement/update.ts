import { cap, def, li, opt } from "mirabow";
import { expression } from "../expression";
import { whereMatcher } from "./select";
import { ColumnName, TableName } from "./util";

export const updateKey = {
    update: "update-update",
    set: "update-set",
}
const keys = updateKey

export const updateMatcher = def(
    "update", cap(keys.update, TableName),
    "set",
    li(
        cap(keys.set, [ColumnName, "=", expression]),
        ","
    ),
    opt(whereMatcher)
)

