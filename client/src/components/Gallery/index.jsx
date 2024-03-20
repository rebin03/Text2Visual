import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './styles.module.css'
import ImageCard from './ImageCard';

const ImageGallery = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
        const response = await axios.get('http://localhost:8080/api/images');
        const imagesData = response.data;
        const imagesWithUrls = imagesData.map(image => ({
          ...image,
          imageURL: `http://localhost:8080/api/images/${image.imageURL.replace(/\\/g, "/")}`
        }));
        setImages(imagesWithUrls);
        console.log(imagesWithUrls);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
  };

  return (
    <div className={styles.image_gallery}>
      {images.map(image => (
        <ImageCard key={image._id} image={image} />
      ))}
    </div>
  );
};

export default ImageGallery;
