import { any, arrayScope, cap, def, is, li, or, ref, token, ToMatcherArg } from "mirabow";

export const stringMatcher = () => is(/^('.*')$/)
export const integerMatcher = () => is(/^([0-9]+)$/)
export const numberMatcher = () => is(/^([0-9]+(\.[0-9]+)?)$/)
export const columnMatcher = () => or([[any(), ".", any()]], any())
export const nullMatcher = () => is("null")

const uniMatcher = () => {
    return or(
        [token(), "(", li(ref("expression"), ","), ")"], //function call
        ["(", ref("expression"), ")"],
        stringMatcher(),
        numberMatcher(),
        columnMatcher(),
        nullMatcher(),
    )
}

const doubleOp = <R>(
    name: string,
    op: ToMatcherArg<R>,
    child: ToMatcherArg<R>,
) => def(name)(
    arrayScope(name)(
        li(cap(name + "-target", child), op)
    )
)

export const mulMatcher = () => doubleOp("mul", cap("mul-op", or("*", "/")), uniMatcher())
export const addMatcher = () => doubleOp("add", cap("add-op", or("+", "-")), mulMatcher())
export const compareMatcher = () => doubleOp("compare", cap("compare-op", or("=", "!=", "<>", ">", "<", ">=", "<=",)), addMatcher())
export const expressionMatcher = () => def("exp")(
    arrayScope("expression")(compareMatcher())
)

