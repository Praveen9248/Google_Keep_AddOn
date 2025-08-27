import Masonry from "react-masonry-css";
import { NoteCard } from "./index";
import { useNote } from "../contexts";

const ArchiveList = () => {
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
  const archivedNotes = notes.filter((note) => note.isArchived);
  return (
    <div>
      <h1 className="text-2xl font-bold">Archived Notes</h1>
      {archivedNotes.length > 0 && (
        <>
          {" "}
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {" "}
            {archivedNotes.map((note) => (
              <NoteCard note={note} key={note.$id} />
            ))}{" "}
          </Masonry>
        </>
      )}
    </div>
  );
};

export default ArchiveList;
