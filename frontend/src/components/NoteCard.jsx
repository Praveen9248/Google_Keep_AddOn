import { MdColorLens } from "react-icons/md";
import { MdOutlineImage } from "react-icons/md";
import { TbPinned } from "react-icons/tb";
import { MdOutlineArchive } from "react-icons/md";
import { MdOutlineDelete } from "react-icons/md";
import { useState, useRef } from "react";
import { ID } from "appwrite";
import { useNote } from "../contexts";
import { MdOutlineUnarchive } from "react-icons/md";
import { TbPinnedFilled } from "react-icons/tb";
import { RiGeminiLine } from "react-icons/ri";

const NoteCard = ({ note }) => {
  const { removeNote, addImage, noteStatusHandle, aiNoteHandler } = useNote();
  const fileInputRef = useRef(null);

  const [backgroundColor, setBackgroundColor] = useState(note.color);

  const [showColorPicker, setShowColorPicker] = useState(false);

  const colors = ["#e74c3c", "#2ecc71", "#f1c40f", "#9b59b6"];

  const handleColorBar = () => {
    if (showColorPicker) {
      setShowColorPicker(false);
    } else {
      setShowColorPicker(true);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      addImage(file, note.$id);
    }
  };

  return (
    <div className=" dark:bg-black dark:text-white">
      <div
        className="bg-gray-700 w-full h-auto rounded-xl p-4 group relative"
        style={{ backgroundColor: backgroundColor }}
      >
        <div className="w-full mb-2">
          <div>
            <h1 className="text-xl font-semibold mb-3">{note.title}</h1>
          </div>
          <div>
            {note.imageUrl ? <img src={note.imageUrl} alt="iamge" /> : null}

            <p className="text-base">{note.content}</p>
          </div>
          <br />
          {note.summary ? (
            <div>
              Summary:
              <p>{note.summary}</p>
            </div>
          ) : null}
          <br />
          {note.labels ? (
            <div className="flex flex-wrap gap-x-2">
              {note.labels.map((label) => (
                <p key={label}>{label}</p>
              ))}
            </div>
          ) : null}
        </div>
        <div className="flex justify-between items-center px-1 lg:invisible group-hover:visible text-xl">
          <span>
            <button
              className="hover:bg-gray-400 rounded-full p-2"
              onClick={handleColorBar}
            >
              <MdColorLens />
            </button>
          </span>
          <div
            className={`
            absolute bottom-16 right-2 flex gap-x-2 p-2
            bg-white rounded-lg shadow-md
            ${
              showColorPicker ? "visible" : "invisible"
            } transition-all duration-300 transform
            ${showColorPicker ? "scale-100 opacity-100" : "scale-95 opacity-0"}
            z-10
          `}
          >
            {colors.map((color) => (
              <button
                style={{ backgroundColor: color }}
                className="w-8 h-8 rounded-full border border-gray-300 hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => {
                  setBackgroundColor(color);
                  noteStatusHandle({ color: color }, note.$id);
                  setShowColorPicker(false);
                }}
                key={ID.unique()}
              ></button>
            ))}
          </div>
          <span>
            <button
              className="hover:bg-gray-400 rounded-full p-2"
              onClick={handleImageClick}
            >
              <MdOutlineImage />
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </span>
          <span>
            <button
              className="hover:bg-gray-400 rounded-full p-2"
              onClick={() => {
                noteStatusHandle({ isPinned: !note.isPinned }, note.$id);
              }}
            >
              {note.isPinned ? <TbPinnedFilled /> : <TbPinned />}
            </button>
          </span>
          <span>
            <button
              className="hover:bg-gray-400 rounded-full p-2"
              onClick={() => {
                noteStatusHandle({ isArchived: !note.isArchived }, note.$id);
              }}
            >
              {note.isArchived ? <MdOutlineUnarchive /> : <MdOutlineArchive />}
            </button>
          </span>
          <span>
            <button
              className="hover:bg-gray-400 rounded-full p-2"
              onClick={() => {
                noteStatusHandle({ isDeleted: !note.isDeleted }, note.$id);
              }}
            >
              <MdOutlineDelete />
            </button>
          </span>
          <span>
            <button
              className="hover:bg-gray-400 rounded-full p-2"
              onClick={() => {
                aiNoteHandler(note.$id);
              }}
            >
              <RiGeminiLine />
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
