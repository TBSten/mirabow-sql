import { capture, opt, toMatcher } from "mirabow"
import { where } from "./select"
import { TableName } from "./util"

export const deleteKey = {
    from: "delete-from",
}
const keys = deleteKey

export const deleteMatcher = () => toMatcher(
    "delete", "from", capture(keys.from, TableName()),
    opt(where()),
)

