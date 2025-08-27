import { NavLink } from "react-router-dom";
import { FaTrashCan } from "react-icons/fa6";
import { HiOutlineHome } from "react-icons/hi";
import { MdArchive } from "react-icons/md";
import { useSideNav } from "../contexts";

const SideNav = () => {
  const { isNavActive } = useSideNav();

  const navElements = [
    {
      icon: <HiOutlineHome />,
      name: "Home",
      path: "/",
    },
    {
      icon: <MdArchive />,
      name: "Archive",
      path: "/archive",
    },
    {
      icon: <FaTrashCan />,
      name: "Trash",
      path: "/trash",
    },
  ];

  return (
    <div className="flex-grow px-4">
      <div>
        {navElements.map((nav) => (
          <NavLink
            key={nav.path}
            to={nav.path}
            className={({ isActive }) =>
              `flex items-center gap-x-4 pb-4 ${
                isActive ? "text-blue-500 font-bold" : "text-gray-700"
              }`
            }
          >
            <div className="flex items-center gap-x-4 pb-4">
              <span>{nav.icon}</span>
              <p className={`${isNavActive ? "visible" : "hidden"}`}>
                {nav.name}
              </p>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default SideNav;
