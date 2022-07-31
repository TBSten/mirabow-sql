import { any, arrayScope, cap, def, is, li, or, token, ToMatcherArg } from "mirabow";

export const stringMatcher = def(is(/^('.*')$/))
export const integerMatcher = def(is(/^([0-9]+)$/))
export const numberMatcher = def(is(/^([0-9]+(\.[0-9]+)?)$/))
export const columnMatcher = def(or([[any(), ".", any()]], any()))
export const nullMatcher = def(is("null"))

const uniMatcher = def(() => or(
    [token(), "(", li(expression, ","), ")"], //function call
    ["(", expression, ")"],
    stringMatcher,
    numberMatcher,
    columnMatcher,
    nullMatcher,
))

const doubleOp = (
    name: string,
    op: ToMatcherArg,
    child: ToMatcherArg,
) => def(
    arrayScope(name)(
        li(cap(name + "-target", child), op)
    )
)

export const mulMatcher = def(() => doubleOp("mul", cap("mul-op", or("*", "/")), uniMatcher))
export const addMatcher = def(() => doubleOp("add", cap("add-op", or("+", "-")), mulMatcher))
export const compareMatcher = def(() => doubleOp("compare", cap("compare-op", or("=", "!=", "<>", ">", "<", ">=", "<=",)), addMatcher))
export const expression = def(
    arrayScope("expression")(compareMatcher)
)

