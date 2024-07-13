const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.PORT || 3000;

const host = process.env.HOST || "192.168.29.11";

// Log the environment variables to confirm they are loaded
console.log("MONGO_URI:", process.env.MONGO_URI);
console.log("EMAIL_USER:", process.env.EMAIL_USER);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error Connecting to MongoDB", err);
  });

app.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});

const User = require("./models/user");
const Post = require("./models/post");
const Top = require("./models/top"); // Import Top model
const Bottom = require("./models/bottom");
const Footwear = require("./models/footwear");
const Accessory = require("./models/accessory");

const sendVerificationEmail = async (email, verificationToken) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Email Verification",
    text: `Please click the following link to verify your email http://${host}:${port}/verify/${verificationToken}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent");
  } catch (error) {
    console.error("Error sending email", error);
  }
};

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const newUser = new User({ name, email, password });
    newUser.verificationToken = crypto.randomBytes(20).toString("hex");
    await newUser.save();
    sendVerificationEmail(newUser.email, newUser.verificationToken);

    res.status(200).json({ message: "Registration successful" });
  } catch (error) {
    console.error("Error registering user", error);
    res.status(500).json({ message: "Error registering user" });
  }
});

app.get("/verify/:token", async (req, res) => {
  try {
    const token = req.params.token;
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(404).json({ message: "Invalid token" });
    }

    user.verified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Error verifying email", error);
    res.status(500).json({ message: "Email verification failed" });
  }
});

const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString("hex");
  return secretKey;
};

const secretKey = generateSecretKey();

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Invalid email" });
    }

    if (user.password !== password) {
      return res.status(404).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.status(200).json({ token });
  } catch (error) {
    console.error("Login failed", error);
    res.status(500).json({ message: "Login failed" });
  }
});

app.get("/user/:userId", async (req, res) => {
  try {
    const loggedInUserId = req.params.userId;

    const users = await User.find({ _id: { $ne: loggedInUserId } });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error getting users", error);
    res.status(500).json({ message: "Error getting the users" });
  }
});

app.post("/follow", async (req, res) => {
  const { currentUserId, selectedUserId } = req.body;

  try {
    await User.findByIdAndUpdate(selectedUserId, {
      $push: { followers: currentUserId },
    });

    res.sendStatus(200);
  } catch (error) {
    console.error("Error following user", error);
    res.status(500).json({ message: "Error in following a user" });
  }
});

app.post("/users/unfollow", async (req, res) => {
  const { loggedInUserId, targetUserId } = req.body;

  try {
    await User.findByIdAndUpdate(targetUserId, {
      $pull: { followers: loggedInUserId },
    });

    res.status(200).json({ message: "Unfollowed successfully" });
  } catch (error) {
    console.error("Error unfollowing user", error);
    res.status(500).json({ message: "Error unfollowing user" });
  }
});

// app.post("/create-post", async (req, res) => {
//   try {
//     const { content, userId } = req.body;

//     const newPostData = {
//       user: userId,
//     };

//     if (content) {
//       newPostData.content = content;
//     }

//     const newPost = new Post(newPostData);
//     await newPost.save();

//     res.status(200).json({ message: "Post saved successfully" });
//   } catch (error) {
//     console.error("Post creation failed", error);
//     res.status(500).json({ message: "Post creation failed" });
//   }
// });

//endpoint for liking a particular post
app.put("/posts/:postId/:userId/like", async (req, res) => {
  const postId = req.params.postId;
  const userId = req.params.userId;

  try {
    const post = await Post.findById(postId).populate("user", "name");

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $addToSet: { likes: userId } },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    updatedPost.user = post.user;

    res.json(updatedPost);
  } catch (error) {
    console.error("Error liking post:", error);
    res
      .status(500)
      .json({ message: "An error occurred while liking the post" });
  }
});

//endpoint to unlike a post
app.put("/posts/:postId/:userId/unlike", async (req, res) => {
  const postId = req.params.postId;
  const userId = req.params.userId;

  try {
    const post = await Post.findById(postId).populate("user", "name");

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $pull: { likes: userId } },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    updatedPost.user = post.user;

    res.json(updatedPost);
  } catch (error) {
    console.error("Error unliking post:", error);
    res
      .status(500)
      .json({ message: "An error occurred while unliking the post" });
  }
});

// app.get("/get-posts", async (req, res) => {
//   try {
//     const posts = await Post.find()
//       .populate("user", "name")
//       .sort({ createdAt: -1 });

//     res.status(200).json(posts);
//   } catch (error) {
//     console.error("Error getting posts", error);
//     res
//       .status(500)
//       .json({ message: "An error occurred while getting the posts" });
//   }
// });

app.get("/profile/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error getting profile", error);
    res.status(500).json({ message: "Error while getting the profile" });
  }
});

//Endpoint for displaying products
app.use((req, res, next) => {
  req.topModel = Top;
  req.footwearModel = Footwear;
  req.bottomModel = Bottom;
  req.accessoryModel = Accessory;
  next();
});

// Endpoint to handle GET requests to '/tops'
app.get("/tops", async (req, res) => {
  try {
    const tops = await req.topModel.find();
    res.status(200).json(tops);
  } catch (error) {
    console.error("Error fetching tops:", error);
    res.status(500).json({ message: "An error occurred while fetching tops" });
  }
});

// Endpoint for footwear (replace with your actual logic)
app.get("/footwear", async (req, res) => {
  try {
    const footwear = await req.footwearModel.find();
    res.status(200).json(footwear);
  } catch (error) {
    console.error("Error fetching footwear:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching footwear" });
  }
});

// Endpoint for bottoms (replace with your actual logic)
app.get("/bottoms", async (req, res) => {
  try {
    const bottoms = await req.bottomModel.find();
    res.status(200).json(bottoms);
  } catch (error) {
    console.error("Error fetching bottoms:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching bottoms" });
  }
});

// Endpoint for accessories (replace with your actual logic)
app.get("/accessories", async (req, res) => {
  try {
    const accessories = await req.accessoryModel.find();
    res.status(200).json(accessories);
  } catch (error) {
    console.error("Error fetching accessories:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching accessories" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//endpoint for creating a post
app.post("/create-post", async (req, res) => {
  try {
    const { userId, products, outfitName, tags, description, content } =
      req.body;
    const post = new Post({
      user: userId,
      outfitName,
      description,
      images: products.map((product) => product.image),
      tags,
      content,
    });
    await post.save();
    res.status(201).send(post);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

//endpoint for displaying post
app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find().populate("user", "name profilePicture");
    res.status(200).send(posts);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

//endpoint for user's post in profile
app.get("/posts/user/:userId", async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId }); // Find posts where user matches userId
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Route to get collections of a user
app.get("/collections/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    res.status(200).json(user.collections);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// Route to create a new collection for a user
app.post("/createCollection", async (req, res) => {
  const { userId, collectionName } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Check if the collection name already exists
    const existingCollection = user.collections.find(
      (coll) => coll.name === collectionName
    );
    if (existingCollection) {
      return res.status(400).send("Collection name already exists");
    }

    // Create a new collection
    user.collections.push({ name: collectionName, posts: [] });
    await user.save();

    res.status(200).send("Collection created successfully");
  } catch (error) {
    console.error("Error creating collection:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/addPostToCollection", async (req, res) => {
  const { userId, collectionName, postId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    let collection = user.collections.find(
      (coll) => coll.name === collectionName
    );

    if (!collection) {
      // Create a new collection if it doesn't exist
      user.collections.push({ name: collectionName, posts: [postId] });
    } else {
      // Add post to existing collection
      collection.posts.push(postId);
    }

    await user.save();

    res.status(200).send("Post added to collection");
  } catch (error) {
    console.error("Error adding post to collection:", error);
    res.status(500).send("Internal Server Error");
  }
});
