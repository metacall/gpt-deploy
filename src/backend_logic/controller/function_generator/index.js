import nodeAsker from './forNode'
import pythonAsker from './forPython'
const languageToAskerMapping = {
    'node': nodeAsker,
    'python': pythonAsker
}
export const getAsker = (openAIKey, model, language)=>{
    return languageToAskerMapping[language](openAIKey, model)
}