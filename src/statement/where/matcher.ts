import { arrayScope, cap, def, li, MatcherLike, opt, or } from "mirabow"
import { selectMatcher } from "../"
import { expression, nullMatcher, stringMatcher } from "../../expression"

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
    _whereMatcherFactry,
    _whereMatcherFactry(),
)
