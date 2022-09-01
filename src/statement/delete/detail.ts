import { getCapturedSingleToken } from "../../util/detail"
import { getCapturedWhere } from "../where"
import { deleteKey, deleteMatcher } from "./matcher"
import { DeleteDetail } from "./types"

export const setupUpdateDetail = () => {
    deleteMatcher.hook = (out): [DeleteDetail] => {
        const from = getCapturedSingleToken(out.capture, deleteKey.from) ?? ""
        const where = getCapturedWhere(out.capture, deleteKey.where)
        const ans: DeleteDetail = {
            code: out.match.join(" "),
            type: "delete",
            from,
            where,
        }
        return [ans]
    }
}
