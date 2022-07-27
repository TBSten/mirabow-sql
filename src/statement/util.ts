import { any, list } from "mirabow";

export const Identifier = () => any()
export const TableName = () => Identifier()
export const ColumnName = () => list(Identifier(), ".")

