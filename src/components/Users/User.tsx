import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import HeaderNav from "../Header/HeaderNav";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

export default function Users(props: any) {
  const { user } = props;
  const [users, setUsers] = useState([]);
  const [render, setRender] = useState(false);

  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newConfirm, setNewConfirm] = useState("");

  const [editId, setEditId] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editAccount, setEditAccount] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editBirthday, setEditBirthday] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editSex, setEditSex] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editReward, setEditReward] = useState("");

  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalIsOpenUpdate, setIsOpenUpdate] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function openModalUpdate() {
    setIsOpenUpdate(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function closeModalUpdate() {
    setIsOpenUpdate(false);
  }

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data } = await axios.get(`http://localhost:2002/api/v1/user/all`, {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        });
        setUsers(data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchLocations();
  }, [render, user.accessToken]);

  const create = async () => {
    try {
      await axios.post("http://localhost:2002/api/v1/user/register/email", {
        email: newEmail,
        password: newPassword,
        confirmPassword: newConfirm,
        firstName: newFirstName,
        lastName: newLastName,
      });
      setNewEmail("");
      setNewPassword("");
      setNewConfirm("");
      setNewFirstName("");
      setNewLastName("");
      setRender(!render);
      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:2002/api/v1/user/all/${id}`, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });
      setRender(!render);
    } catch (error) {
      console.log(error);
    }
  };

  const update = async () => {
    try {
      const id = editId;
      await axios.patch(
        `http://localhost:2002/api/v1/user/all/${id}`,
        {
          email: editEmail,
          account: editAccount,
          address: editAddress,
          birthDay: editBirthday,
          firstName: editFirstName,
          lastName: editLastName,
          phoneNumber: editPhone,
          reward: editReward,
          role: editRole,
          sex: editSex,
        },
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );
      closeModalUpdate();
      setEditAccount("");
      setEditAddress("");
      setEditPhone("");
      setEditBirthday("");
      setEditFirstName("");
      setEditLastName("");
      setEditReward("");
      setEditId("");
      setEditRole("");
      setEditSex("");
      setEditEmail("");
      setRender(!render);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-screen font-sora overflow-y-auto overflow-x-hidden h-screen px-4 py-8 bg-gradient-to-b dark:from-purple-900 dark:to-purple-700 from-white to-pink-500  dark:text-white text-black md:px-20">
      <HeaderNav user={user} />
      <div>
        <button
          className="mt-4 bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-pink-500 transition-colors"
          onClick={openModal}
        >
          Create User
        </button>
        <div>
          <h2 className="text-lg font-semibold mb-2 mt-4">Users List</h2>
          {users.length === 0 ? (
            <p>No categories found.</p>
          ) : (
            <ul className="border border-gray-300 rounded p-2">
              {users.map((user) => (
                <li key={user.id} className="flex items-center justify-between mt-2 mb-2">
                  <div className="grid">
                    <span className="ml-10 text-16 text-sky-400">
                      Name: {user.firstName} {user.lastName}
                    </span>
                    <span className="ml-14 text-13">Email: {user.email}</span>
                    <span className="ml-14 text-13">Address: {user.address}</span>
                  </div>
                  <div className="grid">
                    <span className="text-13">Phone: {user.phoneNumber}</span>
                    <span className="text-13">Birthday: {user.birthDay}</span>
                    <span className="text-13">..............................</span>
                  </div>
                  <img src={user.avatar} alt={user.lastName} className="w-16 h-16 object-cover" />
                  <div>
                    <button
                      onClick={() => {
                        openModalUpdate();
                        setEditId(user.id);
                        setEditAccount(user.account);
                        setEditAddress(user.address);
                        setEditBirthday(user.birthDay);
                        setEditEmail(user.email);
                        setEditFirstName(user.firstName);
                        setEditLastName(user.lastName);
                        setEditPhone(user.phoneNumber);
                        setEditReward(user.reward);
                        setEditRole(user.role);
                        setEditSex(user.sex);
                      }}
                      className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 focus:outline-none"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded focus:outline-none"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Create Location */}
        <Modal
          ariaHideApp={false}
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <div className="grid w-auto">
            <input
              type="text"
              placeholder="Email"
              onChange={(e) => setNewEmail(e.target.value)}
              className="border border-gray-300 rounded-l py-2 px-3 focus:outline-none text-black"
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setNewPassword(e.target.value)}
              className="border border-gray-300 rounded-l py-2 px-3 focus:outline-none text-black mt-4"
            />
            <input
              type="password"
              placeholder="Comfirm Password"
              onChange={(e) => setNewConfirm(e.target.value)}
              className="border border-gray-300 rounded-l py-2 px-3 focus:outline-none text-black mt-4"
            />
            <div>
              <input
                type="text"
                placeholder="First name"
                onChange={(e) => setNewFirstName(e.target.value)}
                className="mr-2 border border-gray-300 rounded-l py-2 px-3 focus:outline-none text-black mt-4"
              />
              <input
                type="text"
                placeholder="Last name"
                onChange={(e) => setNewLastName(e.target.value)}
                className="border border-gray-300 rounded-l py-2 px-3 focus:outline-none text-black "
              />
            </div>

            <button
              className="mt-4 bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-pink-500 transition-colors"
              onClick={() => {
                create();
              }}
            >
              Create User
            </button>
          </div>
        </Modal>

        {/* Update Location */}
        <Modal
          ariaHideApp={false}
          isOpen={modalIsOpenUpdate}
          onRequestClose={closeModalUpdate}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <div className="grid w-auto">
            <div>
              <input
                type="text"
                placeholder="Email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="mr-2 border border-gray-300 rounded-l py-2 px-3 focus:outline-none text-black"
              />
              <input
                type="text"
                placeholder="City"
                value={editRole}
                onChange={(e) => setEditRole(e.target.value)}
                className="border border-gray-300 rounded-l py-2 px-3 focus:outline-none text-black "
              />
            </div>
          </div>
          <div className="mt-3">
            <input
              type="text"
              placeholder="First name"
              value={editFirstName}
              onChange={(e) => setEditFirstName(e.target.value)}
              className="mr-2 border border-gray-300 rounded-l py-2 px-3 focus:outline-none text-black"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={editLastName}
              onChange={(e) => setEditLastName(e.target.value)}
              className="border border-gray-300 rounded-l py-2 px-3 focus:outline-none text-black "
            />
          </div>
          <div className="mt-3">
            <input
              type="text"
              placeholder="Address"
              value={editAddress}
              onChange={(e) => setEditAddress(e.target.value)}
              className="mr-2 border border-gray-300 rounded-l py-2 px-3 focus:outline-none text-black"
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
              className="border border-gray-300 rounded-l py-2 px-3 focus:outline-none text-black "
            />
            <div className="mt-3">
              <input
                type="text"
                placeholder="Birthday"
                value={editBirthday}
                onChange={(e) => setEditBirthday(e.target.value)}
                className="mr-2 border border-gray-300 rounded-l py-2 px-3 focus:outline-none text-black"
              />
              <input
                type="text"
                placeholder="Sex"
                value={editSex}
                onChange={(e) => setEditSex(e.target.value)}
                className="border border-gray-300 rounded-l py-2 px-3 focus:outline-none text-black "
              />
            </div>
            <div className="mt-3">
              <input
                type="text"
                placeholder="Account"
                value={editAccount}
                onChange={(e) => setEditAccount(e.target.value)}
                className="mr-2 border border-gray-300 rounded-l py-2 px-3 focus:outline-none text-black"
              />
              <input
                type="text"
                placeholder="Reward"
                value={editReward}
                onChange={(e) => setEditReward(e.target.value)}
                className="border border-gray-300 rounded-l py-2 px-3 focus:outline-none text-black "
              />
            </div>
            <button
              className="mt-4 bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-pink-500 transition-colors ml-[140px]"
              onClick={() => {
                update();
              }}
            >
              Update user
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
}
