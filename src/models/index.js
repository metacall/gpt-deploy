import KeyValuePairModel from "./keyValue.model";

export const tableEnum = Object.freeze({
    RESPONSES: 'responses',
    PROMPTS: 'prompts',
    STASHED_KEYS: 'stashed_keys'
})

const keyValueModel = KeyValuePairModel(Object.values(tableEnum))
export function getModel(tableName){
    return keyValueModel[tableName]
}

export default keyValueModel