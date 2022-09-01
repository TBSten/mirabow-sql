import { Column, Expression, Table, Where } from "../../types/detail"
import { StatementBase } from "../statement"

export interface UpdateDetail extends StatementBase<"update"> {
    update: Table
    set: [Column, Expression][]
    where?: Where
}
