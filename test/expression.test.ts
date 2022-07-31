import { execute } from "mirabow"
import { whereMatcher } from "../src"

test("correct where", () => {
    const out = execute(whereMatcher, "where 1+2 = 3 and num >= 10")
})
