import { identifier, list } from "mirabow";

export const Identifier = () => identifier()
export const TableName = () => Identifier()
export const ColumnName = list(Identifier(), ".")

