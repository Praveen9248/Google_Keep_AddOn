import Masonry from "react-masonry-css";
import { NoteCard } from "./index";
import { useNote } from "../contexts";

const NoteList = () => {
  const { notes } = useNote();
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };
  if (notes === null) {
    return <>No Notes present. Please create new</>;
  }
  const visibleNotes = notes.filter(
    (note) => !note.isDeleted && !note.isArchived
  );

  const pinnedNotes = visibleNotes.filter((note) => note.isPinned);
  const unpinnedNotes = visibleNotes.filter((note) => !note.isPinned);
  return (
    <div>
      {" "}
      {pinnedNotes.length > 0 && (
        <>
          <h1 className="text-2xl font-bold pb-3">Pinned Notes</h1>{" "}
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {" "}
            {pinnedNotes.map((note) => (
              <NoteCard note={note} key={note.$id} />
            ))}{" "}
          </Masonry>
        </>
      )}{" "}
      {unpinnedNotes.length > 0 && (
        <>
          <h1 className="text-2xl font-bold pb-3">Unpinned Notes</h1>
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {" "}
            {unpinnedNotes.map((note) => (
              <NoteCard note={note} key={note.$id} />
            ))}{" "}
          </Masonry>
        </>
      )}
         {" "}
    </div>
  );
};

export default NoteList;
