import Masonry from "react-masonry-css";
import { useState } from "react";
import { NoteCard, UpdateNoteCard } from "./index";
import { useNote } from "../contexts";

const NoteList = () => {
  const { notes, editingNote, setEditingNote } = useNote();

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };
  if (!notes) {
    return (
      <p className="text-gray-500">No notes present. Please create new.</p>
    );
  }

  function parseNoteContent(note) {
    if (!note?.content) {
      return { ...note, mode: "text", parsedContent: "" };
    }
    try {
      const parsed = JSON.parse(note.content);
      if (Array.isArray(parsed)) {
        return { ...note, mode: "checklist", parsedContent: parsed };
      }
    } catch {
      // fallback
    }
    return { ...note, mode: "text", parsedContent: note.content };
  }

  const visibleNotes = notes.filter(
    (note) => !note.isDeleted && !note.isArchived
  );

  const pinnedNotes = [];
  const unpinnedNotes = [];

  visibleNotes.forEach((note) => {
    const parsed = parseNoteContent(note);
    if (note.isPinned) pinnedNotes.push(parsed);
    else unpinnedNotes.push(parsed);
  });

  if (visibleNotes.length === 0) {
    return <p className="text-gray-500">No notes available. Create one!</p>;
  }
  return (
    <div>
      {pinnedNotes.length > 0 && (
        <>
          <h1 className="text-2xl font-bold pb-3">Pinned Notes</h1>
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {pinnedNotes.map((note) => (
              <NoteCard note={note} key={note.$id} />
            ))}
          </Masonry>
        </>
      )}
      {unpinnedNotes.length > 0 && (
        <>
          <h1 className="text-2xl font-bold pb-3">Unpinned Notes</h1>
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {unpinnedNotes.map((note) => (
              <NoteCard note={note} key={note.$id} />
            ))}
          </Masonry>
        </>
      )}
      {editingNote && <UpdateNoteCard note={editingNote} />}
    </div>
  );
};

export default NoteList;
