import { useState, useEffect } from "react";
import axios from "axios";
import HeaderNav from "../Header/HeaderNav";
export default function Categories(props: any) {
  const { user } = props;
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryImage, setNewCategoryImage] = useState(null);
  const [editCategoryId, setEditCategoryId] = useState("");
  const [editCategoryName, setEditCategoryName] = useState("");
  const [render, setRender] = useState(false);

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

  const handleAddCategory = async (e: any) => {
    try {
      e.preventDefault();
      const formData = new FormData();
      formData.append("name", newCategoryName);
      formData.append("avatar", newCategoryImage);
      await axios.post(`http://localhost:2002/api/v1/categories`, formData, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });
      setRender(!render);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteCategory = async (id: any) => {
    try {
      await axios.delete(`http://localhost:2002/api/v1/categories/${id}`, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });
      setRender(!render);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditCategory = async () => {
    try {
      const id = editCategoryId;
      await axios.patch(
        `http://localhost:2002/api/v1/categories/${id}`,
        { name: editCategoryName },
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );
      setRender(!render);
      setEditCategoryId("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-screen font-sora overflow-y-auto overflow-x-hidden h-screen px-4 py-8 bg-gradient-to-b dark:from-purple-900 dark:to-purple-700 from-white to-pink-500  dark:text-white text-black md:px-20">
      <HeaderNav user={user} />
      <div className="container mx-auto ml-5 ">
        <h1 className="text-2xl font-bold mb-4">Category Management</h1>

        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Create Category</h2>
          <div className="flex">
            <input
              type="text"
              placeholder="Category Name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="border border-gray-300 rounded-l py-2 px-20 focus:outline-none text-black"
            />
            <input
              type="file"
              placeholder="Image URL"
              onChange={(e) => setNewCategoryImage(e.target.files[0])}
              className="border border-gray-300 py-2 px-1 focus:outline-none"
            />
            <button
              onClick={handleAddCategory}
              className="bg-blue-500 text-white px-4 py-2 rounded-r focus:outline-none"
            >
              Add
            </button>
          </div>
        </div>

        {/* Category List */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Category List</h2>
          {categories.length === 0 ? (
            <p>No categories found.</p>
          ) : (
            <ul className="border border-gray-300 rounded p-2">
              {categories.map((category) => (
                <li key={category.id} className="flex items-center justify-between mt-1 mb-1">
                  <span className="ml-10">{category.name}</span>
                  <img src={category.image} alt={category.name} className="w-16 h-16 object-cover" />
                  <div>
                    <button
                      onClick={() => {
                        setEditCategoryId(category.id);
                        setEditCategoryName(category.name);
                      }}
                      className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 focus:outline-none"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
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

        {/* Edit Category */}
        {editCategoryId && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">Edit Category</h2>
            <div className="flex">
              <input
                type="text"
                placeholder="Category Name"
                value={editCategoryName}
                onChange={(e) => setEditCategoryName(e.target.value)}
                className="border border-gray-300 rounded-l py-2 px-3 focus:outline-none text-black"
              />
              <button
                onClick={handleEditCategory}
                className="bg-blue-500 text-white px-4 py-2 rounded-r focus:outline-none"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
