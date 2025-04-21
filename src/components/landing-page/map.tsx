import {  MapPin} from 'lucide-react';
import React from 'react';

export const Maps = () => {
  return (
    <section id="contact" className="py-10 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      {/* Map Section */}
      <div className="mt-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <h3 className="text-xl font-semibold text-gray-900 p-6 border-b">Nossa Localização</h3>
          <div className="aspect-video w-full">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3941.958110711439!2d13.18414159610791!3d-8.883486794041048!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a51f5f0452aa48f%3A0x7ae5463351910f4b!2zQURPTkFJIENlbsOhY3VsbyBkYSBTYWx2YcOnw6Nv!5e0!3m2!1spt-PT!2sao!4v1743283607148!5m2!1spt-PT!2sao" 
              width="100%" 
              height="50" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização da Igreja da Paz"
              className="w-full h-full"
            ></iframe>
          </div>
          <div className="p-6 bg-gray-50">
            <div className="flex items-center text-indigo-600">
              <MapPin className="h-5 w-5 mr-2" />
              <span className="font-medium">Frente ao ENAPP, Estr. da Samba, Luanda</span>
            </div>
            <p className="mt-2 text-gray-600">
              Estamos localizados em uma área de fácil acesso, próximo ao transporte público.
              Venha nos visitar!
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
  );
};
