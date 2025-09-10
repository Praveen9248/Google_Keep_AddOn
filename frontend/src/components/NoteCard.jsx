import {
  MdColorLens,
  MdOutlineImage,
  MdOutlineArchive,
  MdOutlineDelete,
  MdOutlineUnarchive,
} from "react-icons/md";
import { TbPinned, TbPinnedFilled } from "react-icons/tb";
import { RiGeminiLine } from "react-icons/ri";
import { useState, useRef } from "react";
import { useNote } from "../contexts";

const NoteCard = ({ note }) => {
  const {
    uploadImage,
    updateNote,
    noteStatusHandle,
    aiNoteHandler,
    setEditingNote,
  } = useNote();
  const fileInputRef = useRef(null);
  const [backgroundColor, setBackgroundColor] = useState(note.color);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [images, setImages] = useState(note.imageUrl || []);

  const colors = ["#e74c3c", "#2ecc71", "#f1c40f", "#9b59b6"];

  const handleImageClick = (e) => {
    e.stopPropagation();
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    try {
      if (file) {
        const url = await uploadImage(file);
        const newImages = [...images, url];
        setImages(newImages);

        const res = await updateNote({ imageUrl: newImages }, note.$id);
        if (res) {
          console.log("done");
        } else {
          console.log("try again");
        }
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="dark:bg-black dark:text-white">
      <div
        className="bg-gray-700 w-full h-auto rounded-xl p-4 group relative cursor-pointer"
        style={{ backgroundColor }}
      >
        <div
          className="w-full mb-2"
          onClick={() => {
            setEditingNote(note);
          }}
        >
          {images.length > 0 &&
            images.map((image, idx) => (
              <img
                src={image}
                alt="note"
                className="rounded-md max-h-60 object-cover mb-2"
                key={idx}
              />
            ))}

          <h1 className="text-xl font-semibold mb-3">{note.title}</h1>
          <p className="text-base">{note.content}</p>

          {note.summary && (
            <div className="mt-2">
              <span className="font-medium">Summary:</span>
              <p>{note.summary}</p>
            </div>
          )}

          {note.labels && (
            <div className="flex flex-wrap gap-2 mt-2">
              {note.labels.map((label) => (
                <span
                  key={label}
                  className="px-2 py-1 bg-gray-200 text-sm rounded-full text-gray-700"
                >
                  {label}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Toolbar */}
        <div className="flex justify-between items-center px-1 lg:invisible group-hover:visible text-xl">
          <button
            className="hover:bg-gray-400 rounded-full p-2"
            onClick={() => {
              setShowColorPicker((prev) => !prev);
            }}
          >
            <MdColorLens />
          </button>

          {/* Color Picker */}
          <div
            className={`
              absolute bottom-16 right-2 flex gap-x-2 p-2
              bg-white rounded-lg shadow-md
              ${
                showColorPicker
                  ? "visible scale-100 opacity-100"
                  : "invisible scale-95 opacity-0"
              }
              transition-all duration-300 transform z-10
            `}
          >
            {colors.map((color) => (
              <button
                key={color}
                style={{ backgroundColor: color }}
                className="w-8 h-8 rounded-full border border-gray-300 hover:scale-110 transition-transform"
                onClick={() => {
                  setBackgroundColor(color);
                  noteStatusHandle({ color }, note.$id);
                  setShowColorPicker(false);
                }}
              ></button>
            ))}
          </div>

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

          <button
            className="hover:bg-gray-400 rounded-full p-2"
            onClick={() => {
              noteStatusHandle({ isPinned: !note.isPinned }, note.$id);
            }}
          >
            {note.isPinned ? <TbPinnedFilled /> : <TbPinned />}
          </button>

          <button
            className="hover:bg-gray-400 rounded-full p-2"
            onClick={() => {
              noteStatusHandle({ isArchived: !note.isArchived }, note.$id);
            }}
          >
            {note.isArchived ? <MdOutlineUnarchive /> : <MdOutlineArchive />}
          </button>

          <button
            className="hover:bg-gray-400 rounded-full p-2"
            onClick={() => {
              noteStatusHandle({ isDeleted: !note.isDeleted }, note.$id);
            }}
          >
            <MdOutlineDelete />
          </button>

          <button
            className="hover:bg-gray-400 rounded-full p-2"
            onClick={() => {
              aiNoteHandler(note.$id);
            }}
          >
            <RiGeminiLine />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
