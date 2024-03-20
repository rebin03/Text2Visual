import { Route, Routes, Navigate } from "react-router-dom";
import Main from "./components/Main";
import Signup from "./components/Signup/index";
import Login from "./components/Login/index";
// import ImageGallery from "./components/Gallery/index"

function App() {
	const user = localStorage.getItem("token");

	return (
		<Routes>
			{user && <Route path="/" exact element={<Main />} />}
			<Route path="/signup" exact element={<Signup />} />
			<Route path="/login" exact element={<Login />} />
			<Route path="/" element={<Navigate replace to="/login" />} />
		</Routes>
	// 	<div className="app">
    //   <h1>Image Gallery</h1>
    //   <ImageGallery />
    // </div>
	);
}

export default App;
