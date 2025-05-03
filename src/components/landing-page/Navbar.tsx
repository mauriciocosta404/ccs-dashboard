
import { Menu, X} from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50 p-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-semibold text-gray-900 w-[6rem]"><img src="/assets/logo.png" alt="" /></span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-700 hover:text-indigo-600">Início</a>
            <a href="#about" className="text-gray-700 hover:text-indigo-600">Sobre</a>
            <a href="#services" className="text-gray-700 hover:text-indigo-600">Cultos</a>
            <a href="#events" className="text-gray-700 hover:text-indigo-600">Eventos</a>
            <a href="#contact" className="text-gray-700 hover:text-indigo-600">Contato</a>
            <a
                    href="/signin"
                    className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg text-sm font-normal hover:bg-indigo-700 transition duration-300 animate-fadeIn animate-delay-200"
                  >
                    Entrar
                  </a>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-indigo-600"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#home" className="block px-3 py-2 text-gray-700 hover:text-indigo-600">Início</a>
            <a href="#about" className="block px-3 py-2 text-gray-700 hover:text-indigo-600">Sobre</a>
            <a href="#services" className="block px-3 py-2 text-gray-700 hover:text-indigo-600">Cultos</a>
            <a href="#events" className="block px-3 py-2 text-gray-700 hover:text-indigo-600">Eventos</a>
            <a href="#contact" className="block px-3 py-2 text-gray-700 hover:text-indigo-600">Contato</a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;