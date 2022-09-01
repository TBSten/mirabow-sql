
import { Column, Table } from "../../types/detail"
import { ColumnConstraint, ColumnType, TableConstraint } from "../definition"
import { StatementBase } from "../statement"

export interface CreateTableDetail extends StatementBase<"create-table"> {
    table: Table
    columns: [Column, ColumnType, ColumnConstraint][]
    tableConstraints: TableConstraint[]
}
