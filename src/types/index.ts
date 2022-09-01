import { AlterTableDetail, CreateTableDetail, DeleteDetail, DropTableDetail, InsertDetail, SelectDetail, UpdateDetail } from "../statement";

export type StatementDetail =
    SelectDetail |
    InsertDetail |
    UpdateDetail |
    DeleteDetail |
    CreateTableDetail |
    AlterTableDetail |
    DropTableDetail

export * from "./detail";
