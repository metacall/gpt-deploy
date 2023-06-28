/*

* About File:
    it defines the structure of the deployments (when we do inspect for example), it also defines the structure of metacall.json

*/
export var LogType;
(function (LogType) {
    LogType["Job"] = "job";
    LogType["Deploy"] = "deploy";
})(LogType || (LogType = {}));
export var ValueId;
(function (ValueId) {
    ValueId[ValueId["METACALL_BOOL"] = 0] = "METACALL_BOOL";
    ValueId[ValueId["METACALL_CHAR"] = 1] = "METACALL_CHAR";
    ValueId[ValueId["METACALL_SHORT"] = 2] = "METACALL_SHORT";
    ValueId[ValueId["METACALL_INT"] = 3] = "METACALL_INT";
    ValueId[ValueId["METACALL_LONG"] = 4] = "METACALL_LONG";
    ValueId[ValueId["METACALL_FLOAT"] = 5] = "METACALL_FLOAT";
    ValueId[ValueId["METACALL_DOUBLE"] = 6] = "METACALL_DOUBLE";
    ValueId[ValueId["METACALL_STRING"] = 7] = "METACALL_STRING";
    ValueId[ValueId["METACALL_BUFFER"] = 8] = "METACALL_BUFFER";
    ValueId[ValueId["METACALL_ARRAY"] = 9] = "METACALL_ARRAY";
    ValueId[ValueId["METACALL_MAP"] = 10] = "METACALL_MAP";
    ValueId[ValueId["METACALL_PTR"] = 11] = "METACALL_PTR";
    ValueId[ValueId["METACALL_FUTURE"] = 12] = "METACALL_FUTURE";
    ValueId[ValueId["METACALL_FUNCTION"] = 13] = "METACALL_FUNCTION";
    ValueId[ValueId["METACALL_NULL"] = 14] = "METACALL_NULL";
    ValueId[ValueId["METACALL_CLASS"] = 15] = "METACALL_CLASS";
    ValueId[ValueId["METACALL_OBJECT"] = 16] = "METACALL_OBJECT";
    ValueId[ValueId["METACALL_SIZE"] = 17] = "METACALL_SIZE";
    ValueId[ValueId["METACALL_INVALID"] = 18] = "METACALL_INVALID";
})(ValueId || (ValueId = {}));
//# sourceMappingURL=deployment.js.map