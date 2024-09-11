"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth";
import Header from "@/components/Header";
import EditItemForm from "@/components/EditItemForm";

export default function ItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [inStock, setInStock] = useState(null);
  const [editingItemId, setEditingItemId] = useState(null);
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
    } else {
      console.error("Failed to delete item");
      alert("Failed to delete item");
    }
  };

  // set item to be updated
  const editItem = (itemId) => {
    setEditingItemId(itemId);
  };

  // form handle for update
  const handleUpdateItem = (updatedItem) => {
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
    setEditingItemId(null); // Close the form after update
  };

  return (
    <div>
      <Header itemAdded={handleItemAdded} />
      <h1>Items List</h1>
      <div>
        <h3>Filter by Category:</h3>
        <label>
          <input
            type="checkbox"
            value="Action"
            checked={selectedCategories.includes("Action")}
            onChange={() => handleCategoryChange("Action")}
          />
          Action
        </label>
        <label>
          <input
            type="checkbox"
            value="Adventure"
            checked={selectedCategories.includes("Adventure")}
            onChange={() => handleCategoryChange("Adventure")}
          />
          Adventure
        </label>
        <label>
          <input
            type="checkbox"
            value="Arcade"
            checked={selectedCategories.includes("Arcade")}
            onChange={() => handleCategoryChange("Arcade")}
          />
          Arcade
        </label>
        <label>
          <input
            type="checkbox"
            value="Platform"
            checked={selectedCategories.includes("Platform")}
            onChange={() => handleCategoryChange("Platform")}
          />
          Platform
        </label>
        <label>
          <input
            type="checkbox"
            value="Racing"
            checked={selectedCategories.includes("Racing")}
            onChange={() => handleCategoryChange("Racing")}
          />
          Racing
        </label>
        <label>
          <input
            type="checkbox"
            value="Shooter"
            checked={selectedCategories.includes("Shooter")}
            onChange={() => handleCategoryChange("Shooter")}
          />
          Shooter
        </label>
        <label>
          <input
            type="checkbox"
            value="Sports"
            checked={selectedCategories.includes("Sports")}
            onChange={() => handleCategoryChange("Sports")}
          />
          Sports
        </label>

        <label>
          Stock Status:
          <select
            className="text-gray-700"
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
        </label>
      </div>

      {/* Display Items */}
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <strong>{item.name}</strong> - {item.description} - {item.category}-{" "}
            {item.quantity}
            {item.quantity === 0 ? (
              <span> (Out of Stock)</span>
            ) : (
              <span> (In Stock)</span>
            )}
            {token && (
              <>
                <button onClick={() => editItem(item.id)}>Edit</button>
                <button onClick={() => deleteItem(item.id)}>Delete</button>

                {editingItemId === item.id && (
                  <EditItemForm item={item} onUpdate={handleUpdateItem} />
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
