import { Configuration, OpenAIApi } from "openai";
import logger from "../../logger/index.js";
export const getAsker = (apiKey, model) => {
    const configuration = new Configuration({
        apiKey
    });
    const openai = new OpenAIApi(configuration);
    return async (query) => {
        const prompt = `
        convert the following text command as a python code with proper indentation without comments without  test cases and without explanation. you should follow each points carefully. 
                    also give the name of the function and dependencies in the below given format
        -------------
                    -the code will be deployed on faas platform
                    -no extra spaces, new lines, or comments or tabs outside the function definition body
                    -do not explain the function
                    -no comments in function body or outside the function definition body
                    -never ever explain function  or code
                    -use snake_case for function name
                    -do not enclose json keys with single  quotes or double quotes
                    -should return a stringified object with function_def, function_name, dependencies as keys
                    -entry function name of python should be same as the function name in json
                    -only external dependencies must be included and dependencies provided by python need not be included 
                    -return in such as way that it can be parsed by JSON.parse like add escape \\ characters if needed
        ------------------
                    example input:- fuzzy search with default "teset"
        
                    example output:-
        ----------------------
    
        
    {"function_def":"import fuzzywuzzy\\nfrom fuzzywuzzy import process\\n\\ndef perform_search(search, choices):\\n\\tresults = process.extractOne(search or \\"teset\\", choices)\\n\\treturn results\\n","name": "perform_search" ,  "dependencies":{"fuzzywuzzy":  "^0.18.0"}}
        
        ------------------------
        Uncommented stringified code for:-
        
        ${query}
        `;
        try {
            const completions = await openai.createCompletion({
                model,
                prompt,
                max_tokens: 2048,
                n: 1,
                stop: null,
                temperature: 1,
            });
            const message = completions.data.choices[0].text;
            try{
                const funcData = JSON.parse(message);
                funcData.language_id = "python";
                return funcData;
            } catch(err){
                throw new Error("Bad Response, Please Regenerate");
            }
        }
        catch (err) {
            const error = err;
            logger.error(error.message);
            throw error;
        }
    };
}


export default getAsker;
