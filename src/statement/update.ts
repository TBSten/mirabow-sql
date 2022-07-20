import { capture, list, opt, toMatcher } from "mirabow";
import { expressionMatcher } from "../expression";
import { ColumnName, TableName } from "./util";
import { where } from "./where";

export const updateMatcher = () => toMatcher(
    "update", capture("update-update", ColumnName()),
    "set",
    list(
        capture("update-set", [TableName(), "=", expressionMatcher()]),
        ","
    ),
    opt(where())
)

