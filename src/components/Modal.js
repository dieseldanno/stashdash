export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
        <button className="text-red-500 float-right" onClick={onClose}>
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
