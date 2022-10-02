const { Configuration, OpenAIApi } = require("openai");

export default async function gptRequest(prompt: string): Promise<string> {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  return new Promise(async (resolve, reject) => {
    const openai = new OpenAIApi(configuration);

    const response = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: prompt,
      temperature: 0.7,
      max_tokens: 1500,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    let { data, statusText } = response;

    if (statusText === "OK") {
      let text = data.choices[0].text;
      resolve(text);
    } else reject("request failed");
  });
}
