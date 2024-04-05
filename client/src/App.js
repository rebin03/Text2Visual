import { Route, Routes, Navigate, useParams } from "react-router-dom";
import Nav from "./components/Navbar/Nav";
import Signup from "./components/Signup/index";
import Login from "./components/Login/index";
import TextToImageConverter from "./components/Generate";
import ImageGallery from "./components/Gallery/index";
import ImageEdit from "./components/Editing/index";
import TestEdit from "./components/Editing/testEdit";


function App() {
	const user = localStorage.getItem("token");

	return (
		<Routes>
			{user && <Route path="/" exact element={<Nav />} />}
			<Route path="/signup" exact element={<Signup />} />
			<Route path="/login" exact element={<Login />} />
			<Route path="/generateImg" exact element={<TextToImageConverter />} />
			<Route path="/generate" exact element={<Nav />} />
			<Route path="/gallery" exact element={<ImageGallery />} />
			<Route path="/edit/:id" element={<ImageEditWithImage />} />
			<Route path="/" element={<Navigate replace to="/login" />} />
		</Routes>
	);
}

function ImageEditWithImage() {
	const { id } = useParams();
	return <TestEdit id={id} />;
}

export default App;
