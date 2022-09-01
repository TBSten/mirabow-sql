import { setConfig } from "mirabow"

setConfig({
    ignoreCase: true,
    ignoreString: /(\/\*.*\*\/|\n?--.*\n?|\s)/,
})

export * from "./statement/"

