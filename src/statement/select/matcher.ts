
import { cap, capture, def, li, opt, or } from "mirabow";
import { expression, integerMatcher } from "../../expression";
import { ColumnName, TableName } from "../../util/matcher";
import { whereMatcher } from "../where";


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
// export const selectWhere = def(whereMatcher(keys.where))
export const selectMatcher = def(
    "select", opt(capture(keys.distinct, "distinct")), or(cap(keys.select, "*"), li(cap(keys.select, expression), ",")),
    "from", li(cap(keys.from, TableName()), ","),
    opt(whereMatcher(keys.where)),
    opt("group", "by", li(cap(keys.groupBy, ColumnName), ",")),
    opt("order", "by", li(
        cap(keys.orderBy, [ColumnName, opt(or("asc", "desc"))]), ","
    )),
    opt("limit", cap(keys.limit, integerMatcher)),
    opt("offset", cap(keys.offset, integerMatcher)),
)

