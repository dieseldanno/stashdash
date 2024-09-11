"use client";
import { useState } from "react";
import { useAuth } from "@/context/auth";

export default function ItemForm({ onClose, itemAdded }) {
  const { token } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [category, setCategory] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("You must be logged in to add new item");
      return;
    }

    const response = await fetch("/api/items", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        description,
        quantity,
        category,
      }),
    });

    if (response.ok) {
      const newItem = await response.json();
      alert("New item was added!");
      itemAdded(newItem);
      onClose();
    } else {
      const error = await response.json();
      alert(error.message || "Something went wrong, try again");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Add New Item</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 text-gray-700">
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded text-gray-700"
            required
          />
        </label>
        <label className="block mb-2 text-gray-700">
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded text-gray-700"
            required
          />
        </label>
        <label className="block mb-2 text-gray-700">
          Quantity:
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min="0"
            className="w-full p-2 border rounded text-gray-700"
            required
          />
        </label>
        <label className="block mb-4 text-gray-700">
          Category:
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded text-gray-700"
            required
          />
        </label>
        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Add Item
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
