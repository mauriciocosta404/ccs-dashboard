import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const Gallery = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState<number | null>(null);

  const images = [
    {
      url: '/assets/mpzola3.jpg',
      title: 'Culto de Natal',
      description: 'Celebração especial com toda a congregação'
    },
    {
      url: '/assets/galeria1.jpg',
      title: 'Batismos',
      description: 'Momento especial de entrega e renovação'
    },
    {
      url: '/assets/galeria2.jpg',
      title: 'Ação Social',
      description: 'Servindo nossa comunidade com amor'
    },
    {
      url: '/assets/galeria3.jpg',
      title: 'Grupo de Jovens',
      description: 'Momentos de comunhão e diversão'
    },
    {
      url: '/assets/galeria4.jpg',
      title: 'Conferência de Família',
      description: 'Fortalecendo laços familiares'
    },
    {
      url: '/assets/galeria5.jpg',
      title: 'Retiro Espiritual',
      description: 'Momentos de conexão com Deus'
    },
    {
      url: '/assets/galeria6.jpg',
      title: 'Retiro Espiritual',
      description: 'Momentos de conexão com Deus'
    },
    {
      url: '/assets/galeria7.jpg',
      title: 'Retiro Espiritual',
      description: 'Momentos de conexão com Deus'
    },
    {
      url: '/assets/galeria8.jpg',
      title: 'Retiro Espiritual',
      description: 'Momentos de conexão com Deus'
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 3) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 3 + images.length) % images.length);
  };

  const openModal = (index: number) => {
    setModalImage(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalImage(null);
  };

  const nextImage = () => {
    if (modalImage !== null) {
      setModalImage((modalImage + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (modalImage !== null) {
      setModalImage((modalImage - 1 + images.length) % images.length);
    }
  };

  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Galeria de Momentos
          </h2>
          <p className="text-lg text-gray-600">
            Memórias especiais de nossa comunidade
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * (100 / 3)}%)` }}
            >
              {images.map((image, index) => (
                <div
                  key={index}
                  className="min-w-[33.333%] px-4"
                  onClick={() => openModal(index)}
                >
                  <div className="group relative overflow-hidden rounded-lg shadow-lg cursor-pointer">
                    <img
                      src={image.url}
                      alt={image.title}
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h3 className="text-xl font-semibold mb-2">{image.title}</h3>
                        <p className="text-sm">{image.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white transition-colors duration-200"
          >
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white transition-colors duration-200"
          >
            <ChevronRight className="w-6 h-6 text-gray-800" />
          </button>
        </div>

        {/* Modal */}
        {modalOpen && modalImage !== null && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
            <div className="relative w-full max-w-6xl mx-4">
              <button
                onClick={closeModal}
                className="absolute -top-12 right-0 text-white hover:text-gray-300"
              >
                <X className="w-8 h-8" />
              </button>
              
              <div className="relative">
                <img
                  src={images[modalImage].url}
                  alt={images[modalImage].title}
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
                
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white transition-colors duration-200"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-800" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white transition-colors duration-200"
                >
                  <ChevronRight className="w-6 h-6 text-gray-800" />
                </button>
              </div>
              
              <div className="text-white text-center mt-4">
                <h3 className="text-2xl font-semibold mb-2">{images[modalImage].title}</h3>
                <p className="text-lg">{images[modalImage].description}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;