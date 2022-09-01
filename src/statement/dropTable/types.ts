import { Table } from "../../types/detail"
import { StatementBase } from "../statement"

export interface DropTableDetail extends StatementBase<"dropTable"> {
    table: Table
}
