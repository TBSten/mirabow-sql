import { any, cap, debug, define, is, list, or, reference } from "mirabow";

export const stringMatcher = () => is(/^('.*')$/)
export const integerMatcher = () => is(/^([0-9]+)$/)
export const numberMatcher = () => is(/^([0-9]+(\.[0-9]+)?)$/)
export const columnMatcher = () => cap("column", or([[any(), ".", any()]], any()))
export const nullMatcher = () => is("null")

const uniM = () => {
    return or(
        [any(), "(", reference("expression"), ")"], //function call
        ["(", reference("expression"), ")"],
        stringMatcher(),
        numberMatcher(),
        columnMatcher(),
        nullMatcher(),
    )
}

const mulMatcher = () => {
    const matcher = or(
        [list([uniM()], or("*", "."))],
    )
    return matcher
}
const addMatcher = () => {
    const matcher = or(
        [list([mulMatcher()], or("+", "-"))],
    )
    return matcher
}
const compareMatcher = () => {
    const matcher = or(
        [list([addMatcher()], or("=", "!=", "<>", ">", "<"))],
    )
    return matcher
}
export const expressionMatcher = () => define("expression",)(debug("[expression]", compareMatcher()))

