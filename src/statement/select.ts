import { cap, capture, def, li, opt, or, ref, toMatcher } from "mirabow";
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
export const whereMatcher = (captureName: string = "where-condition") => def("where")(
    "where", li(
        cap(captureName, whereCondition()),
        or("and", "or")
    )
)

export const selectKey = {
    select: "select-select",
    distinct: "select-distinct",
    from: "select-from",
    where: "select-where",
    groupBy: "select-group-by",
    orderBy: "select-order-by",
    limit: "select-limit",
    offset: "select-offset",
}
const keys = selectKey

export const selectMatcher = () => toMatcher(
    "select", opt(capture(keys.distinct, "distinct")), li(cap(keys.select, expressionMatcher()), ","),
    "from", li(cap(keys.from, TableName()), ","),
    opt(whereMatcher(keys.where)),
    opt("group", "by", li(cap(keys.groupBy, ColumnName()), ",")),
    opt("order", "by", li(
        cap(keys.orderBy, [ColumnName(), opt(or("asc", "desc"))]), ","
    )),
    opt("limit", cap(keys.limit, integerMatcher())),
    opt("offset", cap(keys.offset, integerMatcher())),
)

