
import { Configuration, OpenAIApi } from "openai";
export const getModels = async (apiKey) => {
    const configuration = new Configuration({
        apiKey
    });
    const openai = new OpenAIApi(configuration);
    const res = await openai.listModels();
    const modelsList = res.data.data;
    const models = modelsList.map((model) => 
        model.id
    )
    return models;
}

export default getModels;