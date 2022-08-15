import { arrayScope, cap, def, enclosedToken, identifier, integerLiteral, li, MatcherLike, numberLiteral, or } from "mirabow";

export const stringMatcher = def(enclosedToken(`'`))
export const integerMatcher = def(integerLiteral)
export const numberMatcher = def(or(integerLiteral, numberLiteral))
export const columnMatcher = def(or([[identifier(), ".", identifier()]], identifier()))
export const nullMatcher = def("null")

const uniMatcher = def(() => or(
    [identifier(), "(", li(expression, ","), ")"], //function call
    ["(", expression, ")"],
    stringMatcher,
    numberMatcher,
    nullMatcher,
    columnMatcher,
))

const doubleOp = (
    name: string,
    op: MatcherLike,
    child: MatcherLike,
) => def(
    arrayScope(name)(
        li(cap(name + "-target", child), op)
    )
)

export const mulMatcher = def(() => doubleOp("mul", cap("mul-op", or("*", "/")), uniMatcher))
export const addMatcher = def(() => doubleOp("add", cap("add-op", or("+", "-")), mulMatcher))
export const compareMatcher = def(() => doubleOp("compare", cap("compare-op", or("=", "!=", "<>", ">=", "<=", ">", "<",)), addMatcher))
export const expression = def(
    arrayScope("expression")(compareMatcher)
)

