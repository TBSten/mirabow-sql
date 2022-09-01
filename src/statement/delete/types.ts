import { Table, Where } from "../../types/detail"
import { StatementBase } from "../statement"

export interface DeleteDetail extends StatementBase<"delete"> {
    type: "delete"
    from: Table
    where?: Where
}
