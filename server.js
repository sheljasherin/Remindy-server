require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const personRoutes = require("./routes/PersonRoute");
const auth = require('./routes/auth');

const app = express();
app.use(express.json());
app.use(cors());


mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Atlas Connected"))
.catch((err) => console.error("MongoDB Connection Error:", err));

app.use("/api/PersonRoute", personRoutes);
app.use("/api/auth", auth);


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
