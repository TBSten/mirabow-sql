import { capture, li, list, opt, or, toMatcher } from "mirabow";
import { expressionMatcher, integerMatcher } from "../expression";
import { ColumnName, TableName } from "./util";
import { where } from "./where";


export const selectMatcher = () => toMatcher(
    "select", li(capture("select-select", expressionMatcher())),
    "from", li(capture("select-from", TableName())),
    opt(where()),
    opt("group", "by", list(ColumnName())),
    opt("order", "by", list(
        [ColumnName(), opt(or("asc", "desc"))],
        ","
    )),
    opt("limit", integerMatcher()),
    opt("offset", integerMatcher()),
)
