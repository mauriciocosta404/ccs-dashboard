import { FaWhatsapp } from "react-icons/fa";

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/244931065964" // <-- substitui pelo teu número (código do país incluído)
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 z-50"
    >
      <FaWhatsapp />
    </a>
  );
};

export default WhatsAppButton;
