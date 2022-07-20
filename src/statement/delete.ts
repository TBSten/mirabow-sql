import { opt, toMatcher } from "mirabow"
import { TableName } from "./util"
import { where } from "./where"

export const deleteMatcher = () => toMatcher(
    "delete", "from", TableName(),
    opt(where()),
)

