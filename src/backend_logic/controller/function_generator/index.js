import nodeAsker from './forNode'
import pythonAsker from './forPython'
import languageIdToExtensionMapping from '../../../constants/languageIdToExtensionMapping'

const languageToAskerMapping = {
    node: nodeAsker,
    python: pythonAsker
}
export const getAsker = (openAIKey, model, language)=>{
    return languageToAskerMapping[language](openAIKey, model)
}

export const generateFunctionMetadata = (responses) => {
    const functionMetadata = {}
    responses.forEach(response=>{
        const {name, parameters, returns, language_id} = response
        functionMetadata[name] = {
            path: `${name}.${languageIdToExtensionMapping[language_id]}`,
            parameters,
            returns
        }
    })
    return functionMetadata
}
