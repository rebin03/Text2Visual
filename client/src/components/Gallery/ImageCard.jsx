import React, { useState } from "react";
import styles from "./styles.module.css";
import { Buffer } from "buffer";
import binIcon from "../../images/trash.png";
import editIcon from "../../images/pencil.png";
import downloadIcon from "../../images/download.png"
import axios from "axios";
import { Link } from "react-router-dom";

const ImageCard = ({ image, onDelete }) => {
  const [showEditModal, setShowEditModal] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this image?",
    );
    if (!confirmed) {
      return;
    }
    try {
      // Make a DELETE request to the backend API
      const response = await axios.delete(
        `http://localhost:8080/api/delete/${image._id}`,
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error deleting image:", error);
    } finally {
      onDelete();
    }
  };

  const imgSrc = `data:${image.contentType};base64,${Buffer.from(
    image.imageData.data,
  ).toString("base64")}`;

  const handleDownload = () => {
    var a = document.createElement("a"); //Create <a>
    a.href = imgSrc;
    a.download = "Image.jpeg"; //File name Here
    a.click(); //Downloaded file
  };
  return (
    <div className={styles.image_card}>
      <div className={styles.image_container}>
        <img src={imgSrc} alt={image.inputText} />
        <div className={styles.button_container}>
          <Link to={`/edit/${image._id}`}>
            <button className={styles.edit_button}>
              <img src={editIcon} alt="Edit" className={styles.edit_icon} />
            </button>
          </Link>
          <button className={styles.delete_button} onClick={handleDelete}>
            <img src={binIcon} alt="Delete" className={styles.delete_icon} />
          </button>
          <button className={styles.delete_button} onClick={handleDownload}>
            <img src={downloadIcon} alt="Delete" className={styles.delete_icon} 
      style={{filter: "invert(100%)"}}
      />
          </button>
        </div>
      </div>
      <p>{image.inputText}</p>
    </div>
  );
};

export default ImageCard;