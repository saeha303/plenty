require("dotenv").config();
var express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
var app = express();

app.use(cors(
{
  origin:["https://plenty-ten.vercel.app"],
  methods:["GET","POST","PUT","DELETE","OPTIONS"]
}

));
app.use(cookieParser());

app.listen(process.env.PORT, () => {
  console.log(`Server listening on ${process.env.PORT}`);
})


const mongoose = require('mongoose');
// const uri = "mongodb+srv://aronnok:aronnok@cluster0.yufjo2r.mongodb.net/aronnok?retryWrites=true&w=majority";
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}
);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})
// ===========================================================
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const authRoute = require('./routes/auth');
app.use('/api', authRoute);
const userRoutes = require("./routes/user");
app.use("/api", userRoutes);
const productRoutes = require("./routes/product");
app.use("/api", productRoutes);
const categoryRoutes = require("./routes/category");
app.use("/api", categoryRoutes);
const paymentRoutes = require("./routes/payment");
app.use("/api", paymentRoutes);
const favouritesRoutes = require("./routes/favourites");
app.use("/api", favouritesRoutes);
const wishlistRoutes = require("./routes/wishlist");
app.use("/api", wishlistRoutes);
const cartRoutes = require("./routes/cart");
app.use("/api", cartRoutes);
const orderRoutes = require("./routes/order");
app.use("/api", orderRoutes);
const auctionRoutes = require("./routes/auction");
app.use("/api", auctionRoutes);
const notificationRoutes = require("./routes/notification");
app.use("/api", notificationRoutes);
const sellRoutes = require("./routes/sell");
app.use("/api", sellRoutes);

