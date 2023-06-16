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

export default function Posts(props: any) {
  const { user } = props;
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [render, setRender] = useState(false);

  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalIsOpenUpdate, setIsOpenUpdate] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newTags, setNewTags] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newRate, setNewRate] = useState("");
  const [newCategoryId, setNewCategoryId] = useState("");
  const [newLocationId, setNewLocationId] = useState("");

  const [editId, setEditId] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editTags, setEditTags] = useState([]);
  const [editRate, setEditRate] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("http://localhost:2002/api/v1/categories");
        setCategories(data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, [render]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const page = 1,
          limit = 10;
        const { data } = await axios.get(`http://localhost:2002/api/v1/locations?${page}&${limit}`);
        setLocations(data.data);
      } catch (error) {
        console.error("Error fetching locationss:", error);
      }
    };
    fetchLocations();
  }, [render]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const page = 1,
          limit = 10;
        const { data } = await axios.get(`http://localhost:2002/api/v1/posts?${page}&${limit}`);
        setPosts(data.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchLocations();
  }, [render]);

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

  const update = async () => {
    try {
      const id = editId;
      await axios.patch(
        `http://localhost:2002/api/v1/posts/${id}`,
        {
          title: editTitle,
          content: editContent,
          address: editAddress,
          tags: editTags,
          rate: editRate,
        },
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );
      setEditId("");
      setEditTitle("");
      setEditContent("");
      setEditRate("");
      setEditTags([]);
      closeModalUpdate();
      setRender(!render);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:2002/api/v1/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });
      setRender(!render);
    } catch (error) {
      console.log(error);
    }
  };

  const create = async () => {
    try {
      const formData = new FormData();
      formData.append("title", newTitle);
      formData.append("content", newContent);
      formData.append("address", newAddress);
      formData.append("tags", newTags);
      formData.append("rate", newRate);
      formData.append("categoryId", newCategoryId);
      formData.append("locationId", newLocationId);
      for (let i = 0; i < newImages.length; i++) {
        formData.append(`images`, newImages[i]);
      }
      await axios.post(`http://localhost:2002/api/v1/posts`, formData, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });
      setRender(!render);
      setNewTitle("");
      setNewContent("");
      setNewAddress("");
      setNewTags([]);
      setNewImages([]);
      setNewLocationId("");
      setNewCategoryId("");
      setIsOpen(false);
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
          Create Post
        </button>
        <div>
          <h2 className="text-lg font-semibold mb-2 mt-4">Location List</h2>
          {posts.length === 0 ? (
            <p>No categories found.</p>
          ) : (
            <ul className="border border-gray-300 rounded p-2">
              {posts.map((post) => (
                <li key={post.post.id} className="flex items-center justify-between mt-2 mb-2">
                  <div className="grid">
                    <span className="ml-10 text-16 text-sky-400">Title: {post.post.title}</span>
                    <span className="ml-14 text-13">Address: {post.post.address}</span>
                    <span className="ml-14 text-13">
                      User: {post.user.lastName} {post.user.firstName}
                    </span>
                  </div>
                  <img src={post.post.images[0]} alt={post.post.title} className="w-16 h-16 object-cover" />
                  <div>
                    <button
                      onClick={() => {
                        openModalUpdate();
                        setEditId(post.post.id);
                        setEditTitle(post.post.title);
                        setEditContent(post.post.content);
                        setEditAddress(post.post.address);
                        setEditTags(post.post.tags);
                        setEditRate(post.post.rate);
                      }}
                      className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 focus:outline-none"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post.post.id)}
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
                placeholder="Title"
                onChange={(e) => setNewTitle(e.target.value)}
                className="mr-2 border border-gray-300 rounded-l py-2 px-3 focus:outline-none text-black"
              />
              <input
                type="text"
                placeholder="Content"
                onChange={(e) => setNewContent(e.target.value)}
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
                placeholder="Tags"
                onChange={(e) => setNewTags([e.target.value])}
                className="border border-gray-300 rounded-l py-2 px-3 focus:outline-none text-black "
              />
            </div>
            <div className="mt-3">
              <select
                title="aa"
                name="location"
                id="locationId"
                form="carform"
                className="text-black mr-[100px]"
                onChange={(e) => setNewLocationId(e.target.value)}
              >
                <option value="">Select locations</option>
                {locations.map((option) => (
                  <option key={option.location.id} value={option.location.id}>
                    {option.location.name}
                  </option>
                ))}
              </select>
              <select
                title="aa"
                name="category"
                id="categoryId"
                form="carform"
                className="text-black "
                onChange={(e) => setNewCategoryId(e.target.value)}
              >
                <option value="">Select Categories</option>
                {categories.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-3">
              <input
                type="text"
                placeholder="Rate"
                onChange={(e) => setNewRate(e.target.value)}
                className="mr-2 border border-gray-300 rounded-l py-2 px-3 focus:outline-none text-black"
              />
              <input
                type="file"
                multiple
                placeholder="Image post"
                onChange={(e) => setNewImages(Array.from(e.target.files))}
                className="border border-gray-300 rounded-l py-2 px-3 focus:outline-none text-black "
              />
            </div>
            <button
              className="mt-4 bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-pink-500 transition-colors"
              onClick={() => {
                create();
              }}
            >
              Create location
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
                placeholder="Title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="mr-2 border border-gray-300 rounded-l py-2 px-3 focus:outline-none text-black"
              />
              <input
                type="text"
                placeholder="Content"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
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
                placeholder="Rate"
                value={editRate}
                onChange={(e) => setEditRate(e.target.value)}
                className="border border-gray-300 rounded-l py-2 px-3 focus:outline-none text-black "
              />
            </div>
            <button
              className="mt-4 bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-pink-500 transition-colors"
              onClick={() => {
                update();
              }}
            >
              Update Post
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
}
