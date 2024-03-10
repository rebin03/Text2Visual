import styles from "./styles.module.css";
import Navbar from "../Navbar/Navbar";

const Main = () => {

	return (
		<div>
			<Navbar />
			<div className={styles.main_container}>
				<div className={styles.content_container}>
					<div  className={styles.left_container_main}>
						<div className={styles.left_container}>
						<h2>Enter prompt</h2>
							<div className={styles.input_container}>
								<textarea className={styles.textarea} placeholder="Enter your prompt..." />
							</div>
						</div>
						<button className={styles.generate_button}>GENERATE</button>
						</div>
					<div className={styles.right_container_main}>
						<div className={styles.right_container}>
							<div className={styles.image_grid}>
								{/* Display 4 generated images here */}
								<div className={styles.image_container}></div>
								<div className={styles.image_container}></div>
								<div className={styles.image_container}></div>
								<div className={styles.image_container}></div>
							</div>
						</div>
						<button className={styles.save_button}>SAVE</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Main;