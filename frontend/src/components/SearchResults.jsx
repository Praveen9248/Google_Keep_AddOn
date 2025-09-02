import { useNote } from "../contexts";
import Masonry from "react-masonry-css";
import { NoteCard } from "./index";
const SearchResults = () => {
  const { searchResults } = useNote();
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };
  if (searchResults === null) {
    return <>No Notes present. Please create new</>;
  }

  return (
    <div>
      {" "}
      {searchResults.length > 0 && (
        <>
          <h1 className="text-2xl font-bold pb-3">Search Results</h1>{" "}
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {" "}
            {searchResults.map((note) => (
              <NoteCard note={note} key={note.$id} />
            ))}{" "}
          </Masonry>
        </>
      )}
    </div>
  );
};

export default SearchResults;
