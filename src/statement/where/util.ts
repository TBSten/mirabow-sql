import { Capture } from "mirabow"
import { whereKey } from "./matcher"

export const getCapturedWhere = (capture: Capture, key: string) => {
    const where = capture[key]?.arrayScope
        ?.[0]
        ?.[whereKey.or]?.arrayScope?.map(or =>
            or[whereKey.and]?.tokens?.map(and => and.join("")) ?? []
        ) ?? []
    return where
}
