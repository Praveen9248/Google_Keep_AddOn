import { useRef, useEffect, useState, useCallback } from "react";
import { useNote } from "../contexts";
import { FiCheckSquare } from "react-icons/fi";
import { MdOutlineImage } from "react-icons/md";
import { MdOutlineColorLens } from "react-icons/md";
import { RiInboxArchiveLine } from "react-icons/ri";
import { TbCheckbox } from "react-icons/tb";
import { IoIosUndo } from "react-icons/io";
import { IoIosRedo } from "react-icons/io";
import { FiPlus } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { ID } from "appwrite";
import service from "../appwrite/NoteService";

const CreateNote = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { createNote, uploadImage } = useNote();
  const [isExpanded, setIsExpanded] = useState(false);
  const [noteMode, setNoteMode] = useState("text");
  const [listItems, setListItems] = useState([
    { id: "1", text: "", checked: false },
  ]);
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const [images, setImages] = useState([]);
  const imageInputRef = useRef(null);
  const [archiveStatus, setArchiveStatus] = useState(false);

  const [backgroundColor, setBackgroundColor] = useState("#121212");

  const [showColorPicker, setShowColorPicker] = useState(false);

  const colors = ["#e74c3c", "#2ecc71", "#f1c40f", "#9b59b6"];

  const handleColorBar = () => {
    setShowColorPicker((prev) => !prev);
  };

  const handleImageClick = () => {
    imageInputRef.current.click();
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      for (const file of files) {
        try {
          const imageUrl = await uploadImage(file);
          setImages((prevImages) => [...prevImages, imageUrl]);
        } catch (error) {
          console.error("Image upload failed:", error);
        }
      }
      e.target.value = null;
      saveStateToHistory();
    }
  };

  // Undo/Redo State
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // A helper function to save the current state to history
  const saveStateToHistory = useCallback(() => {
    const currentState = { title, content, listItems, noteMode };
    // Trim history to current index before adding a new state
    const newHistory = history.slice(0, historyIndex + 1);
    setHistory([...newHistory, currentState]);
    setHistoryIndex(newHistory.length);
  }, [title, content, listItems, noteMode, history, historyIndex]);

  // Use a ref to prevent saving state on every keystroke
  const saveTimeoutRef = useRef(null);
  const debouncedSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      saveStateToHistory();
    }, 500); // 500ms debounce
  }, [saveStateToHistory]);

  // Load state from history
  const loadStateFromHistory = useCallback(
    (index) => {
      if (index >= 0 && index < history.length) {
        const stateToLoad = history[index];
        setTitle(stateToLoad.title);
        setContent(stateToLoad.content);
        setListItems(stateToLoad.listItems);
        setNoteMode(stateToLoad.noteMode);
        setHistoryIndex(index);
      }
    },
    [history]
  );

  const handleUndo = () => {
    loadStateFromHistory(historyIndex - 1);
  };

  const handleRedo = () => {
    loadStateFromHistory(historyIndex + 1);
  };

  const handleExpand = (e) => {
    e.stopPropagation();
    setIsExpanded(true);
    setTimeout(() => {
      titleRef.current?.focus();
    }, 0);
  };

  const handleClose = () => {
    if (
      !title.trim() &&
      !content.trim() &&
      listItems.every((item) => !item.text.trim())
    ) {
      setIsExpanded(false);
    }
  };

  const handleClickOutside = (e) => {
    const target = e.target;
    if (!target.closest(".note-creation-container")) {
      handleClose();
    }
  };

  useEffect(() => {
    if (isExpanded) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isExpanded]);

  useEffect(() => {
    // Save initial state when the component expands
    if (isExpanded && historyIndex === -1) {
      saveStateToHistory();
    }
  }, [isExpanded, historyIndex, saveStateToHistory]);

  const addListItem = () => {
    const newItem = {
      id: Date.now().toString(),
      text: "",
      checked: false,
    };
    setListItems([...listItems, newItem]);
    debouncedSave();
  };

  const updateListItem = (id, text) => {
    setListItems((items) =>
      items.map((item) => (item.id === id ? { ...item, text } : item))
    );
    debouncedSave();
  };

  const toggleListItem = (id) => {
    setListItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
    saveStateToHistory(); // Immediate save for toggles
  };

  const removeListItem = (id) => {
    if (listItems.length > 1) {
      setListItems((items) => items.filter((item) => item.id !== id));
      saveStateToHistory();
    }
  };

  const handleKeyDown = (e, itemId) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addListItem();
    } else if (e.key === "Backspace") {
      const item = listItems.find((item) => item.id === itemId);
      if (item && item.text === "" && listItems.length > 1) {
        e.preventDefault();
        removeListItem(itemId);
      }
    }
  };

  const handleSave = async () => {
    let finalContent;

    if (noteMode === "text") {
      finalContent = content.trim();
    } else {
      // Checklist content → remove empty items and stringify
      const checklist = listItems
        .filter((item) => item.text.trim() !== "")
        .map((item) => ({
          text: item.text.trim(),
          checked: item.checked,
        }));

      finalContent = JSON.stringify(checklist); // ✅ stored as string
    }

    const noteData = {
      title: title.trim(),
      content: finalContent, // always a string
      color: backgroundColor,
      isArchived: archiveStatus,
    };
    if (images.length > 0) {
      noteData.imageUrl = images;
    }
    try {
      await createNote(noteData);
    } catch (err) {
      console.error("Failed to save note:", err);
    }

    // Reset
    setTitle("");
    setContent("");
    setListItems([{ id: "1", text: "", checked: false }]);
    setNoteMode("text");
    setIsExpanded(false);
    setImages([]);
    setArchiveStatus(false);
    setBackgroundColor("#121212");
    setHistory([]);
    setHistoryIndex(-1);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    debouncedSave();
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    debouncedSave();
  };

  const handleNoteModeChange = (mode) => {
    setNoteMode(mode);
    saveStateToHistory();
  };

  if (!isExpanded) {
    return (
      <div className="max-w-2xl mx-auto">
        <div
          className="note-creation-container bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-text"
          onClick={handleExpand}
        >
          <div className="flex items-center gap-4 p-4">
            <span className="text-gray-500 text-base">Take a note...</span>
            <div className="flex items-center gap-2 ml-auto">
              <button
                className={`h-10 w-10 p-0 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleNoteModeChange("checklist");
                  handleExpand();
                }}
              >
                <FiCheckSquare className="h-5 w-5 text-gray-600" />
              </button>
              <button
                className="h-10 w-10 p-0 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                onClick={handleImageClick}
              >
                <MdOutlineImage className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
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
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div
        className="note-creation-container bg-white border border-gray-200 rounded-lg shadow-lg"
        style={{ backgroundColor: backgroundColor }}
      >
        {/* Images Section */}
        {images.length > 0 && (
          <div className="p-4 pb-0 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {images.map((url, index) => (
              <div key={index} className="relative aspect-w-1 aspect-h-1">
                <img
                  src={url}
                  alt={`Uploaded image ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        )}

        {/* Title Input */}
        <div className="p-4 pb-0">
          <input
            ref={titleRef}
            type="text"
            placeholder="Title"
            value={title}
            onChange={handleTitleChange}
            className="w-full text-white dark:text-white text-base font-medium bg-transparent border-none outline-none placeholder:text-white resize-none"
            autoFocus
          />
        </div>

        {/* Content Input */}
        {noteMode === "text" ? (
          <div className="p-4 pt-2">
            <textarea
              placeholder="Take a note..."
              value={content}
              onChange={handleContentChange}
              className="w-full min-h-[60px] text-sm text-white dark:text-white bg-transparent border-none outline-none placeholder:text-white resize-none"
              rows={3}
            />
          </div>
        ) : (
          <div className="p-4 pt-2">
            {listItems.map((item, index) => (
              <div key={item.id} className="flex items-center gap-3 mb-2 group">
                <button
                  onClick={() => toggleListItem(item.id)}
                  className="flex-shrink-0 w-4 h-4 rounded border border-gray-400 hover:border-gray-600 flex items-center justify-center transition-colors"
                >
                  {item.checked && (
                    <svg
                      className="w-3 h-3 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
                <input
                  type="text"
                  placeholder="List item"
                  value={item.text}
                  onChange={(e) => updateListItem(item.id, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, item.id)}
                  className={`flex-1 text-sm text-white bg-transparent border-none outline-none placeholder:text-gray-100 ${
                    item.checked ? "line-through text-gray-500" : ""
                  }`}
                  autoFocus={index === listItems.length - 1}
                />
                {listItems.length > 1 && (
                  <button
                    onClick={() => removeListItem(item.id)}
                    className="opacity-0 group-hover:opacity-100 flex-shrink-0 w-4 h-4 hover:bg-gray-800 rounded flex items-center justify-center transition-opacity"
                  >
                    <IoClose className=" text-white" />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addListItem}
              className="flex items-center gap-3 text-sm text-gray-100 hover:text-gray-200 transition-colors mt-2"
            >
              <FiPlus className="w-4 h-4" />
              <span>Add item</span>
            </button>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex items-center justify-between p-2 border-t border-gray-200">
          <div className="flex items-center gap-1">
            <button
              className="h-8 w-8 p-0 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
              onClick={handleImageClick}
            >
              <MdOutlineImage className="h-4 w-4 text-gray-600" />
            </button>
            <div className="relative">
              <button
                className="h-8 w-8 p-0 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                onClick={handleColorBar}
              >
                <MdOutlineColorLens className="h-4 w-4 text-gray-600" />
              </button>
              {showColorPicker && (
                <div
                  className={`
                    absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-x-2 p-2
                    bg-white rounded-lg shadow-md
                    z-10
                  `}
                >
                  {colors.map((color) => (
                    <button
                      style={{ backgroundColor: color }}
                      className="w-8 h-8 rounded-full border border-gray-300 hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        setBackgroundColor(color);
                        setShowColorPicker(false);
                      }}
                      key={color}
                    ></button>
                  ))}
                </div>
              )}
            </div>
            <button
              className={`h-8 w-8 p-0 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors ${
                noteMode === "checklist" ? "bg-blue-50 text-blue-600" : ""
              }`}
              onClick={() =>
                handleNoteModeChange(noteMode === "text" ? "checklist" : "text")
              }
              title={
                noteMode === "text" ? "Show checkboxes" : "Hide checkboxes"
              }
            >
              <TbCheckbox className="h-4 w-4 text-gray-600" />
            </button>
            <button
              className="h-8 w-8 p-0 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
              onClick={() => {
                setArchiveStatus((prev) => !prev);
              }}
            >
              <RiInboxArchiveLine className="h-4 w-4 text-gray-600" />
            </button>
            <button
              className="h-8 w-8 p-0 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
              onClick={handleUndo}
              disabled={historyIndex <= 0}
            >
              <IoIosUndo className="h-4 w-4 text-gray-600" />
            </button>
            <button
              className="h-8 w-8 p-0 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
            >
              <IoIosRedo className="h-4 w-4 text-gray-600" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="px-6 h-8 text-sm font-medium hover:bg-gray-100 rounded transition-colors text-gray-700"
              onClick={handleSave}
            >
              Close
            </button>
          </div>
        </div>
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
  );
};

export default CreateNote;
