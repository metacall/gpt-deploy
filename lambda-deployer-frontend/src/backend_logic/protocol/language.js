/*

* About File:
    this is already documented but it defines the languages supported, extensions, runners, coloring, etc

*/
export const Languages = {
    cs: {
        tag: 'cs',
        displayName: 'C#',
        hexColor: '#953dac',
        fileExtRegex: /^cs$/,
        runnerName: 'csharp',
        runnerFilesRegexes: [/^project\.json$/, /\.csproj$/]
    },
    py: {
        tag: 'py',
        displayName: 'Python',
        hexColor: '#ffd43b',
        fileExtRegex: /^py$/,
        runnerName: 'python',
        runnerFilesRegexes: [/^requirements\.txt$/]
    },
    rb: {
        tag: 'rb',
        displayName: 'Ruby',
        hexColor: '#e53935',
        fileExtRegex: /^rb$/,
        runnerName: 'ruby',
        runnerFilesRegexes: [/^Gemfile$/]
    },
    node: {
        tag: 'node',
        displayName: 'NodeJS',
        hexColor: '#3c873a',
        fileExtRegex: /^js$/,
        runnerName: 'nodejs',
        runnerFilesRegexes: [/^package\.json$/]
    },
    ts: {
        tag: 'ts',
        displayName: 'TypeScript',
        hexColor: '#007acc',
        fileExtRegex: /^(ts|tsx)$/,
        runnerName: 'nodejs',
        runnerFilesRegexes: [/^package\.json$/] // TODO: Use tsconfig instead?
    },
    file: {
        tag: 'file',
        displayName: 'Static Files',
        hexColor: '#de5500',
        fileExtRegex: /^\w+$/,
        runnerName: undefined,
        runnerFilesRegexes: [] // File has no runner files (yet?)
    },
    cob: {
        tag: 'cob',
        displayName: 'Cobol',
        hexColor: '#01325a',
        fileExtRegex: /^(cob|cbl|cbl)$/,
        runnerName: undefined,
        runnerFilesRegexes: [] // Cobol has no runner files (yet?)
    },
    rpc: {
        tag: 'rpc',
        displayName: 'RPC',
        hexColor: '#0f564d',
        fileExtRegex: /^rpc$/,
        runnerName: undefined,
        runnerFilesRegexes: [] // RPC has no runner files (yet?)
    }
};
export const DisplayNameToLanguageId = Object.keys(Languages).reduce((obj, lang) => Object.assign(obj, {
    [Languages[lang].displayName]: lang
}), {});
export const RunnerToDisplayName = (runner) => {
    const displayNameMap = {
        nodejs: 'NPM',
        python: 'Pip',
        ruby: 'Gem',
        csharp: 'NuGet'
    };
    return displayNameMap[runner] || 'Build';
};
//# sourceMappingURL=language.js.map