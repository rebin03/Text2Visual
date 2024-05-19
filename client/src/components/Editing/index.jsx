import React, { useState, useRef, useEffect } from "react";
import styles from "./styles.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUndo, faRedo, faArrowsAltH, faArrowsAltV } from "@fortawesome/free-solid-svg-icons";
import { Buffer } from 'buffer/';
import axios from "axios";
import NavbarEdit from "../Navbar/NavbarEdit";


const filterOptions = [
  { id: "brightness", name: "Brightness" },
  { id: "saturation", name: "Saturation" },
  { id: "inversion", name: "Inversion" },
  { id: "grayscale", name: "Grayscale" },
];

function ImageEdit({ id }) {
  const [image, setImage] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const [activeFilter, setActiveFilter] = useState("brightness");
  const [sliderValue, setSliderValue] = useState(100);
  const [brightness, setBrightness] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [inversion, setInversion] = useState(0);
  const [grayscale, setGrayscale] = useState(0);
  const [rotate, setRotate] = useState(0);
  const [flipHorizontal, setFlipHorizontal] = useState(1);
  const [flipVertical, setFlipVertical] = useState(1);
  const [filteredImageData, setFilteredImageData] = useState(null);


  const fileInputRef = useRef(null);
  const previewImgRef = useRef(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/images/${id}`);
        setImage(response.data);
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    };

    fetchImage();
  }, [id]);

  const resetFilter = () => {
    setBrightness("100");
    setSaturation("100");
    setInversion("0");
    setGrayscale("0");
    setRotate(0);
    setFlipHorizontal(1);
    setFlipVertical(1);
    setActiveFilter("brightness");
    setSliderValue(100);
  };

  const saveImage = async () => {
    try {
      // Apply filters to the image
      applyFilter();
  
      // Get the filtered image data
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = previewImgRef.current.width;
      canvas.height = previewImgRef.current.height;
      context.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
      context.translate(canvas.width / 2, canvas.height / 2);
      context.rotate((rotate * Math.PI) / 180);
      context.scale(flipHorizontal, flipVertical);
      context.drawImage(previewImgRef.current, -canvas.width / 2, -canvas.height / 2);
      const filteredImageData = canvas.toDataURL(); // Get the base64 encoded image data
  
      // Convert base64 data to Blob
      const base64Image = filteredImageData.split(',')[1];
      const blob = b64toBlob(base64Image);
  
      // // Create form data
      const formData = new FormData();
      formData.append('image', blob);
      formData.append('contentType', image.contentType);
      formData.append('inputText', image.inputText);
      formData.append('userId', image.userId);

      // Send the filtered image data to the backend
      await axios.post(`http://localhost:8080/api/images/saveEdit`, formData);
      
      // Optionally, you can also update the state or show a success message here
      console.log('Image saved successfully!');
      window.alert("Image Saved Successfully!");
    } catch (error) {
      console.error('Error saving image:', error);
      // Handle error, show error message, etc.
    }
  };  
  
  
  const updateImage = async () => {
    try {
      // Apply filters to the image
      applyFilter();
  
      // Get the filtered image data
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = previewImgRef.current.width;
      canvas.height = previewImgRef.current.height;
      context.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
      context.translate(canvas.width / 2, canvas.height / 2);
      context.rotate((rotate * Math.PI) / 180);
      context.scale(flipHorizontal, flipVertical);
      context.drawImage(previewImgRef.current, -canvas.width / 2, -canvas.height / 2);
      const filteredImageData = canvas.toDataURL(); // Get the base64 encoded image data
  
      // Convert base64 data to Blob
      const base64Image = filteredImageData.split(',')[1];
      const blob = b64toBlob(base64Image);
  
      // Create form data
      const formData = new FormData();
      formData.append('image', blob);
  
      // Send the filtered image data to the backend
      await axios.put(`http://localhost:8080/api/images/${id}`, formData);
  
      // Optionally, you can also update the state or show a success message here
      console.log('Image updated successfully!');
      window.alert("Image Updated Successfully!");
    } catch (error) {
      console.error('Error updating image:', error);
      // Handle error, show error message, etc.
    }
  };
  
  // Function to convert base64 to Blob
  function b64toBlob(base64Data) {
    const byteCharacters = atob(base64Data);
    const byteArrays = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
  
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
  
    const blob = new Blob(byteArrays, { type: 'image/jpeg' });
    return blob;
  }
  
  


  const applyFilter = () => {
    if (!previewImgRef.current) return;
  
    const filterStyle = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    const transformStyle = `rotate(${rotate}deg) scaleX(${flipHorizontal}) scaleY(${flipVertical})`;
  
    previewImgRef.current.style.filter = filterStyle;
    previewImgRef.current.style.transform = transformStyle;
  
    // Also update filteredImageData state with filtered data
    const filteredData = {
      base64Data: previewImgRef.current.src,
      metadata: {
        filters: {
          brightness,
          saturation,
          inversion,
          grayscale
        },
        rotation: rotate,
        flipHorizontal,
        flipVertical
      }
    };
  
    setFilteredImageData(filteredData);
  };
  

  useEffect(() => {
    applyFilter();
  }, [brightness, saturation, inversion, grayscale, rotate, flipHorizontal, flipVertical]);

  const handleFilterClick = (option) => {
    setActiveFilter(option.id);

    switch (option.id) {
      case "brightness":
        setSliderValue(brightness);
        break;
      case "saturation":
        setSliderValue(saturation);
        break;
      case "inversion":
        setSliderValue(inversion);
        break;
      default:
        setSliderValue(grayscale);
    }
  };

  const handleSliderChange = (event) => {
    const value = event.target.value;
    setSliderValue(value);

    switch (activeFilter) {
      case "brightness":
        setBrightness(value);
        break;
      case "saturation":
        setSaturation(value);
        break;
      case "inversion":
        setInversion(value);
        break;
      case "grayscale":
        setGrayscale(value);
        break;
      default:
        break;
    }
  };

  const handleRotate = (option) => {
    if (option === "left") {
      setRotate(rotate - 90);
    } else if (option === "right") {
      setRotate(rotate + 90);
    } else if (option === "horizontal") {
      setFlipHorizontal(flipHorizontal === 1 ? -1 : 1);
    } else {
      setFlipVertical(flipVertical === 1 ? -1 : 1);
    }
  };

  const handleFlip = (axis) => {
    if (axis === "horizontal") {
      setFlipHorizontal((prev) => -prev);
    } else if (axis === "vertical") {
      setFlipVertical((prev) => -prev);
    }
  };

  return (
    <div>
      <NavbarEdit />
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.editorPanel}>
            <div className={styles.filter}>
              <label className={styles.title}>Filters</label>
              <div className={styles.options}>
                {filterOptions.map((option) => (
                  <button
                    key={option.id}
                    className={option.id === activeFilter ? styles.active : ""}
                    onClick={() => handleFilterClick(option)}
                  >
                    {option.name}
                  </button>
                ))}
              </div>
              <div className={styles.slider}>
                <div className={styles.filterInfo}>
                  <p className={styles.name}>{activeFilter}</p>
                  <p className={styles.value}>{`${sliderValue}%`}</p>
                </div>
                <input
                  type="range"
                  min={activeFilter === "brightness" || activeFilter === "saturation" ? 0 : -100}
                  max={activeFilter === "brightness" || activeFilter === "saturation" ? 200 : 100}
                  value={sliderValue}
                  onChange={handleSliderChange}
                />
              </div>
            </div>
            <div className={styles.rotate}>
              <label className={styles.title}>Rotate & Flip</label>
              <div className={styles.options}>
                <button onClick={() => handleRotate("left")}>
                  <FontAwesomeIcon icon={faUndo} />
                </button>
                <button onClick={() => handleRotate("right")}>
                  <FontAwesomeIcon icon={faRedo} />
                </button>
                <button onClick={() => handleFlip("horizontal")}>
                  <FontAwesomeIcon icon={faArrowsAltH} />
                </button>
                <button onClick={() => handleFlip("vertical")}>
                  <FontAwesomeIcon icon={faArrowsAltV} />
                </button>
              </div>
            </div>
          </div>
          <div className={styles.previewImg}>
            {previewImg || image ? (
              <img
                src={previewImg ? URL.createObjectURL(previewImg) : `data:${image.contentType};base64,${Buffer.from(image.imageData.data).toString('base64')}`}
                alt="preview"
                ref={previewImgRef}
                onLoad={applyFilter}
              />
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </div>
        <div className={styles.controls}>
          <button className={styles.resetFilter} onClick={() => resetFilter()}>Reset Filters</button>
          <div className={styles.row}>
            <input
              type="file"
              className={styles.fileInput}
              accept="image/*"
              hidden
              ref={fileInputRef}
              onChange={(e) => setPreviewImg(e.target.files[0])}
            />
            <button onClick={updateImage} className={styles.saveImg}>
              Update Image
            </button>
            <button
              className={styles.chooseImg}
              onClick={saveImage}
            >
              Save Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageEdit;