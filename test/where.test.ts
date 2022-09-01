import { execute } from "mirabow"
import { whereKey, whereMatcher } from "../src"

test("where", () => {
    const out = execute(whereMatcher, `
        where id = 1 and x = 2 or y = 3
    `)
    //  0     12   2     3   3    4   410
    expect(
        out.capture
            ?.[whereKey.default]?.arrayScope
            ?.[0]           // where句は1度しか出てこない
            ?.[whereKey.or]?.arrayScope?.map(or =>
                or[whereKey.and]?.tokens?.map(tokens => tokens.join(""))
            )
    )
        .toEqual(
            [               //1
                [
                    "id=1", //2
                    "x=2",  //3
                ],
                [
                    "y=3",  //4
                ],
            ],
        )
})
