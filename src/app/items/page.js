"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth";
import Header from "@/components/Header";
import Modal from "@/components/Modal";
import EditItemForm from "@/components/EditItemForm";

export default function ItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [inStock, setInStock] = useState(null);
  const [editingItemId, setEditingItemId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { token } = useAuth();

  // checkbox change for categories
  const handleCategoryChange = (category) => {
    setSelectedCategories((prevCategories) =>
      prevCategories.includes(category)
        ? prevCategories.filter((c) => c !== category)
        : [...prevCategories, category]
    );
  };

  // fetch from API/filter
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);

      let url = "/api/items";
      const queryParams = new URLSearchParams();

      if (selectedCategories.length > 0) {
        queryParams.append("category", selectedCategories.join(","));
      }
      if (inStock !== null) {
        queryParams.append("inStock", inStock ? "true" : "false");
      }

      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      setItems(data);
      setLoading(false);
    };

    fetchItems();
  }, [selectedCategories, inStock]);

  // callback when new item added
  const handleItemAdded = (newItem) => {
    setItems((prevItems) => [newItem, ...prevItems]);
  };

  if (loading) {
    return <p>Loading.....</p>;
  }

  const deleteItem = async (itemId) => {
    if (!token) return;
    const response = await fetch(`/api/items/${itemId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
      alert("Item was deleted");
    } else {
      console.error("Failed to delete item");
      alert("Failed to delete item");
    }
  };

  // set item to be updated
  const editItem = (itemId) => {
    setEditingItemId(itemId);
    setIsEditModalOpen(true);
  };

  // form handle for update
  const handleUpdateItem = (updatedItem) => {
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
    setIsEditModalOpen(false); // Close the form after update
  };

  return (
    <div>
      <Header itemAdded={handleItemAdded} />
      {/* <h1 className="text-3xl font-bold text-gray-50 mb-6">Items</h1> */}

      <div className="bg-stone-400 p-6 space-y-6 border-t-2 border-stone-600">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Filter by Category:
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              "Action",
              "Adventure",
              "Arcade",
              "Platform",
              "Racing",
              "Shooter",
              "Sports",
            ].map((category) => (
              <label key={category} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={category}
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="text-gray-700">{category}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xl font-semibold text-gray-800 mb-2">
            Stock Status:
          </label>
          <select
            className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-500 text-gray-700"
            value={inStock === null ? "" : inStock ? "inStock" : "outOfStock"}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "") {
                setInStock(null); // reset stock when all selected
              } else {
                setInStock(value === "inStock" ? true : false);
              }
            }}
          >
            <option value="">All</option>
            <option value="inStock">In Stock</option>
            <option value="outOfStock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* item list */}
      <ul className="space-y-1 mt-1">
        {items.map((item) => (
          <li
            key={item.id}
            className="p-4 flex flex-col space-y-2 bg-stone-300"
          >
            <div className="text-lg font-semibold text-gray-950">
              {item.name}
            </div>
            <div className="text-gray-950">{item.description}</div>
            <div className="text-gray-950">
              <span className="font-medium">Category:</span> {item.category}
            </div>
            <div className="text-gray-950">
              <span className="font-medium">Quantity:</span> {item.quantity}{" "}
              {item.quantity === 0 ? (
                <span className="text-red-500">(Out of Stock)</span>
              ) : (
                <span className="text-green-500">(In Stock)</span>
              )}
            </div>
            {token && (
              <div className="flex space-x-4">
                <button
                  onClick={() => editItem(item.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* modal for edit */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <EditItemForm
          item={items.find((item) => item.id === editingItemId)}
          onUpdate={handleUpdateItem}
          onClose={() => setIsEditModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
