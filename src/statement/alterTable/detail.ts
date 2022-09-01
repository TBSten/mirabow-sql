import { alterTableKey, alterTableMatcher } from "./matcher"

export const setupAlterTableDetail = () => {
    alterTableMatcher.hook = (out) => {
        const table = out.capture[alterTableKey.table]?.tokens
            ?.[0].join("") ?? ""
        const renameTable = out.capture[alterTableKey.rename.table]
            ?.tokens?.[0].join("")
        const renameColumnFrom = out.capture[alterTableKey.rename.column.before]
            ?.tokens?.[0].join("")
        const renameColumnTo = out.capture[alterTableKey.rename.column.after]
            ?.tokens?.[0].join("")
        const addColumn = out.capture[alterTableKey.add.column]
            ?.tokens?.map(colTokens => [colTokens[0], colTokens[0], colTokens[0]])
        console.log(out.match.join(" "));
        console.log(
            "table", table,
            "renameTable", renameTable,
            "renameColumnFrom", renameColumnFrom,
            "renameColumnTo", renameColumnTo,
            "addColumn", addColumn,
        );
        console.log("======");
    }
}