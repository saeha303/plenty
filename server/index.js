require("dotenv").config();
var express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
var app = express();

app.use(cors(
// {
//   origin:'*',
//   methods:["GET","POST","PUT","DELETE","OPTIONS"],
//   allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
//   credentials: true
// }

));
app.use(cookieParser());
app.use(express.json())
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "https://plenty-front.vercel.app"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});
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

// app.get('/cors', (req, res) => {
//   res.set('Access-Control-Allow-Origin', '*');
//   res.send({ "msg": "This has CORS enabled 🎈" })
//   })

// "headers": [
//         {
//           "source": "/api/(.*)",
//           "headers": [
//             {
//               "key": "Access-Control-Allow-Credentials",
//               "value": "true"
//             },
//             {
//               "key": "Access-Control-Allow-Origin",
//               "value": "*"
//             },
//             {
//               "key": "Access-Control-Allow-Methods",
//               "value": "GET,OPTIONS,PATCH,DELETE,POST,PUT"
//             },
//             {
//               "key": "Access-Control-Allow-Headers",
//               "value": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
//             }
//           ]
//         }
//       ]