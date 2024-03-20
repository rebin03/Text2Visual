const mongoose = require("mongoose");

// To make sure we get an error if a required field is missing in the query filterconst Schema = mongoose.Schema;
mongoose.set('strictQuery', true); 


module.exports = () => {
	const connectionParams = {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	};
	try {
		mongoose.connect(process.env.DB, connectionParams);
		console.log("Connected to database successfully");
	} catch (error) {
		console.log(error);
		console.log("Could not connect database!");
	}
};
