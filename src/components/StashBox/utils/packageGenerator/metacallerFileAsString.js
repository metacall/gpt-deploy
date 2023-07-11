const file = `
import metacall
langToExtensionMapping = {
    "node": "js"
}
langToFolderMapping = {
    'node': '../node',
}
def createFunction(lang, funcName):
    metacall.metacall_load_from_file(lang, [f'{langToFolderMapping[lang]}/{funcName}.{langToExtensionMapping[lang]}'])
    def func(*args):
        return metacall.metacall(funcName, *args)
    return func
`
export default file;