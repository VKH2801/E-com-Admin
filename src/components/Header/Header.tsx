import { useEffect, useState } from "react";
import { BsSunFill } from "react-icons/bs";
import { FaMoon } from "react-icons/fa";
import { HiOutlineMenu } from "react-icons/hi";
import { MdOutlineClose } from "react-icons/md";
import useDarkMode from "../../useDarkMode";
import { useDispatch } from "react-redux";
import { clearUser } from "../../slice/userSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
export default function Header(props: any) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isMobile, setAccounts, user } = props;
  const [isDarkMode, toggleDarkMode] = useDarkMode();
  const [openMenu, setOpenMenu] = useState(false);
  const [address, setAddress] = useState("");
  const handleMenu = () => {
    setOpenMenu(!openMenu);
  };
  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAddress(accounts[0]);
      setAccounts(accounts[0]);
    } else {
      console.log("Metamask is not installed.");
    }
  };

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

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: any) => {
        setAddress(accounts[0]);
        setAccounts(accounts[0]);
      });
    } else {
      console.log("MetaMask don't install.");
    }
  }, []);

  return (
    <nav className="flex items-center">
      <div className="flex items-center mt-[-8px]">
        <div className="text-20 font-bold mr-2 ">{user.email}</div>
        {isDarkMode ? (
          <BsSunFill
            size={"24px"}
            color="#e9c46a"
            className="cursor-pointer"
            onClick={() => toggleDarkMode(!isDarkMode)}
          />
        ) : (
          <FaMoon
            size={"24px"}
            color="#e9c46a"
            className="cursor-pointer"
            onClick={() => toggleDarkMode(!isDarkMode)}
          />
        )}
      </div>
      <ul className="flex gap-10 ml-auto text-16 font-semibold">
        {openMenu && isMobile ? (
          <MdOutlineClose size={"24px"} className="cursor-pointer" onClick={handleMenu} />
        ) : !openMenu && isMobile ? (
          <HiOutlineMenu size={"24px"} className="cursor-pointer" onClick={handleMenu} />
        ) : (
          <>
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
            <li className="btn-hover mt-[-7px]">
              <button
                className="bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-pink-500 transition-colors"
                onClick={() => {
                  logOut();
                }}
              >
                Log out
              </button>
            </li>
            <li className="btn-hover ml-6 mt-[-10px]">
              {address ? (
                <div className="mt-[10px]">
                  Connected to {address.slice(0, 6)}...
                  {address.slice(address.length - 4)}
                </div>
              ) : (
                <button
                  className="connect-button"
                  onClick={() => {
                    connectWallet();
                  }}
                >
                  Connect Metamask
                </button>
              )}
            </li>
          </>
        )}
        {openMenu && (
          <div className="absolute right-8 bg-white p-8 text-center z-10 text-black text-13">
            <li className="cursor-pointer">Features</li>
            <li className="cursor-pointer">Menu </li>
            <li className="cursor-pointer">Our Story</li>
            <li className="cursor-pointer">Connect Metamask</li>
          </div>
        )}
      </ul>
    </nav>
  );
}
