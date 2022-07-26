import { execute } from "mirabow"
import { whereMatcher } from "../src"

test("correct where", () => {
    const out = execute(whereMatcher(), "where 1+2 = 3 and num >= 10")
    expect(out.capture).toEqual(expect.objectContaining({
        "expression": [
            //1+2 = 3
            {
                compare: [
                    {
                        add: [
                            //1 + 2
                            {
                                mul: [
                                    { "mul-target": [["1"]] },
                                    { "mul-target": [["2"]] },
                                ],
                                "add-target": [["1"], ["2"]],
                                "add-op": [["+"]],
                            },
                            //3
                            {
                                mul: [
                                    { "mul-target": [["3"]] }
                                ],
                                "add-target": [["3"]],
                            }
                        ],
                        "compare-target": [["1", "+", "2"], ["3"]],
                        "compare-op": [["="]],
                    }
                ]
            },
            //num >= 10
            {
                compare: [
                    {
                        add: [
                            //num
                            {
                                mul: [
                                    {
                                        column: [["num"]],
                                        "mul-target": [["num"]],
                                    },
                                ],
                                "add-target": [["num"]]
                            },
                            //10
                            {
                                mul: [
                                    {
                                        "mul-target": [["10"]],
                                    },
                                ],
                                "add-target": [["10"]]
                            },
                        ],
                        "compare-target": [["num"], ["10"]],
                        "compare-op": [[">="]]
                    }
                ]
            }
        ],
        "where-condition": [["1", "+", "2", "=", "3"], ["num", ">=", "10"]],
    }))
})
