const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/CreateUser');
const cors = require('cors');
const multer = require("multer");
const path = require("path");
const auth = require("./middleware/auth");

const jwt = require("jsonwebtoken");


require('dotenv').config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder
app.use("/Images", express.static("public/Images"));

// Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/Images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

// MongoDB Connect
mongoose.connect(
  "mongodb+srv://abhijeettalmale76:test@auth.stfeqkd.mongodb.net/AuthUser"
)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));
app.get("/",(req,res)=>{
  res.send("hi");
})
// Register
const bcrypt = require("bcryptjs");

app.post("/register", upload.single("pic"), async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = await User.create({
      fullName: req.body.fullName,
      email: req.body.email,
      password: hashedPassword,
      pnumber: req.body.pnumber,
      cname: req.body.cname,
      pic: req.file ? `/Images/${req.file.filename}` : null
    });

    res.json(user);
  } catch (err) {
    res.status(400).json(err);
  }
});

// LOgin







app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid password" });

    if (err.response) {
  alert(err.response.data.message);
} else {
  alert("Server not reachable");
}

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});


app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json("Server Error");
  }
});

// Delete user
app.delete("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.log("DELETE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single user by ID
app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.log("GET USER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update User
// Update User (with image upload support)
app.put("/users/:id", upload.single("pic"), async (req, res) => {
  try {
    const userId = req.params.id;

    const updateData = {
      fullName: req.body.fullName,
      email: req.body.email,
      password: req.body.password,
      pnumber: req.body.pnumber,
      cname: req.body.cname,
      accountType: req.body.accountType
    };

    // If new image uploaded
    if (req.file) {
      updateData.pic = `/Images/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully", user: updatedUser });

  } catch (err) {
    console.log("UPDATE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


app.listen(3001, () => console.log("Server running on port 3001"));
