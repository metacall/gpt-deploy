export default function parseFunction(func) {
    const [functionDef, metadataStr] = func.split('$$$$$$');
    const metadata = JSON.parse(metadataStr);
    return {
        function_def: functionDef.trim(),
        name: metadata.function_name,
        parameter_names: metadata.parameter,
    };
}