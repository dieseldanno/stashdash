"use client";
import { useState } from "react";
import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Modal from "@/components/Modal";
import ItemForm from "@/components/ItemForm";

function Header({ itemAdded }) {
  const auth = useAuth();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const logoutUser = (e) => {
    e.preventDefault();
    auth.logout();
    router.push("/");
  };

  const modalOpen = () => setIsModalOpen(true);
  const modalClose = () => setIsModalOpen(false);

  return (
    <header className="flex items-center justify-between bg-stone-400 p-6">
      <h1 className="text-3xl font-bold text-black">Stashdash</h1>
      <div className="flex items-center space-x-4">
        {auth.token && (
          <button
            onClick={modalOpen}
            className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
          >
            Add New Item
          </button>
        )}
        {auth.token ? (
          <Link
            href="/"
            onClick={logoutUser}
            className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
          >
            Logout
          </Link>
        ) : (
          <Link
            href="/"
            className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
          >
            Login
          </Link>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={modalClose}>
        <ItemForm onClose={modalClose} itemAdded={itemAdded} />
      </Modal>
    </header>
  );
}
export default Header;
