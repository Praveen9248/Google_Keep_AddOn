import React from "react";
import { CreateNote, NoteList } from "../components";

const Notes = () => {
  return (
    <>
      <div className="flex flex-col px-4">
        <div className="w-full">
          <CreateNote />
        </div>
        <div className="w-full mt-5">
          <NoteList />
        </div>
      </div>
    </>
  );
};

export default Notes;
