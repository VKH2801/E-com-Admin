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

export default function Locations(props: any) {
  const { user } = props;
  const [locations, setLocations] = useState([]);
  const [render, setRender] = useState(false);

  const [newName, setNewName] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newImage, setNewImage] = useState([]);
  const [newAddress, setNewAddress] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newMin, setNewMin] = useState("");
  const [newMax, setNewMax] = useState("");
  const [newStart, setNewStart] = useState("");
  const [newEnd, setNewEnd] = useState("");

  const [editId, setEditId] = useState("");
  const [editName, setEditName] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editMin, setEditMin] = useState("");
  const [editMax, setEditMax] = useState("");
  const [editStart, setEditStart] = useState("");
  const [editEnd, setEditEnd] = useState("");

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const page = 1,
          limit = 5;
        const { data } = await axios.get(`http://localhost:2002/api/v1/locations?${page}&${limit}`);
        setLocations(data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchLocations();
  }, [render]);

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

  const create = async () => {
    try {
      const formData = new FormData();
      formData.append("name", newName);
      formData.append("city", newCity);
      formData.append("address", newAddress);
      formData.append("phonenumber", newPhone);
      formData.append("minvalue", newMin);
      formData.append("maxvalue", newMax);
      formData.append("timestart", newStart);
      formData.append("timeend", newEnd);
      for (let i = 0; i < newImage.length; i++) {
        formData.append(`images`, newImage[i]);
      }
      await axios.post(`http://localhost:2002/api/v1/locations`, formData, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });
      setEditId("");
      setRender(!render);
      setNewName("");
      setNewCity("");
      setNewImage([]);
      setNewAddress("");
      setNewPhone("");
      setNewMin("");
      setNewMax("");
      setNewStart("");
      setNewEnd("");
      setIsOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const update = async () => {
    try {
      const id = editId;
      await axios.patch(
        `http://localhost:2002/api/v1/locations/${id}`,
        {
          name: editName,
          city: editCity,
          address: editAddress,
          phonenumber: editPhone,
          minvalue: editMin,
          maxvalue: editMax,
          timestart: editStart,
          timeend: editEnd,
        },
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );
      setEditId("");
      setEditName("");
      setEditCity("");
      setEditAddress("");
      setEditPhone("");
      setEditMin("");
      setEditMax("");
      setEditStart("");
      setEditEnd("");
      closeModalUpdate();
      setRender(!render);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:2002/api/v1/locations/${id}`, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });
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
          Create location
        </button>
        <div>
          <h2 className="text-lg font-semibold mb-2 mt-4">Location List</h2>
          {locations.length === 0 ? (
            <p>No categories found.</p>
          ) : (
            <ul className="border border-gray-300 rounded p-2">
              {locations.map((location) => (
                <li key={location.location.id} className="flex items-center justify-between mt-2 mb-2">
                  <div className="grid">
                    <span className="ml-10 text-16 text-sky-400">Name: {location.location.name}</span>
                    <span className="ml-14 text-13">City: {location.location.city}</span>
                    <span className="ml-14 text-13">
                      User: {location.user.lastName} {location.user.firstName}
                    </span>
                  </div>
                  <div className="grid">
                    <span className="text-13">Min value: {location.location.minvalue}</span>
                    <span className="text-13">Max value: {location.location.maxvalue}</span>
                    <span className="text-13">..............................</span>
                  </div>
                  <img
                    src={location.location.images[0]}
                    alt={location.location.name}
                    className="w-16 h-16 object-cover"
                  />
                  <div>
                    <button
                      onClick={() => {
                        openModalUpdate();
                        setEditId(location.location.id);
                        setEditName(location.location.name);
                        setEditCity(location.location.city);
                        setEditAddress(location.location.address);
                        setEditPhone(location.location.phonenumber);
                        setEditMin(location.location.minvalue);
                        setEditMax(location.location.maxvalue);
                        setEditStart(location.location.timestart);
                        setEditEnd(location.location.timeend);
                      }}
                      className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 focus:outline-none"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(location.location.id)}
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
            <div>
              <input
                type="text"
                placeholder="Name"
                onChange={(e) => setNewName(e.target.value)}
                className="mr-2 border border-gray-300 rounded-l py-2 px-3 focus:outline-none text-black"
              />
              <input
                type="text"
                placeholder="City"
                onChange={(e) => setNewCity(e.target.value)}
                className="border border-gray-300 rounded-l py-2 px-3 focus:outline-none text-black "
              />
            </div>
            <div className="mt-3">
              <input
                type="text"
                placeholder="Address"
                onChange={(e) => setNewAddress(e.target.value)}
                className="mr-2 border border-gray-300 rounded-l py-2 px-3 focus:outline-none text-black"
              />
              <input
                type="text"
                placeholder="Phone Number"
                onChange={(e) => setNewPhone(e.target.value)}
                className="border border-gray-300 rounded-l py-2 px-3 focus:outline-none text-black "
              />
            </div>
            <div className="mt-3">
              <input
                type="text"
                placeholder="Min value"
                onChange={(e) => setNewMin(e.target.value)}
                className="mr-2 border border-gray-300 rounded-l py-2 px-3 focus:outline-none text-black"
              />
              <input
                type="text"
                placeholder="Max value"
                onChange={(e) => setNewMax(e.target.value)}
                className="border border-gray-300 rounded-l py-2 px-3 focus:outline-none text-black "
              />
            </div>
            <div className="mt-3">
              <input
                type="text"
                placeholder="Time start"
                onChange={(e) => setNewStart(e.target.value)}
                className="mr-2 border border-gray-300 rounded-l py-2 px-3 focus:outline-none text-black"
              />
              <input
                type="text"
                placeholder="Time end"
                onChange={(e) => setNewEnd(e.target.value)}
                className="border border-gray-300 rounded-l py-2 px-3 focus:outline-none text-black "
              />
            </div>
            <input
              type="file"
              multiple
              placeholder="Image location"
              onChange={(e) => setNewImage(Array.from(e.target.files))}
              className="mt-3 border border-gray-300 rounded-l py-2 px-3 focus:outline-none text-black "
            />
            <button
              className="mt-4 bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-pink-500 transition-colors"
              onClick={() => {
                create();
              }}
            >
              Create post
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
                placeholder="Name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="mr-2 border border-gray-300 rounded-l py-2 px-3 focus:outline-none text-black"
              />
              <input
                type="text"
                placeholder="City"
                value={editCity}
                onChange={(e) => setEditCity(e.target.value)}
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
            </div>
            <div className="mt-3">
              <input
                type="text"
                placeholder="Min value"
                value={editMin}
                onChange={(e) => setEditMin(e.target.value)}
                className="mr-2 border border-gray-300 rounded-l py-2 px-3 focus:outline-none text-black"
              />
              <input
                type="text"
                placeholder="Max value"
                value={editMax}
                onChange={(e) => setEditMax(e.target.value)}
                className="border border-gray-300 rounded-l py-2 px-3 focus:outline-none text-black "
              />
            </div>
            <div className="mt-3">
              <input
                type="text"
                placeholder="Time start"
                value={editStart}
                onChange={(e) => setEditStart(e.target.value)}
                className="mr-2 border border-gray-300 rounded-l py-2 px-3 focus:outline-none text-black"
              />
              <input
                type="text"
                placeholder="Time end"
                value={editEnd}
                onChange={(e) => setEditEnd(e.target.value)}
                className="border border-gray-300 rounded-l py-2 px-3 focus:outline-none text-black "
              />
            </div>
            <button
              className="mt-4 bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-pink-500 transition-colors"
              onClick={() => {
                update();
              }}
            >
              Update location
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
}
