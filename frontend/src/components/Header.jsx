import React, { useState, useEffect } from "react";
import { MdOutlineDarkMode } from "react-icons/md";
import { SiGooglekeep } from "react-icons/si";
import { IoMenu } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa6";
import { useAuth, useNote, useSideNav, useTheme } from "../contexts";

const Header = () => {
  const { toggleNavActive } = useSideNav();
  const { toggleTheme } = useTheme();
  const { searchNotes, setSearchStatus, setSearchResults, searchResults } =
    useNote();
  const { logoutUser } = useAuth();
  const [searchInput, setSearchInput] = useState("");
  const [accountBar, setAccountBar] = useState(false);

  function debounce(func, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  }

  const performSearch = debounce(async (text) => {
    setSearchStatus(true);
    if (!text) {
      setSearchResults([]);
      return;
    }
    const res = await searchNotes(text);

    setSearchResults(res);
    console.log(searchResults);
  }, 300);

  useEffect(() => {
    performSearch(searchInput);
  }, [searchInput]);

  return (
    <div className="flex px-4 items-center justify-between h-full gap-x-8">
      <div className="flex gap-x-4">
        <div>
          <button
            onClick={() => {
              toggleNavActive();
            }}
          >
            <IoMenu />
          </button>
        </div>
        <div>
          <SiGooglekeep />
        </div>
      </div>
      <div className="flex-grow flex">
        <input
          type="text"
          placeholder="Search..."
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
          }}
          className="w-full border border-solid dark:border-white border-black rounded-xl px-2 mr-2"
        />
        <button
          onClick={() => {
            setSearchStatus(false);
          }}
        >
          <IoClose />
        </button>
      </div>
      <div className="flex gap-x-4">
        <div>
          <button onClick={() => toggleTheme()}>
            <MdOutlineDarkMode />
          </button>
        </div>
        <div>
          <button
            onClick={() => {
              setAccountBar((prev) => !prev);
            }}
          >
            <FaRegUser />
          </button>
        </div>
        <div
          className={`absolute bottom-[640px] right-1 w-auto h-fit bg-gray-120 ${
            accountBar ? "visible" : "hidden"
          }`}
        >
          <button
            className="bg-red-600 px-2 py-1 rounded-xl"
            onClick={() => {
              logoutUser();
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
