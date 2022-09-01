import { Capture } from "mirabow";

export const getCapturedSingleToken = (capture: Capture, key: string, joiner: string = "") => {
    const ans = capture[key]?.tokens
        ?.[0].join(joiner)
    return ans
}
export const getCapturedMultiTokens = (capture: Capture, key: string, joiner: string = "") => {
    const ans = capture[key]
        ?.tokens?.map(tokens => tokens.join(joiner))
    return ans
}
