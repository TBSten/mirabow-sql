import { arrayScope, cap, capture, def, li, MatcherLike, opt, or } from "mirabow";
import { expression, integerMatcher, nullMatcher, stringMatcher } from "../expression";
import { ColumnName, TableName } from "./util";

export const whereKey = {
    default: "where-condition",
    compare: "where-compare",
    like: {
        target: "where-like-target",
        pattern: "where-like-pattern",
    },
    isNull: {
        not: "where-is-null-not",
        target: "where-is-null-target",
    },
    between: {
        not: "where-between-not",
        target: "where-between-target",
        from: "where-between-from",
        to: "where-between-to",
    },
    in: {
        not: "where-in-not",
        target: "where-in-target",
        list: "where-in-list",
        select: "where-in-select",
    },
    exists: {
        not: "where-exists-not",
        select: "where-exists-select",
    },
    or: "where-or",
    and: "where-and",
} as const

const whereCondition = def(() => or(
    //like
    [
        cap(whereKey.like.target, expression),
        "like",
        cap(whereKey.like.pattern, stringMatcher),
    ],
    //is null
    [
        cap(whereKey.isNull.target, expression),
        cap(whereKey.isNull.not, "is"),
        opt("not"),
        nullMatcher,
    ],
    //between
    [
        cap(whereKey.between.target, expression),
        cap(whereKey.between.not, opt("not")),
        "between",
        cap(whereKey.between.from, expression),
        "and",
        cap(whereKey.between.to, expression),
    ],
    //in
    [
        cap(whereKey.in.target, expression),
        cap(whereKey.in.not, opt("not")),
        "in",
        "(",
        or(
            cap(whereKey.in.select, selectMatcher),
            li(
                cap(whereKey.in.list, expression)
                , ","
            )
        ),
        ")"],
    //exists
    [
        cap(whereKey.exists.not, opt("not")),
        "exists",
        "(",
        cap(whereKey.exists.select, selectMatcher),
        ")",
    ],
    //expression
    cap(whereKey.compare, expression),
))
const captureListScope = (name: string, joiner: MatcherLike) => (...childrenMatcher: MatcherLike[]) => {
    return li(
        cap(name, arrayScope(name)(
            childrenMatcher
        ))
        , joiner
    )
}
const _whereMatcherFactry = (capName: string = whereKey.default) => def(
    arrayScope(capName)(
        "where",
        captureListScope(whereKey.or, "or")(
            captureListScope(whereKey.and, "and")(
                whereCondition
            )
        )
    )
)
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

export const selectWhere = def(whereMatcher(keys.where))
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

