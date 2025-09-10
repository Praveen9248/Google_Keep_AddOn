import { useState, useRef, useCallback, useEffect } from "react";
import { MdOutlineImage, MdOutlineColorLens } from "react-icons/md";
import { RiInboxArchiveLine } from "react-icons/ri";
import { TbCheckbox } from "react-icons/tb";
import { IoIosUndo, IoIosRedo } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { FiPlus } from "react-icons/fi";
import { useNote } from "../contexts";

const UpdateNoteCard = ({ note }) => {
  const {
    noteStatusHandle,
    updateNote,
    uploadImage,
    setEditingNote,
    removeImage,
  } = useNote();

  // ✅ Parse content safely
  let initialMode = "text";
  let initialListItems = [];
  try {
    const parsed = JSON.parse(note.content);
    if (Array.isArray(parsed)) {
      initialMode = "checklist";
      initialListItems = parsed;
    }
  } catch {
    initialMode = "text";
  }

  const [title, setTitle] = useState(note.title || "");
  const [content, setContent] = useState(
    initialMode === "text" ? note.content : ""
  );
  const [noteMode, setNoteMode] = useState(initialMode);
  const [listItems, setListItems] = useState(
    initialMode === "checklist"
      ? initialListItems.map((item, idx) => ({
          id: idx.toString(),
          text: item.text,
          checked: item.checked,
        }))
      : [{ id: "1", text: "", checked: false }]
  );
  const [backgroundColor, setBackgroundColor] = useState(note.color || "#fff");
  const [images, setImages] = useState(note.imageUrl || []);
  const imageInputRef = useRef(null);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const colors = ["#e74c3c", "#2ecc71", "#f1c40f", "#9b59b6"];

  // Undo/Redo
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const saveTimeoutRef = useRef(null);

  const saveStateToHistory = useCallback(() => {
    const currentState = { title, content, listItems, noteMode };
    const newHistory = history.slice(0, historyIndex + 1);
    setHistory([...newHistory, currentState]);
    setHistoryIndex(newHistory.length);
  }, [title, content, listItems, noteMode, history, historyIndex]);

  const debouncedSave = useCallback(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(saveStateToHistory, 400);
  }, [saveStateToHistory]);

  const loadStateFromHistory = (index) => {
    if (index >= 0 && index < history.length) {
      const s = history[index];
      setTitle(s.title);
      setContent(s.content);
      setListItems(s.listItems);
      setNoteMode(s.noteMode);
      setHistoryIndex(index);
    }
  };

  const handleUndo = () => loadStateFromHistory(historyIndex - 1);
  const handleRedo = () => loadStateFromHistory(historyIndex + 1);

  useEffect(() => {
    if (historyIndex === -1) saveStateToHistory();
  }, [saveStateToHistory, historyIndex]);

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      for (const file of files) {
        try {
          const url = await uploadImage(file);
          setImages((prev) => [...prev, url]);
          const newImages = { imageUrl: images };
          const res = await updateNote(newImages, note.$id);
          if (res) {
            console.log("done");
          } else {
            console.log("error");
          }
        } catch (err) {
          console.error("Image upload failed:", err);
        }
      }
      e.target.value = null;
      saveStateToHistory();
    }
  };
  const getFileIdFromUrl = (url) => {
    const parts = url.split("/files/");
    if (parts.length > 1) {
      const fileIdPart = parts[1].split("/")[0];
      return fileIdPart;
    }
    return null;
  };

  const handleRemoveImage = async (url) => {
    try {
      const fileId = getFileIdFromUrl(url);
      if (!fileId) {
        throw new Error("Invalid URL or file ID not found.");
      }

      const res = await removeImage(fileId); // <- implement in context
      if (res) {
        setImages((prev) => prev.filter((img) => img !== url));
      } else {
        console.log("try again ");
      }
    } catch (err) {
      console.error("Remove failed:", err);
    }
  };

  const handleSave = () => {
    let finalContent;
    if (noteMode === "text") {
      finalContent = content.trim();
    } else {
      const checklist = listItems
        .filter((i) => i.text.trim() !== "")
        .map((i) => ({ text: i.text, checked: i.checked }));
      finalContent = JSON.stringify(checklist);
    }

    const update = {
      title: title.trim(),
      content: finalContent,
      color: backgroundColor,
      imageUrl: images,
    };
    noteStatusHandle(update, note.$id);
    setEditingNote(null);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={() => {
        setEditingNote(null);
      }}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-4"
        style={{ backgroundColor }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Images with remove button */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-3">
            {images.map((url, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={url}
                  alt={`note-img-${idx}`}
                  className="rounded-lg object-cover w-full h-28"
                />
                <button
                  onClick={() => handleRemoveImage(url)}
                  className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                >
                  <IoClose size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            debouncedSave();
          }}
          className="w-full text-lg font-medium bg-transparent border-none outline-none mb-2"
        />

        {noteMode === "text" ? (
          <textarea
            placeholder="Take a note..."
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              debouncedSave();
            }}
            rows={3}
            className="w-full bg-transparent border-none outline-none resize-none"
          />
        ) : (
          <div>
            {listItems.map((item) => (
              <div key={item.id} className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() =>
                    setListItems((prev) =>
                      prev.map((i) =>
                        i.id === item.id ? { ...i, checked: !i.checked } : i
                      )
                    )
                  }
                />
                <input
                  type="text"
                  value={item.text}
                  onChange={(e) =>
                    setListItems((prev) =>
                      prev.map((i) =>
                        i.id === item.id ? { ...i, text: e.target.value } : i
                      )
                    )
                  }
                  className="flex-1 bg-transparent border-none outline-none"
                />
              </div>
            ))}
            <button
              onClick={() =>
                setListItems((prev) => [
                  ...prev,
                  { id: Date.now().toString(), text: "", checked: false },
                ])
              }
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
            >
              <FiPlus /> Add item
            </button>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-1">
            <button
              onClick={() => imageInputRef.current.click()}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <MdOutlineImage />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowColorPicker((p) => !p)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <MdOutlineColorLens />
              </button>
              {showColorPicker && (
                <div className="absolute bottom-10 flex gap-2 bg-white p-2 rounded shadow">
                  {colors.map((c) => (
                    <button
                      key={c}
                      style={{ backgroundColor: c }}
                      className="w-6 h-6 rounded-full"
                      onClick={() => {
                        setBackgroundColor(c);
                        setShowColorPicker(false);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() =>
                setNoteMode(noteMode === "text" ? "checklist" : "text")
              }
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <TbCheckbox />
            </button>
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
            >
              <IoIosUndo />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
            >
              <IoIosRedo />
            </button>
            <button
              onClick={() =>
                noteStatusHandle({ isArchived: !note.isArchived }, note.$id)
              }
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <RiInboxArchiveLine />
            </button>
          </div>
          <button
            onClick={handleSave}
            className="px-4 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
          >
            Save
          </button>
        </div>

        <input
          type="file"
          ref={imageInputRef}
          onChange={handleImageUpload}
          style={{ display: "none" }}
          accept="image/*"
          multiple
        />
      </div>
    </div>
  );
};

export default UpdateNoteCard;
