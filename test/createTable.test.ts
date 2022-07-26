import { Capture, MatcherExecutor } from "mirabow";
import { createTableKey, createTableMatcher } from "../src";
import { columnDefinitionKey, tableDefinitionKey } from "../src/statement/definition";
import { lines } from "./util";

const matcher = createTableMatcher()

test.each<[string, Capture]>([
    //create table
    [
        lines(
            "create table tbl1(",
            "  col1 integer primary key ,",
            "  col2 text ,",
            "  col3 float",
            ")",
        ),
        expect.objectContaining({
            [createTableKey.table]: [["tbl1"]],
            [createTableKey.def.column]: [
                {
                    [columnDefinitionKey.name]: [["col1"]],
                    [columnDefinitionKey.type]: [["integer"]],
                    [columnDefinitionKey.constraint]: [["primary", "key"]],
                    [columnDefinitionKey.primaryKey]: [["primary", "key"]],
                },
                {
                    [columnDefinitionKey.name]: [["col2"]],
                    [columnDefinitionKey.type]: [["text"]],
                },
                {
                    [columnDefinitionKey.name]: [["col3"]],
                    [columnDefinitionKey.type]: [["float"]],
                },
            ],
        }),
    ],
    //table constraint
    [
        lines(
            "create table tbl1(",
            "  col1 integer,",
            "  col2 text ,",
            "  col3 float ,",
            "  primary key (col1)",
            ")",
        ),
        expect.objectContaining({
            [createTableKey.table]: [["tbl1"]],
            [createTableKey.def.column]: [
                {
                    [columnDefinitionKey.name]: [["col1"]],
                    [columnDefinitionKey.type]: [["integer"]],
                },
                {
                    [columnDefinitionKey.name]: [["col2"]],
                    [columnDefinitionKey.type]: [["text"]],
                },
                {
                    [columnDefinitionKey.name]: [["col3"]],
                    [columnDefinitionKey.type]: [["float"]],
                },
            ],
            [createTableKey.def.table]: [
                {
                    [tableDefinitionKey.primaryKey]: [["col1"]]
                },
            ]
        }),
    ],
    //型
    [
        lines(
            "create table tbl1(",
            "  col1 integer primary key ,",
            "  col2 integer unique ,",
            "  col3 integer not null ,",
            "  col4 integer check (col4 >= 6) ,",
            "  col5 integer default 10 ,",
            "  col6 integer references tbl2(colA)",
            ")",
        ),
        expect.objectContaining({
            [createTableKey.table]: [["tbl1"]],
            [createTableKey.def.column]: [
                expect.objectContaining({
                    [columnDefinitionKey.name]: [["col1"]],
                    [columnDefinitionKey.type]: [["integer"]],
                    [columnDefinitionKey.constraint]: [["primary", "key"]],
                    [columnDefinitionKey.primaryKey]: [["primary", "key"]],
                }),
                expect.objectContaining({
                    [columnDefinitionKey.name]: [["col2"]],
                    [columnDefinitionKey.type]: [["integer"]],
                    [columnDefinitionKey.constraint]: [["unique"]],
                    [columnDefinitionKey.unique]: [["unique"]],
                }),
                expect.objectContaining({
                    [columnDefinitionKey.name]: [["col3"]],
                    [columnDefinitionKey.type]: [["integer"]],
                    [columnDefinitionKey.constraint]: [["not", "null"]],
                    [columnDefinitionKey.notNull]: [["not", "null"]],
                }),
                expect.objectContaining({
                    [columnDefinitionKey.name]: [["col4"]],
                    [columnDefinitionKey.type]: [["integer"]],
                    [columnDefinitionKey.constraint]: [["check", "(", "col4", ">=", "6", ")"]],
                    [columnDefinitionKey.check]: [["col4", ">=", "6"]],
                }),
                expect.objectContaining({
                    [columnDefinitionKey.name]: [["col5"]],
                    [columnDefinitionKey.type]: [["integer"]],
                    [columnDefinitionKey.constraint]: [["default", "10"]],
                    [columnDefinitionKey.default]: [["10"]],
                }),
                expect.objectContaining({
                    [columnDefinitionKey.name]: [["col6"]],
                    [columnDefinitionKey.type]: [["integer"]],
                    [columnDefinitionKey.constraint]: [["references", "tbl2", "(", "colA", ")"]],
                    [columnDefinitionKey.references.table]: [["tbl2"]],
                    [columnDefinitionKey.references.column]: [["colA"]],
                }),
            ],
        }),
    ],
])("correct create table : %p", (sql, captures) => {
    const executor = new MatcherExecutor(matcher)
    const out = executor.execute(sql)
    expect(out.isOk)
        .toBe(true)
    expect(out.capture)
        .toEqual(captures)
})

