import getJSMetadata from './forNode'

export default function parseCode(code, language_id) {
    switch(language_id){
        case "node":
            return getJSMetadata(code);
        default:
            return null
    }
}