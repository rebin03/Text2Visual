import React, { useState } from 'react';
import axios from 'axios';
import styles from './styles.module.css'
import Navbar from "../Navbar/Navbar";
import secureLocalStorage from 'react-secure-storage';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Nav = () => {
    const [inputTxt, setInputTxt] = useState('');
    const [imageSrc, setImageSrc] = useState('');
    const [loading, setLoading] = useState(false);
    const [savingLoading, setSavingLoading] = useState(false);
    const [text, setText] = useState('');
    
    const model = process.env.REACT_APP_MODEL
    const token = process.env.REACT_APP_KEY;

    const userId = secureLocalStorage.getItem('userId');

    const keywords = ['birds', 'bird', 'parrot', 'peacock', 'sparrow', 'hummingbird', 'pigeon', 'crow', 'blackbird', 'goldfinch', 'hawk', 'eagle', 'owl', 'falcon', 'seagull', 'kingfisher', 'woodpecker', 'vulture', 'raven', 'house sparrow', 'mourning dove', 'dove', 'penguin', 'duck', 'flamingo', 'albatross', 'heron', 'crane', 'kiwi', 'ostrich', 'cuckoo', 'hornbill', 'toucan', 'pelican', 'bulbul', 'geese', 'hen', 'blue jay', 'nightingale', 'cardinals', 'swan'];
 

    const shouldGenerateImage = () => {
        return keywords.some(keyword => inputTxt.toLowerCase().includes(keyword));
    };

    // const handleInputTextChange = (e) => {
    //     setInputText(e.target.value);
    // };

    const query = async (queryInput) => {
    try {
        
        const response = await fetch(
            model,
            {
                headers: { Authorization: `Bearer ${token}` },
                method: "POST",
                body: JSON.stringify({ "inputs": queryInput }),
            }
        );
        if (!response.ok) {
            throw new Error('Failed to generate image. Please check your input and try again.');
        }
        const result = await response.blob();
        return result;
    } catch (error) {
        throw "Something went wrong";
    }
};


    const degradeImage = (blob) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = function () {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                const targetWidth = 256;
                const targetHeight = 256;
                canvas.width = targetWidth;
                canvas.height = targetHeight;

                ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, targetWidth, targetHeight);
                ctx.filter = 'blur(10px)';

                const noiseIntensity = 70;
                for (let x = 0; x < targetWidth; x++) {
                    for (let y = 0; y < targetHeight; y++) {
                        const r = Math.random() * noiseIntensity;
                        const g = Math.random() * noiseIntensity;
                        const b = Math.random() * noiseIntensity;
                        ctx.fillStyle = `rgba(${r},${g},${b},0.1)`;
                        ctx.fillRect(x, y, 1, 1);
                    }
                }

                canvas.toBlob((degradedBlob) => {
                    resolve(degradedBlob);
                }, 'image/jpeg', 0.1);
            };
            img.src = URL.createObjectURL(blob);
        });
    };

    const handleClick = async () => {
        setLoading(true);
        let queryInput = inputTxt; // Initialize query input with the user's input
        const defaultInputs = ['white blurry image without any object', 'Hash blurry image without any object', 'dark brown blurry image without any object'];
    
        // Check if the input is empty or does not contain any keywords
        if (!shouldGenerateImage()) {
            // Randomly select a default input
            queryInput = defaultInputs[Math.floor(Math.random() * defaultInputs.length)];
        }
    
        setText(queryInput);
    
        try {
            const response = await query(queryInput);
            const degradedBlob = await degradeImage(response);
            setImageSrc(URL.createObjectURL(degradedBlob));
        } catch (error) {
            console.error('Error generating image:', error);
            // Optionally set imageSrc to null or any default value on error
        } finally {
            setLoading(false);
        }
    };
    


    const handleSaveClick = async () => {
        setSavingLoading(true);
        try {
            const response = await query(text);
            const degradedBlob = await degradeImage(response);
    
            // Create a FormData object and append the image blob
            const formData = new FormData();
            formData.append('image', degradedBlob, 'generated-image.jpg');
            formData.append('inputText', inputTxt);
            formData.append('userId', userId);

    
            // Send the FormData to the backend server using Axios
            const backendResponse = await axios.post(`${BASE_URL}/api/images/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
    
            if (backendResponse.status === 201) {
                console.log('Image saved successfully');
                window.alert("Image Saved Successfully!");
            } else {
                console.error('Failed to save image');
            }
        } catch (error) {
            console.error('Error saving image:', error);
        } finally {
            setSavingLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div className={styles.main_container}>
                <div className={styles.content_container}>
                    <div className={styles.left_container_main}>
                        <div className={styles.left_container}>
                            <h2>Enter prompt</h2>
                            <div className={styles.input_container}>
                                <textarea
                                    className={styles.textarea}
                                    placeholder="Enter your prompt..."
                                    value={inputTxt}
                                    onChange={(e) => setInputTxt(e.target.value)}
                                />
                            </div>
                            <button className={styles.generate_button} onClick={handleClick}>GENERATE</button>
                        </div>
                    </div>
                    <div className={styles.right_container_main}>
                        <div className={styles.right_container}>
                            {loading ? ( 
                                <div className={styles.loading}>Loading...</div>
                            ) : (
                                <div className={styles.image_grid}>
                                    {imageSrc && <img className={styles.image_container} src={imageSrc}  alt="Generated Image"/>}
                                </div>
                            )}
                            {savingLoading ? (
                                <div className={styles.loading}>Saving...</div>
                            ) : (
                                <>
                                {!loading && imageSrc && <button className={styles.save_button} onClick={handleSaveClick}>SAVE</button>}
                                </>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Nav;