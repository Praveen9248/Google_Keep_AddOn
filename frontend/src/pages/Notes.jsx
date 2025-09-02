import React from "react";
import { CreateNote, NoteList, SearchResults } from "../components";
import { useNote } from "../contexts";

const Notes = () => {
  const { searchStatus } = useNote();
  return (
    <>
      {!searchStatus ? (
        <div className="flex flex-col px-4">
          <div className="w-full">
            <CreateNote />
          </div>

          <div className="w-full mt-5">
            <NoteList />
          </div>
        </div>
      ) : (
        <div className="w-full mt-5">
          <SearchResults />
        </div>
      )}
    </>
  );
};

export default Notes;
