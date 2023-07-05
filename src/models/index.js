import KeyValuePairModel from "./keyValue.model";

export const tableEnum = Object.freeze({
    RESPONSES: 'responses',
    PROMPTS: 'prompts'
})

const keyValueModel = KeyValuePairModel(Object.values(tableEnum))
export function getModel(tableName){
    return keyValueModel[tableName]
}

export default keyValueModel