const fs = require("fs");

export default async function generateGptSections(
  content: string,
  title: string
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    //write content to file
    fs.writeFile(`./posts/${title}.md`, content, function (err) {
      if (err) {
        return console.log(err);
      }
    });

    resolve(content);
  });
}
