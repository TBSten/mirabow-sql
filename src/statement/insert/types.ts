import { Column, Expression, Table } from "../../types/detail"
import { SelectDetail } from "../select"
import { StatementBase } from "../statement"

export interface InsertDetail extends StatementBase<"insert"> {
    into: {
        table: Table
        columns: Column[]
    }
    values?: Expression[][]
    select?: SelectDetail
}
