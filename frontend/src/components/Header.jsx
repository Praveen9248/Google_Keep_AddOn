import React, { useState } from "react";
import { MdOutlineDarkMode } from "react-icons/md";
import { SiGooglekeep } from "react-icons/si";
import { IoMenu } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { FaRegUser } from "react-icons/fa6";
import { useAuth, useSideNav, useTheme } from "../contexts";

const Header = () => {
  const { toggleNavActive } = useSideNav();

  const { toggleTheme } = useTheme();
  const { logoutUser } = useAuth();
  const [searchInput, setSearchInput] = useState("");
  const [accountBar, setAccountBar] = useState(false);

  const handleSearchSubmit = (query) => {
    query.preventDefault();
    console.log(query);
    setSearchInput("");
  };

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
      <div className="flex-grow">
        <form className="flex w-full" onSubmit={handleSearchSubmit}>
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
            type="submit"
            className="border border-solid dark:border-white border-black p-2 rounded-full"
          >
            <FiSearch />
          </button>
        </form>
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
