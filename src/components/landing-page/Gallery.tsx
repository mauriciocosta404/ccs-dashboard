import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import 'swiper/css';
import 'swiper/css/navigation';

const Gallery = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

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
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={16}
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            navigation={true}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            className="gallery-swiper"
          >
            {images.map((image, index) => (
              <SwiperSlide key={index}>
                <div
                  className="px-2"
                  onClick={() => {
                    setLightboxIndex(index);
                    setLightboxOpen(true);
                  }}
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
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          index={lightboxIndex}
          slides={images.map((image) => ({
            src: image.url,
            alt: image.title,
            title: image.title,
            description: image.description
          }))}
          controller={{
            closeOnBackdropClick: true
          }}
        />
      </div>
    </section>
  );
};

export default Gallery;