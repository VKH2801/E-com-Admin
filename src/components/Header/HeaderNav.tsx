import { useNavigate } from "react-router-dom";
import useDarkMode from "../../useDarkMode";
import { BsSunFill } from "react-icons/bs";
import { FaMoon } from "react-icons/fa";
import { useDispatch } from "react-redux";
import axios from "axios";
import { clearUser } from "../../slice/userSlice";

export default function HeaderNav(props: any) {
  const { user } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isDarkMode, toggleDarkMode] = useDarkMode();

  const logOut = async () => {
    await axios.post(
      "http://localhost:2002/api/v1/user/logout",
      { refreshToken: user.refreshToken },
      {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      }
    );
    dispatch(clearUser());
    localStorage.removeItem("user");
    navigate("/login");
  };
  return (
    <nav className="flex items-center mb-[40px]">
      <div className="flex items-center mt-[-1px]">
        <div className="text-20 font-bold mr-2 ">{user.email}</div>
        {isDarkMode ? (
          <BsSunFill
            size={"25px"}
            color="#e9c46a"
            className="cursor-pointer"
            onClick={() => toggleDarkMode(!isDarkMode)}
          />
        ) : (
          <FaMoon
            size={"25px"}
            color="#e9c46a"
            className="cursor-pointer"
            onClick={() => toggleDarkMode(!isDarkMode)}
          />
        )}
      </div>
      <ul className="flex gap-10 ml-[120px] text-16 font-semibold">
        <li
          className="btn-hover"
          onClick={() => {
            navigate("/");
          }}
        >
          Home
        </li>
        <li
          className="btn-hover"
          onClick={() => {
            navigate("/categories");
          }}
        >
          Categories
        </li>
        <li
          className="btn-hover"
          onClick={() => {
            navigate("/locations");
          }}
        >
          Locations
        </li>
        <li
          className="btn-hover"
          onClick={() => {
            navigate("/posts");
          }}
        >
          Posts
        </li>
        <li
          className="btn-hover"
          onClick={() => {
            navigate("/users");
          }}
        >
          Users
        </li>
        <li className="btn-hover mt-[-7px] ml-[160px]">
          <button
            className="bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-pink-500 transition-colors"
            onClick={() => {
              logOut();
            }}
          >
            Log out
          </button>
        </li>
      </ul>
    </nav>
  );
}
