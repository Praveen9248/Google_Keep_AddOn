import { useContext, createContext, useState, useEffect } from "react";
import service from "../appwrite/NoteService";
import { useAuth } from "./AuthContextProvider";

const NoteContext = createContext();

export const useNote = () => {
  return useContext(NoteContext);
};

const NoteContextProvider = ({ children }) => {
  const { user, loginUser, loginUserOAuth } = useAuth();
  const [notes, setNotes] = useState(null);
  const [searchStatus, setSearchStatus] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const fetchNotes = async () => {
    try {
      const res = await service.listNote();
      setNotes(res.documents);
    } catch (error) {
      console.log(error);
    }
  };

  const createNote = async (data) => {
    try {
      const res = await service.createNote(data);
      if (res) {
        fetchNotes();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addImage = async (imageFile, noteId) => {
    try {
      let imageUrl = null;
      if (imageFile) {
        const uploadedFile = await service.uploadFile(imageFile);
        imageUrl = service.fileUrl(uploadedFile.$id);
      }
      const res = await updateNote({ imageUrl: imageUrl }, noteId);
      if (res) {
        alert("added image succesfully");
        fetchNotes();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateNote = async (data, noteId) => {
    try {
      const res = await service.updateNote(data, noteId);
      if (res) {
        console.log("updated note succesfully");
        fetchNotes();
        return true;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const removeNote = async (noteId) => {
    try {
      const res = await service.deleteNote(noteId);
      if (res) {
        alert("deleted note successfully");
      }
      fetchNotes();
    } catch (error) {
      console.log(error);
    }
  };

  const noteStatusHandle = async (data, noteId) => {
    try {
      const res = await updateNote(data, noteId);
      if (res) {
        console.log("changes done");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const aiNoteHandler = async (noteId) => {
    try {
      const res = await service.analyzeNote(noteId);
      fetchNotes();
      return res;
    } catch (error) {
      console.log(error);
    }
  };

  const searchNotes = async (searchText) => {
    try {
      return await service.searchNote(searchText);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [loginUserOAuth, loginUser]);

  return (
    <NoteContext.Provider
      value={{
        notes,
        noteStatusHandle,
        updateNote,
        removeNote,
        createNote,
        addImage,
        aiNoteHandler,
        searchNotes,
        searchStatus,
        setSearchStatus,
        searchResults,
        setSearchResults,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
};

export default NoteContextProvider;
