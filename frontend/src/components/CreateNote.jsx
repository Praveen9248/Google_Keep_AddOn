import React, { useState } from "react";
import { useNote } from "../contexts";

const CreateNote = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { createNote } = useNote();

  const handleSubmit = async (data) => {
    data.preventDefault();
    try {
      const res = await createNote({ title: title, content: content });

      if (res) {
        setContent("");
        setTitle("");
        return true;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full">
      <form
        className="flex flex-col items-center justify-center bg-gray-200 dark:bg-gray-700 w-2/3 mx-auto p-5 rounded-xl"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          className="w-full mt-2 border border-solid text-black font-bold bg-white border-white p-2 rounded-xl"
        />
        <textarea
          value={content}
          placeholder="content"
          onChange={(e) => {
            setContent(e.target.value);
          }}
          className="w-full my-2 border border-solid text-black bg-white border-white p-2 rounded-xl h-auto"
        ></textarea>
        <button
          type="submit"
          className="w-full my-2 border border-solid text-black bg-white border-white p-2 rounded-xl hover:bg-green-500"
        >
          Create Note
        </button>
      </form>
    </div>
  );
};

export default CreateNote;
