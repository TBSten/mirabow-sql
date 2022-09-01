import { Column, Table } from "../../types/detail"
import { ColumnConstraint, ColumnType } from "../definition"
import { StatementBase } from "../statement"

export interface AlterTableDetail extends StatementBase<"alterTable"> {
    table: Table
    rename?: {
        table: Table
        column: {
            from: Column
            to: Column
        }
    }
    add: [Column, ColumnType, ColumnConstraint][]
    drop: Column[]
}
