import { any, capture, list, or, repeat, toMatcher } from "mirabow";
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
export const ColumnDefinition = (captureName: string) => toMatcher([
    capture(captureName, Identifier()),
    ColType(),
    repeat(ColConstraint()),
])
//table definition

const TableConstraint = () => or(
    ["primary", "key", "(", list(Identifier(), ","), ")"],
    ["unique", "(", list(Identifier(), ","), ")"],
    ["check", "(", expressionMatcher(), ")"],
    [
        "foreign", "key",
        "(", list(ColumnName(), ","), ")",
        "references", TableName(), "(", list(ColumnName(), ","), ")"
    ]
)
export const TableDefinition = () => toMatcher(TableConstraint());

//create table

export const createTableMatcher = () => toMatcher(
    "create", "table", capture("create-table-table", TableName()), "(",
    list(or(
        capture("create-table-col-def", ColumnDefinition("create-table-col")),
        capture("create-table-table-def", TableDefinition()),
    ), ","),
    ")",
)


