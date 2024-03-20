import React from 'react';
import styles from './styles.module.css'

const ImageCard = ({ image }) => {
  return (
    <div className={styles.image_card}>
      <img src={image.imageURL} alt={image.description} />
      <p>{image.description}</p>
    </div>
  );
};

export default ImageCard;
