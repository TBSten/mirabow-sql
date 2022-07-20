import { capture, list, opt, or, repeat, toMatcher } from "mirabow";
import { expressionMatcher } from "../expression";
import { selectMatcher } from "./select";
import { ColumnName, TableName } from "./util";


export const insertMatcher = () => toMatcher(
    "insert", "into",
    capture("insert-tbl", TableName()),
    opt("(",
        list(capture("insert-col", ColumnName()), ","), ")"
    ),
    or(
        [
            "values",
            repeat("(", list(capture("insert-values", expressionMatcher()), ","), ")")
        ],
        [selectMatcher()]
    )
)

