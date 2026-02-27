import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

 //get user details from frontend
  //validation - not empty
  //check if user already exists : username / email
  //check for images, check for avatar
  //upload them to cloudinary, check aavtar
  //create user object - create db entry
  //remove password anf refreshtoken field from response
  //check for user creation
  //response return
const registerUser = asyncHandler(async (req, res) => {
 console.log(req.files)
  const { fullname, email, password, username } = req.body;

  //   if (
  //     [fullname, email, username, password].some((field) => field?.trim() === "")
  //   ) {
  //     throw new ApiError(400, "all fields are requiredd");
  //   }

  if (!fullname || !email || !username || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "user, email already exist");
  }

  //“If this exists, then go inside. If not, don’t crash.”
  const avatarLocalPath = req.files?.avatar[0]?.path;

 const coverImageLocalPath =  req.files?.coverImage[0]?.path;

 //example
 console.log("req.files", req.files)
 console.log("avatarLocalPath", avatarLocalPath);
 console.log("coverImageLocalPath", coverImageLocalPath);

  if(!avatarLocalPath){
    throw new ApiError(400, "avatar file is required")
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  //exa
  console.log("avatar res :" , avatar)

  if(!avatar){
    throw new ApiError(400, "Avatar field is required");
  }

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username:username.toLowerCase()
  })

  const createdUser = await User.findById(user._id).select("-password, -refreshToken")

  if(!createdUser){
     throw new ApiError(500, "something went wrong while registering the user");
  }
 
return res
  .status(201)
  .json(new ApiResponse(200, createdUser, "user registered successfully"));

});




export { registerUser };
