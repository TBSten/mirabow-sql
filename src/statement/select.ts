import { cap, capture, def, li, list, opt, or, ref, toMatcher } from "mirabow";
import { expressionMatcher, integerMatcher, nullMatcher, stringMatcher } from "../expression";
import { ColumnName, TableName } from "./util";


const whereCondition = () => or(
    //like
    [expressionMatcher(), "like", stringMatcher()],
    //is null
    [expressionMatcher(), "is", opt("not"), nullMatcher()],
    //between
    [expressionMatcher(), opt("not"),
        "between", expressionMatcher(), "and", expressionMatcher()],
    //in
    [expressionMatcher(), opt("not"),
        "in", "(", or(
            ref("select"),
            li(expressionMatcher(), ",")
        ), ")"],
    //exists
    [opt("not"), "exists", "(", ref("select"), ")"],
    //expression
    expressionMatcher(),
)
export const where = () => def("where")(
    "where", list(
        cap("where-condition", whereCondition()),
        or("and", "or")
    )
)



export const selectMatcher = () => toMatcher(
    def("select")(
        "select", opt("distinct"), li(capture("select-select", expressionMatcher())),
        "from", li(capture("select-from", TableName())),
        opt(where()),
        opt("group", "by", list(capture("select-group-by", ColumnName()), ",")),
        opt("order", "by", list(
            capture("select-order-by", [ColumnName(), opt(or("asc", "desc"))]), ","
        )),
        opt("limit", capture("select-limit", integerMatcher())),
        opt("offset", capture("select-offset", integerMatcher())),
    )
)

