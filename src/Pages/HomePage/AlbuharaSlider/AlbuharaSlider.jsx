import React, { useState, useEffect } from 'react';
import api from '../../../Api';
import './AlbuharaSlider.scss';

const AlbuharaSlider = () => {
  const [topSlides, setTopSlides] = useState([]);
  const [bottomSlides, setBottomSlides] = useState([]);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

  useEffect(() => {
    api
      .get('/api/home-slider-top/')
      .then((res) =>
        setTopSlides(
          Array.isArray(res.data) ? res.data : res.data.results || []
        )
      )
      .catch((err) => console.error('Error fetching top slides:', err));

    api
      .get('/api/home-slider-bottom/')
      .then((res) =>
        setBottomSlides(
          Array.isArray(res.data) ? res.data : res.data.results || []
        )
      )
      .catch((err) => console.error('Error fetching bottom slides:', err));
  }, []);

  const getImageUrl = (imagePath) => {
    return imagePath.startsWith('http')
      ? imagePath
      : `${API_BASE_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  };

  return (
    <div className="sliderContainer">
      {/* Top row - slides left */}
      <div className="sliderRow">
        <div className="slideTrack slideLeft">
          {[...Array(3)].map((_, setIndex) => (
            <div key={setIndex} className="slideSet">
              {topSlides.map((slide, index) => (
                <React.Fragment key={`${setIndex}-${index}`}>
                  <div className="slideFrame">
                    <div className="frameInner">
                      <img
                        src={getImageUrl(slide.image)}
                        alt={`Top Slide ${index + 1}`}
                        onError={(e) => (e.target.src = '/fallback-image.png')}
                      />
                    </div>
                  </div>
                  <div className="slideFrame emptyFrame"></div>
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom row - slides right */}
      <div className="sliderRow">
        <div className="slideTrack slideRight">
          {[...Array(3)].map((_, setIndex) => (
            <div key={setIndex} className="slideSet">
              {bottomSlides.map((slide, index) => (
                <React.Fragment key={`${setIndex}-${index}`}>
                  <div className="slideFrame">
                    <div className="frameInner">
                      <img
                        src={getImageUrl(slide.image)}
                        alt={`Bottom Slide ${index + 1}`}
                        onError={(e) => (e.target.src = '/fallback-image.png')}
                      />
                    </div>
                  </div>
                  <div className="slideFrame emptyFrame"></div>
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlbuharaSlider;