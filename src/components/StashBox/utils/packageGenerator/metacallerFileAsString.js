const file = `
import metacall
langToExtensionMapping = {
    "node": "js"
}
langToFolderMapping = {
    'node': '../node',
}
def createFunction(fn,lang, filename):
    metacall.metacall_load_from_file(lang, [f'{langToFolderMapping[lang]}/{filename}'])
    def func(*args):
        return metacall.metacall(fn, *args)
    return func
`
export default file;