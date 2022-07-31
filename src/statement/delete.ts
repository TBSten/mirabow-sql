import { capture, def, opt } from "mirabow"
import { whereMatcher } from "./select"
import { TableName } from "./util"

export const deleteKey = {
    from: "delete-from",
}
const keys = deleteKey

export const deleteMatcher = def(
    "delete", "from", capture(keys.from, TableName),
    opt(whereMatcher),
)

