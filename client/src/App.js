import { Route, Routes, Navigate, useParams } from "react-router-dom";
import Signup from "./components/Signup/index";
import Login from "./components/Login/index";
import TextToImageConverter from "./components/Generate/index";
import ImageGallery from "./components/Gallery/index";
import ImageEdit from "./components/Editing/index";


function App() {
	const user = localStorage.getItem("token");

	return (
		<Routes>
			{user && <Route path="/" exact element={<TextToImageConverter />} />}
			<Route path="/signup" exact element={<Signup />} />
			<Route path="/login" exact element={<Login />} />
			<Route path="/generate" exact element={<TextToImageConverter />} />
			<Route path="/gallery" exact element={<ImageGallery />} />
			<Route path="/edit/:id" element={<ImageEditWithImage />} />
			<Route path="/" element={<Navigate replace to="/login" />} />
		</Routes>
	);
}

function ImageEditWithImage() {
	const { id } = useParams();
	return <ImageEdit id={id} />;
}

export default App;