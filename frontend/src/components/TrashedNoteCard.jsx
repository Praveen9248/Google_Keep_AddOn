import { MdRestoreFromTrash } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import { useNote } from "../contexts";

const TrashedNoteCard = ({ note }) => {
  const { removeNote, noteStatusHandle } = useNote();

  return (
    <div className=" dark:bg-black dark:text-white">
      <div
        className="bg-gray-700 w-full h-auto rounded-xl p-4 group relative"
        style={{ backgroundColor: note.color }}
      >
        <div className="w-full mb-2">
          <div>
            <h1 className="text-xl font-semibold mb-3">{note.title}</h1>
          </div>
          <div>
            {note.imageUrl ? <img src={note.imageUrl} alt="iamge" /> : null}

            <p className="text-base">{note.content}</p>
          </div>
        </div>
        <div className="flex justify-center items-center px-1 lg:invisible group-hover:visible text-xl gap-x-4">
          <span>
            <button
              className="hover:bg-gray-400 rounded-full p-2"
              onClick={() => {
                noteStatusHandle({ isDeleted: !note.isDeleted }, note.$id);
              }}
            >
              <MdRestoreFromTrash />
            </button>
          </span>
          <span>
            <button
              className="hover:bg-gray-400 rounded-full p-2"
              onClick={() => {
                removeNote(note.$id);
              }}
            >
              <MdDeleteForever />
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default TrashedNoteCard;
