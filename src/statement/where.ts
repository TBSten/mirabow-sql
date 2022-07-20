import { cap, def, list, opt, or } from "mirabow";
import { expressionMatcher, nullMatcher, stringMatcher } from "../expression";

const whereCondition = () => or(
    [expressionMatcher(), "like", stringMatcher()],
    [expressionMatcher(), "is", opt("not"), nullMatcher()],
    expressionMatcher(),
)
export const where = () => def("where")(
    "where", list([cap("where-condition", whereCondition())], or("AND", "OR"))
)

export const whereKeywords = [
    "where", "AND", "OR", "LIKE"
]

