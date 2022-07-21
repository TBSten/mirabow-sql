import { capture, list, opt, toMatcher } from "mirabow";
import { expressionMatcher } from "../expression";
import { where } from "./select";
import { ColumnName, TableName } from "./util";

export const updateMatcher = () => toMatcher(
    "update", capture("update-update", TableName()),
    "set",
    list(
        capture("update-set", [ColumnName(), "=", expressionMatcher()]),
        ","
    ),
    opt(where())
)

