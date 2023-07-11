import { Configuration, OpenAIApi } from "openai";
import logger from "../../logger/index.js";
export const getAsker = (apiKey, model) => {
    const configuration = new Configuration({
        apiKey
    });
    const openai = new OpenAIApi(configuration);
    return async (query, functionMetadata) => {
        const prompt = `
convert the following text command as a python code with proper indentation without comments without  test cases and without explanation. you should follow each points carefully. 
also give the name of the function, parameter, dependencies and return type in the below given format
-------------
-the code will be deployed on faas platform
-use snake_case for function name
-do not explain the function
-nothing should 
-do not explain or comments in function body or outside the function definition body or JSON object
-entry function name of code should be same as the function name in json
-only external dependencies must be included and dependencies provided in built by python need not be included 
-should only create code for prompt asked inside >>>>>>>>> and <<<<<<<<<
-do not change file extension of import to .py , leave it same as provided in path key of functions metadata 
-should return a stringified object with function_def, function_name, dependencies as keys such that it can be parsed using JSON.parse like use escape \\. 
-Use single quotes as much as possible to avoid escape characters.
-"createFunction" is an API through which we can use functions of other languages. you can import it like this: 
    from metacaller import createFunction
-if you want to create function of other languages  use 
    "__{function_name} = createFunction('node', 'path')"
    to create function of other languages  . Now a function named __{function_name} is valid python function. __ before function name is used to remove any name conflict. 
-metadata functions are not mandatory to use to create code. it shows that we already have this code, you can use it if you need. so import "createFunction" only if you use it to import functions
----------------------
how to import functions 
if extension is .py{
from path import funcName
}
else  if extension is .js{
from metacaller import createFunction
__funcName = createFunction('node', 'path.js')
}
else if extension is .rb{
from metacaller import createFunction
__funcName = createFunction('rb', 'path.rb')    
}
---------------------
I will pass you some functions name and file path as function metadata, you have to import it and use it whenever necessary don't create one again
========================
example input 1:
-----------
\`\`\`
give sum of factorial of 2 numbers

function metadata:- 
{
"calc_factorial": {"path": "calc_factorial.py", 
                    "parameters": [["n": "integer"]],
                    "returns": "integer"
                },
"safeAdd": {"path": "safeAdd.js", 
                    "parameters": [["a": "integer"], ["b", "integer"]],
                "returns": "integer"
                }
}
\`\`\`
example output:-
----------------
{"function_def":"from metacaller import createFunction\\nfrom calc_factorial import calc_factorial\\n__safe_add = createFunction('node','safeAdd.js')\\n\\ndef sum_of_factorial(a,b):\\n\\treturn __safe_add(__calc_factorial(a), __calc_factorial(b))","name": "sum_of_factorial" ,  "dependencies":{}, "parameters": [["a", "integer"], ["b", "integer"]], "returns": "integer", "createFunctionRequired": true}
==========================

example input 2:
----------------
\`\`\`
give sum of factorial of 2 numbers

function metadata:-

{

}

\`\`\`
example output:-
---------------------- 
{"function_def":"import math\\n\\ndef factorial_sum(a, b):\\n\\tsum_factorials = math.factorial(a) + math.factorial(b)\\n\\t","name": "sum_of_factorial" ,  "dependencies":{}, "parameters": [["a", "integer"], ["b", "integer"]], "returns": "integer", "createFunctionRequired": false}
==========================  

give Uncommented parsable stringified JSON for :-
    
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
${query}

function metadata:-

${JSON.stringify(functionMetadata)}
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

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
