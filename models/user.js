import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
	email: {
		type: String,
		unique: [true, "Email already exists!"],
		required: [true, "Email is required!"],
	},
	username: {
		type: String,
		required: [true, "Username is required!"],
		match: [
			/^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
			"Username invalid, it should contain 8-20 alphanumeric letters and be unique!",
		],
	},
	image: {
		type: String,
		required: [true, "User Image is required"], //I added this
	},
});

//The "models" object is provided by the Mongoose Library and stores all the registered models.
//If a model "User" alreagy exists in the "models" object, it assings that existing model to the "User" variable.
//This prevents redefining the model and ensures that the existing model is reused.

//If a model named "User" does not exist in the "models" object, the "model" function from Mongoose is called to create a new model.
// The newly created model is then assigned to the "User" variable.

//**This is because this (route.js gets called) gets called every time we make a connection, so we want to use the same existing model and not redefine a new one (this would not be the case if we were using a regular Express backend which is always running, in NextsJS the route is only going to be created and running for the time it is getting called. With an Express backend we would simply type "const model("User", UserSchema))

const User = models.User || model("User", UserSchema);
export default User;
