import { setConfig } from "mirabow"

setConfig({
    ignoreCase: true,
})

export * from "./statement/alterTable"
export * from "./statement/createTable"
export * from "./statement/delete"
export * from "./statement/dropTable"
export * from "./statement/insert"
export * from "./statement/select"
export * from "./statement/update"

