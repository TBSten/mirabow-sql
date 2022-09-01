import { whereKey } from "../where"
import { selectKey, selectMatcher } from "./matcher"
import { SelectDetail } from "./types"

export const setupSelectDetail = () => {
    selectMatcher.hook = (out): [SelectDetail] => {
        const select = out.capture[selectKey.select]
            ?.tokens?.map(tokens => tokens.join("")) ?? []
        const distinct = !!(out.capture[selectKey.distinct]
            ?.tokens)
        const from = out.capture[selectKey.from]
            ?.tokens?.map(tokens => tokens.join("")) ?? []
        const where = out.capture[selectKey.where]?.arrayScope
            ?.[0]
            ?.[whereKey.or]?.arrayScope?.map(or =>
                or[whereKey.and]?.tokens?.map(and => and.join("")) ?? []
            ) ?? []
        const groupBy = out.capture[selectKey.groupBy]
            ?.tokens?.map(tokens => tokens.join("")) ?? []
        const orderBy = (out.capture[selectKey.orderBy]
            ?.tokens?.map(tokens => {
                tokens[1] = tokens[1]?.toLowerCase() ?? "asc"
                return tokens as [string, "asc" | "desc"]
            }) ?? [])
        const limit = parseInt(out.capture[selectKey.limit]
            ?.tokens?.[0].join("") ?? "")
        const offset = parseInt(out.capture[selectKey.offset]
            ?.tokens?.[0].join("") ?? "")
        const ans: SelectDetail = {
            type: "select",
            code: out.match.join(" "),
            select,
            distinct,
            from,
        }
        if (where.length >= 1) ans.where = where
        if (groupBy.length >= 1) ans.groupBy = groupBy
        if (orderBy.length >= 1) ans.orderBy = orderBy
        if (!isNaN(limit)) ans.limit = limit
        if (!isNaN(offset)) ans.offset = offset
        return [
            ans
        ]
    }
}
