const fs = require("fs");
import gptRequest from "./gptRequest";

export default async function generateGptTitle(
  prompt: string
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const titleTemplate = fs.readFileSync(
      "./lib/gpt-prompts/GEN-TITLE.txt",
      "utf8"
    );

    const titlePrompt = titleTemplate.replaceAll("<<BRIEF>>", prompt);
    let title = await gptRequest(titlePrompt);

    title.replace("TITLE:", "");
    title = title.trim();

    resolve(title);
  });
}
