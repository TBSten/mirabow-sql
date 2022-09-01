import { capture, def, opt } from "mirabow"
import { TableName } from "../../util/matcher"
import { whereMatcher } from "../where"

export const deleteKey = {
    from: "delete-from",
    where: "delete-where",
}
const keys = deleteKey

export const deleteMatcher = def(
    "delete", "from", capture(keys.from, TableName()),
    opt(whereMatcher(keys.where)),
)

