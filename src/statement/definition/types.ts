import { Column, Expression, Table } from "../../types/detail"

//type types
export type ColumnType =
    IntegerType |
    TextType |
    BlobType |
    RealType |
    NumericType
export type IntegerType = "integer"
export type TextType = "text"
export type BlobType = "blob"
export type RealType = "real"
export type NumericType = "numeric"
//constraint types
export type ColumnConstraint =
    PrimaryKeyColumnConstraint |
    ForeignKeyColumnConstraint |
    NotNullConstraint |
    UniqueConstraint |
    CheckConstraint |
    DefaultConstraint
export type TableConstraint =
    PrimaryKeyTableConstraint |
    ForeignKeyTableConstraint |
    UniqueConstraint |
    CheckConstraint
export type PrimaryKeyColumnConstraint = "primary-key-table"
export type PrimaryKeyTableConstraint = ["primary-key-column", Column[]]
export type ForeignKeyColumnConstraint = ["foreign-key-column", Table, Column]
export type ForeignKeyTableConstraint = ["foreign-key-table", Column[], Table, Column[]]
export type NotNullConstraint = "not-null"
export type UniqueConstraint = "unique"
export type CheckConstraint = ["check", Expression[][]]
export type DefaultConstraint = ["default", Expression]
