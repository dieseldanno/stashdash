"use client";
import { useState } from "react";
import { useAuth } from "@/context/auth";

export default function EditItemForm({ item, onUpdate, onClose }) {
  const { token } = useAuth();
  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description);
  const [quantity, setQuantity] = useState(item.quantity);
  const [category, setCategory] = useState(item.category);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Please login to edit item");
      return;
    }

    const response = await fetch(`/api/items/${item.id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        description,
        quantity: Number(quantity),
        category,
      }),
    });

    if (response.ok) {
      const updatedItem = await response.json();
      onUpdate(updatedItem); // call parent function to update
      alert("Item was updated!");
    } else {
      const error = await response.json();
      alert(error.message || "Something went wrong, try again");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Edit Item</h2>
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
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Update Item
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
