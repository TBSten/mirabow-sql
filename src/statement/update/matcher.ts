import { arrayScope, cap, def, li, opt } from "mirabow";
import { expression } from "../../expression";
import { ColumnName, TableName } from "../../util/matcher";
import { whereMatcher } from "../where";

export const updateKey = {
    update: "update-update",
    set: {
        scope: "update-set-scope",
        targetColumn: "update-set-target-column",
        data: "update-set-data",
    },
    where: "update-where",
}
const keys = updateKey

export const updateMatcher = def(
    "update", cap(keys.update, TableName()),
    "set",
    li(
        // cap(keys.set, [ColumnName, "=", expression]),
        arrayScope(keys.set.scope)(
            cap(keys.set.targetColumn, ColumnName),
            "=",
            cap(keys.set.data, expression),
        ),
        ","
    ),
    opt(whereMatcher(keys.where))
)

