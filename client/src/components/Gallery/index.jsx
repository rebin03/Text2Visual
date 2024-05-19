import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './styles.module.css'
import ImageCard from './ImageCard';
import Navbar from '../Navbar/Navbar';
import secureLocalStorage from 'react-secure-storage';

const ImageGallery = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
        const userId = secureLocalStorage.getItem('userId');
        const response = await axios.get(`http://localhost:8080/api/images/gallery/${userId}`);
        const imagesData = response.data;
        setImages(imagesData);
    } catch (error) {
        console.error('Error fetching images:', error);
    }
  };

  const handleImageDelete = async () => {
    // After successful deletion, refetch the images
    window.location.reload();
  };

  return (
    <div>
      <Navbar/>
      <div className={styles.image_gallery}>
      {images.map(image => (
        <ImageCard key={image._id} image={image} onDelete={handleImageDelete}/>
      ))}
    </div>
    </div>
  );
};

export default ImageGallery;