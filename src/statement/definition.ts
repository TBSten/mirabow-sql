
//type

import { cap, def, integerLiteral, li, or, repeat } from "mirabow"
import { expression } from "../expression"
import { ColumnName, Identifier, TableName } from "./util"

const IntegerType = def(or(
    "integer",
    "tinyint",
    "smallint",
    "mediumint",
    "bigint",
    ["unsigned", "big", "int"],
    "int8",
    "int2",
    "int",
))
const SizeSpecify = def("(", integerLiteral, ")")
const TextType = def(or(
    ["character", SizeSpecify],
    ["varchar", SizeSpecify],
    ["varying", "character", SizeSpecify],
    ["nchar", SizeSpecify],
    ["native", "character", SizeSpecify],
    ["nvarchar", SizeSpecify],
    "text",
    "clob",
))
const BlobType = def("blob")
const RealType = def(or(
    "real",
    "double",
    ["double", "precision"],
    "float",
))
const NumericType = def(or(
    "numeric",
    ["decimal", "(", integerLiteral, ",", integerLiteral, ")"],
    "boolean",
    "date",
    "datetime",
))
const ColType = def(or(
    IntegerType,
    TextType,
    BlobType,
    RealType,
    NumericType,
))

//column definition

export const columnDefinitionKey = {
    name: "column-definition-name",
    type: "column-definition-type",
    constraint: "column-definition-constraints",
    primaryKey: "column-definition-primary-key",
    notNull: "column-definition-not-null",
    unique: "column-definition-unique",
    check: "column-definition-check",
    default: "column-definition-default",
    references: {
        table: "column-definition-references-table",
        column: "column-definition-references-column",
    },
}

const colKeys = columnDefinitionKey
const ColConstraint = def(or(
    cap(colKeys.primaryKey, ["primary", "key"]),
    cap(colKeys.notNull, ["not", "null"]),
    cap(colKeys.unique, ["unique"]),
    ["check",
        "(",
        cap(colKeys.check, expression),
        ")"],
    ["default",
        cap(colKeys.default, expression)],
    ["references", cap(colKeys.references.table, TableName()),
        "(",
        li(cap(colKeys.references.column, ColumnName), ","),
        ")",
    ],
))
export const ColumnDefinition = def(
    cap(colKeys.name, Identifier()),
    cap(colKeys.type, ColType),
    repeat(cap(colKeys.constraint, ColConstraint)),
)

//table definition

export const tableDefinitionKey = {
    primaryKey: "table-definition-primary-key",
    unique: "table-definition-unique",
    check: "table-definition-check",
    foreignKey: {
        refer: {
            column: "table-definition-foreign-key-refer-column",
        },
        reference: {
            table: "table-definition-foreign-key-reference-table",
            column: "table-definition-foreign-key-reference-column",
        },
    },
}
const tblKeys = tableDefinitionKey
const TableConstraint = def(or(
    ["primary", "key", "(", li(cap(tblKeys.primaryKey, Identifier()), ","), ")"],
    ["unique", "(", li(cap(tblKeys.unique, Identifier()), ","), ")"],
    ["check", "(", cap(tblKeys.check, expression), ")"],
    [
        "foreign", "key",
        "(", li(
            cap(tblKeys.foreignKey.refer.column, ColumnName),
            ","
        ), ")",
        "references",
        cap(tblKeys.foreignKey.reference.table, TableName()), "(",
        li(cap(tblKeys.foreignKey.reference.column, ColumnName), ","),
        ")",
    ],
))
export const TableDefinition = def(TableConstraint);
