import { SelectDetail } from "../select"
import { insertKey, insertMatcher } from "./matcher"
import { InsertDetail } from "./types"

export const setupInsertDetail = () => {
    insertMatcher.hook = (out): [InsertDetail] => {
        const intoTbl = out.capture[insertKey.table]?.tokens
            ?.[0].join("") ?? ""
        const intoCols = out.capture[insertKey.column]
            ?.tokens?.map(tokens => tokens.join(" ")) ?? []
        const into = {
            table: intoTbl,
            columns: intoCols,
        }
        const values = out.capture[insertKey.values.scope]
            ?.arrayScope?.map(valueList =>
                valueList[insertKey.values.value]?.tokens?.map(tokens => tokens.join(" ")) ?? []
            )
        const select = out.capture[insertKey.select]
            ?.scope
        const selectDetail = out.result[out.result.length - 1] as SelectDetail
        const ans: InsertDetail = {
            code: out.match.join(" "),
            type: "insert",
            into,
        }
        if (values) ans.values = values
        if (select) ans.select = selectDetail
        return [ans]
    }
}