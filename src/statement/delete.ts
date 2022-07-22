import { capture, opt, toMatcher } from "mirabow"
import { where } from "./select"
import { TableName } from "./util"

export const deleteMatcher = () => toMatcher(
    "delete", "from", capture("delete-from", TableName()),
    opt(where()),
)

