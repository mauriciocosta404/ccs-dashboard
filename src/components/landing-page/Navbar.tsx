
import { Menu, X} from 'lucide-react';
import { useState } from 'react';
//import Button from '../ui/button/Button';
//import { Link } from 'react-router';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="backdrop-blur-md bg-white/60 shadow-lg sticky top-0 w-full z-50 p-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-semibold text-gray-900 w-[6rem]"><img src="/assets/logo.png" alt="" /></span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="/#home" className="text-gray-700 hover:text-indigo-600">Início</a>
            <a href="/#about" className="text-gray-700 hover:text-indigo-600">Sobre</a>
            <a href="/#services" className="text-gray-700 hover:text-indigo-600">Cultos</a>
            <a href="/#events" className="text-gray-700 hover:text-indigo-600">Eventos</a>
            <a href="/sermons" className="text-gray-700 hover:text-indigo-600">Pregações</a>
            <a href="/bible" className="text-gray-700 hover:text-indigo-600">Bíblia</a>
            <a href="/#contact" className="text-gray-700 hover:text-indigo-600">Contactos</a>
            {/*<a
              href="/signin"
              className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg text-sm font-normal hover:bg-indigo-700 transition duration-300 animate-fadeIn animate-delay-200"
            >
              Entrar
            </a>*/}
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
            <a href="/#home" className="block px-3 py-2 text-gray-700 hover:text-indigo-600">Início</a>
            <a href="/#about" className="block px-3 py-2 text-gray-700 hover:text-indigo-600">Sobre</a>
            <a href="/#services" className="block px-3 py-2 text-gray-700 hover:text-indigo-600">Cultos</a>
            <a href="/#events" className="block px-3 py-2 text-gray-700 hover:text-indigo-600">Eventos</a>
            <a
              href="/sermons"
              className="block px-3 py-2 text-gray-700 hover:text-indigo-600"
            >
              Pregações
            </a>
            <a
              className="block px-3 py-2 text-gray-700 hover:text-indigo-600"
              href='/bible' 
            >
              Bíblia
            </a>
            <a href="/#contact" className="block px-3 py-2 text-gray-700 hover:text-indigo-600">Contactos</a>
            {/*<Link to={"/signin"}>
              <Button
                className="w-full flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                Sign in
              </Button>
            </Link>*/}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;