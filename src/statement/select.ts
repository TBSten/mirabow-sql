import { cap, capture, def, li, opt, or } from "mirabow";
import { expression, integerMatcher, nullMatcher, stringMatcher } from "../expression";
import { ColumnName, TableName } from "./util";

const whereCondition = def(() => or(
    //like
    [expression, "like", stringMatcher],
    //is null
    [expression, "is", opt("not"), nullMatcher],
    //between
    [expression, opt("not"),
        "between", expression, "and", expression],
    //in
    [expression, opt("not"),
        "in", "(", or(
            selectMatcher,
            li(expression, ",")
        ), ")"],
    //exists
    [opt("not"), "exists", "(", selectMatcher, ")"],
    //expression
    expression,
))
const _whereMatcherFactry = (capName: string = "where-condition") => def("where", li(
    cap(capName, whereCondition),
    or("and", "or")
))
export const whereMatcher = Object.assign(
    (capName: string) => _whereMatcherFactry(capName),
    _whereMatcherFactry(),
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

export const selectMatcher = def(
    "select", opt(capture(keys.distinct, "distinct")), or(cap(keys.select, "*"), li(cap(keys.select, expression), ",")),
    "from", li(cap(keys.from, TableName), ","),
    opt(whereMatcher(keys.where)),
    opt("group", "by", li(cap(keys.groupBy, ColumnName), ",")),
    opt("order", "by", li(
        cap(keys.orderBy, [ColumnName, opt(or("asc", "desc"))]), ","
    )),
    opt("limit", cap(keys.limit, integerMatcher)),
    opt("offset", cap(keys.offset, integerMatcher)),
)

