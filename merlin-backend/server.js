const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const serveStatic = require("serve-static");

// mongo setting
const dbUrl = "mongodb://localhost:27017/merlin";

// server configuration
mongoose
  .connect(dbUrl)
  .then(() => {
    app.listen(8080, () => {
      console.log("Listening on port 8080...");
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.use(cors());

// configuration for image serving
app.use("/images", serveStatic(__dirname + "/images"));

// route imports
const productRoutes = require("./routes/productRoutes/index");
const userRoutes = require("./routes/userRoutes/index");
const adminRoutes = require("./routes/adminRoutes/index");
const pictureRoutes = require("./routes/pictureRoutes/index");
const blogRoutes = require("./routes/blogRoutes/index");
const paymentRoutes = require("./routes/paymentRoutes/index");

// route use
app.use("/product", productRoutes);
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);
app.use("/picture", pictureRoutes);
app.use("/blogs", blogRoutes);
app.use("/payment", paymentRoutes);
