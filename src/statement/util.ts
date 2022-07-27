import { list, token } from "mirabow";

export const Identifier = () => token()
export const TableName = () => Identifier()
export const ColumnName = () => list(Identifier(), ".")

