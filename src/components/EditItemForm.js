"use client";
import { useState } from "react";
import { useAuth } from "@/context/auth";

export default function EditItemForm({ item, onUpdate }) {
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
      onUpdate(updatedItem); // Call the parent function to update the item in the list
    } else {
      const error = await response.json();
      alert(error.message || "Something went wrong, try again");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input
          className="text-gray-700"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label>
        Description:
        <textarea
          className="text-gray-700"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>
      <label>
        Quantity:
        <input
          className="text-gray-700"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          min="0"
        />
      </label>
      <label>
        Category:
        <input
          className="text-gray-700"
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </label>
      <button className="text-blue-700" type="submit">
        Update Item
      </button>
    </form>
  );
}
