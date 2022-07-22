import { any, cap, li, or, repeat, toMatcher } from "mirabow";
import { expressionMatcher } from "../expression";
import { ColumnName, Identifier, TableName } from "./util";

//type

const IntegerType = () => or(
    "int",
    "integer",
    "tinyint",
    "smallint",
    "mediumint",
    "bigint",
    ["unsigned", "big", "int"],
    "int2",
    "int8"
)
const SizeSpecify = () => ["(", any(), ")"]
const TextType = () => toMatcher(or(
    ["character", SizeSpecify()],
    ["varchar", SizeSpecify()],
    ["varying", "character", SizeSpecify()],
    ["nchar", SizeSpecify()],
    ["native", "character", SizeSpecify()],
    ["nvarchar", SizeSpecify()],
    "text",
    "clob",
))
const BlobType = () => toMatcher("blob")
const RealType = () => toMatcher(or(
    "real",
    "double",
    ["double", "precision"],
    "float",
))
const NumericType = () => toMatcher(or(
    "numeric",
    ["decimal", "(", any(), ",", any(), ")"],
    "boolean",
    "date",
    "datetime",
))
const ColType = () => toMatcher(or(
    IntegerType(),
    TextType(),
    BlobType(),
    RealType(),
    NumericType(),
))

//column definition

const ColConstraint = () => toMatcher(or(
    ["primary", "key"],
    ["not", "null"],
    ["unique"],
    ["check", "(", expressionMatcher(), ")"],
    ["default", expressionMatcher()],
    ["references", TableName(), "(", ColumnName(), ")"]
))
export const ColumnDefinition = (capName: string) => toMatcher([
    cap(capName, Identifier()),
    ColType(),
    repeat(ColConstraint()),
])
//table definition

const TableConstraint = () => or(
    ["primary", "key", "(", li(Identifier(), ","), ")"],
    ["unique", "(", li(Identifier(), ","), ")"],
    ["check", "(", expressionMatcher(), ")"],
    [
        "foreign", "key",
        "(", li(ColumnName(), ","), ")",
        "references", TableName(), "(", li(ColumnName(), ","), ")"
    ]
)
export const TableDefinition = () => toMatcher(TableConstraint());

//create table

export const createTableKey = {
    table: "create-table-table",
    def: {
        column: "create-table-col-def",
        table: "create-table-table-def",
    },
    column: "create-table-col",
}
const keys = createTableKey

export const createTableMatcher = () => toMatcher(
    "create", "table", cap(keys.table, TableName()), "(",
    li(or(
        cap(keys.def.column, ColumnDefinition(keys.column)),
        cap(keys.def.table, TableDefinition()),
    ), ","),
    ")",
)


