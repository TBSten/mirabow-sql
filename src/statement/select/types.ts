import { Column, Expression, Table, Where } from "../../types/detail"
import { StatementBase } from "../statement"

export interface SelectDetail extends StatementBase<"select"> {
    select: Expression[]
    distinct: boolean
    from: Table[]
    where?: Where
    groupBy?: Column[]
    orderBy?: [Column, "asc" | "desc"][]
    limit?: number
    offset?: number
}
