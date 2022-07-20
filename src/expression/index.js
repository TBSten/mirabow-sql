"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressionMatcher = exports.nullMatcher = exports.columnMatcher = exports.numberMatcher = exports.integerMatcher = exports.stringMatcher = void 0;
const mirabow_1 = require("mirabow");
const stringMatcher = () => (0, mirabow_1.is)(/^('.*')$/);
exports.stringMatcher = stringMatcher;
const integerMatcher = () => (0, mirabow_1.is)(/^([0-9]+)$/);
exports.integerMatcher = integerMatcher;
const numberMatcher = () => (0, mirabow_1.is)(/^([0-9]+(\.[0-9]+)?)$/);
exports.numberMatcher = numberMatcher;
const columnMatcher = () => (0, mirabow_1.cap)("column", (0, mirabow_1.or)([[(0, mirabow_1.any)(), ".", (0, mirabow_1.any)()]], (0, mirabow_1.any)()));
exports.columnMatcher = columnMatcher;
const nullMatcher = () => (0, mirabow_1.is)("null");
exports.nullMatcher = nullMatcher;
const uniM = () => {
    return (0, mirabow_1.or)([(0, mirabow_1.any)(), "(", (0, mirabow_1.reference)("expression"), ")"], //function call
    ["(", (0, mirabow_1.reference)("expression"), ")"], (0, exports.stringMatcher)(), (0, exports.numberMatcher)(), (0, exports.columnMatcher)(), (0, exports.nullMatcher)());
};
const mulMatcher = () => {
    const matcher = (0, mirabow_1.or)([(0, mirabow_1.list)([uniM()], (0, mirabow_1.or)("*", "."))]);
    return matcher;
};
const addMatcher = () => {
    const matcher = (0, mirabow_1.or)([(0, mirabow_1.list)([mulMatcher()], (0, mirabow_1.or)("+", "-"))]);
    return matcher;
};
const compareMatcher = () => {
    const matcher = (0, mirabow_1.or)([(0, mirabow_1.list)([addMatcher()], (0, mirabow_1.or)("=", "!=", "<>", ">", "<"))]);
    return matcher;
};
const expressionMatcher = () => (0, mirabow_1.define)("expression")((0, mirabow_1.debug)("[expression]", compareMatcher()));
exports.expressionMatcher = expressionMatcher;
