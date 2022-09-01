
import { getCapturedSingleToken } from "../../util/detail"
import { whereKey } from "../where"
import { updateKey, updateMatcher } from "./matcher"
import { UpdateDetail } from "./types"

export const setupUpdateDetail = () => {
    updateMatcher.hook = (out): [UpdateDetail] => {
        const update = getCapturedSingleToken(out.capture, updateKey.update) ?? ""
        const set = out.capture[updateKey.set.scope]?.arrayScope
            ?.map(scope => {
                const col = scope[updateKey.set.targetColumn]?.tokens
                    ?.[0].join("") ?? ""
                return [col, ""] as [string, string]
            }) ?? []
        const where = out.capture[updateKey.where]?.arrayScope
            ?.[0]
            ?.[whereKey.or]?.arrayScope?.map(or =>
                or[whereKey.and]?.tokens?.map(and => and.join("")) ?? []
            ) ?? []
        const ans: UpdateDetail = {
            code: out.match.join(" "),
            type: "update",
            update,
            set,
            where,
        }
        return [ans]
    }
}
