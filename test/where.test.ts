import { execMatcher } from "mirabow"
import { where } from "../src/statement/where"


test("where", () => {
    const data = ["where", "a"]
    const out = execMatcher(where(), data)
    console.log("exec", out?.match)
    expect(out?.match.length)
        .toBe(data.length)
})
