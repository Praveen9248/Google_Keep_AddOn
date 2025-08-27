import Masonry from "react-masonry-css";
import { TrashedNoteCard } from "./index";
import { useNote } from "../contexts";

const TrashList = () => {
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
  const trashedNotes = notes.filter((note) => note.isDeleted);
  return (
    <div>
      <h1 className="text-2xl font-bold">Trashed Notes</h1>
      {trashedNotes.length > 0 && (
        <>
          {" "}
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {" "}
            {trashedNotes.map((note) => (
              <TrashedNoteCard note={note} key={note.$id} />
            ))}{" "}
          </Masonry>
        </>
      )}
    </div>
  );
};

export default TrashList;
