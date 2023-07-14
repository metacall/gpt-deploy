import getJSMetadata from './forNode'
import getPythonMetadata from './forPython'

const languageToAskerMapping = {
    node: getJSMetadata,
    python: getPythonMetadata
}
export default function parseCode(code, language_id) {
    return languageToAskerMapping[language_id](code)
}