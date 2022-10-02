import Head from "next/head";
import Image from "next/image";
import { useState, useEffect } from "react";

import useInterval from "../hooks/useInterval";
import titleToSlug from "../lib/controllers/titleToSlug";

export default function Home() {
  const [screen, setScreen] = useState("prompt"); //can be prompt, writing, or finished
  const [prompt, setPrompt] = useState("Write a blog post about...");
  const [postFileName, setPostFileName] = useState();
  const [postContent, setPostContent] = useState();

  return (
    <div className="bg-black h-screen">
      <Head>
        <title>Auto-Blogger</title>
        <meta name="description" content="Blog Post Generator" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex justify-center flex-col h-full">
        {screen === "prompt" && (
          <>
            <h1 className="text-5xl font-extrabold text-white text-center mb-4">
              Auto-Blogger
            </h1>
            <Input
              prompt={prompt}
              setPrompt={setPrompt}
              setScreen={setScreen}
              setPostContent={setPostContent}
              setPostFileName={setPostFileName}
            />
          </>
        )}

        {screen === "writing" && <ImageLoading />}
        {screen === "finished" && (
          <TextEditor
            postContent={postContent}
            setPostContent={setPostContent}
            postFileName={postFileName}
          />
        )}
      </main>
    </div>
  );
}

const Input = ({
  prompt,
  setPrompt,
  setScreen,
  setPostContent,
  setPostFileName,
}: {
  prompt: string;
  setPrompt: Function;
  setScreen: Function;
  setPostContent: Function;
  setPostFileName: Function;
}) => {
  const handleSubmit = () => {
    setScreen("writing");

    //fetch from api
    fetch("/api/generate-post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        //generate the post slug
        let titleString = data.content.split("\n")[0].replace("#TITLE: ", "");
        let slug = titleToSlug(titleString);
        console.log(slug);
        setPostContent(data.content);
        setPostFileName(slug);
        setScreen("finished");
      });
  };

  return (
    <div className="mt-1 w-full max-w-2xl mx-auto">
      <textarea
        rows={4}
        name="prompt"
        id="prompt"
        className="block w-full border-gray-300 shadow-sm p-4 text-xl font-light focus:outline-none "
        defaultValue={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button
        className="text-xl font-light border -border-white px-8 py-2 text-white w-36 float-right hover:bg-gray-900 my-4"
        onClick={() => handleSubmit()}
      >
        Write It
      </button>
    </div>
  );
};

const ImageLoading = () => {
  const [img, setImg] = useState(1);
  const [counter, setCounter] = useState(0);

  useInterval(() => {
    if (img < 8) setImg(img + 1);
    else setImg(1);
  }, 5000);

  useInterval(() => {
    setCounter(counter + 1);
  }, 1000);

  return (
    <div className="w-full h-full flex flex-col justify-center">
      <div
        className="mx-auto"
        style={{
          animationName: "fadeInAndOut",
          animationDuration: "5s",
          animationIterationCount: "infinite",
        }}
      >
        <Image
          src={`/images/${img}.png`}
          height={400}
          width={400}
          alt={`robot writing: image #${img}`}
          className="mx-auto w-full max-w-[400px] px-8"
          objectFit="contain"
        />
      </div>
      <p className="text-gray-400 text-sm font-light max-w-[400px] mx-auto w-full text-right">
        Run Time: {counter}
      </p>
    </div>
  );
};

const TextEditor = ({
  postContent,
  setPostContent,
  postFileName,
}: {
  postContent: string;
  setPostContent: Function;
  postFileName: string;
}) => {
  const [wordCount, setWordCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setWordCount(postContent.split(" ").length);
  }, [postContent]);

  const editPost = (updatedPost: string) => {
    setPostContent(updatedPost);
  };

  const handleSave = () => {
    //send updated post to server
    setLoading(true);
    fetch("/api/save-changes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: postFileName, content: postContent }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setLoading(false);
      });
  };

  let screenHeight = window.screen.height;
  let rows = screenHeight / 40;

  return (
    <div className="w-full max-w-5xl mx-auto">
      <textarea
        rows={rows}
        name="prompt"
        id="prompt"
        className="block w-full border-gray-300 shadow-sm p-4 text-lg font-light focus:outline-none bg-gray-700 text-gray-300"
        defaultValue={postContent}
        onChange={(e) => editPost(e.target.value)}
      />
      <div className="flex justify-between">
        <p className="text-sm text-white font-light py-2">
          Word Count:{" "}
          <span className="font-bold">
            {new Intl.NumberFormat().format(wordCount)}
          </span>
        </p>
        <button
          className={`text-sm font-light border -border-white px-8 py-2 text-white float-right hover:bg-gray-900 my-4 ${
            loading ? "cursor-wait bg-red-100" : ""
          }'}`}
          onClick={() => handleSave()}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};
