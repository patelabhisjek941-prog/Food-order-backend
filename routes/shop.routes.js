// import express from "express"
// import { addShop,editShop, getAllShops, getCurrentShop, getShopById, getShopsByCity } from "../controllers/shop.controllers.js"
// import isAuth from "../middlewares/isAuth.js"
// import { upload } from "../middlewares/multer.js"



// const shopRouter=express.Router()

// shopRouter.get("/getall",isAuth,getAllShops)
// shopRouter.get("/getcurrent",isAuth,getCurrentShop)
// shopRouter.post("/editshop",isAuth,upload.single("image"),editShop)
// shopRouter.post("/addshop",isAuth,upload.single("image"),addShop)
// shopRouter.get("/getshopsbycity/:city",isAuth,getShopsByCity)
// shopRouter.get("/getshopbyid/:shopId",isAuth,getShopById)
// export default shopRouter

import express from "express";
import { 
  getAllShops, 
  addOrEditShop, 
  getCurrentShop, 
  getShopsByCity, 
  getShopById,
  deleteShop 
} from "../controllers/shop.controllers.js";
import isAuth from "../middlewares/isAuth.js";
import { requireRole } from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";

const shopRouter = express.Router();

// Apply authentication to all shop routes
shopRouter.use(isAuth);

// Public shop routes (authenticated but no role restriction)
shopRouter.get("/getall", getAllShops);
shopRouter.get("/getcurrent", getCurrentShop);
shopRouter.get("/getshopsbycity/:city", getShopsByCity);
shopRouter.get("/getshopbyid/:shopId", getShopById);

// Shop management routes (vendor/admin only)
shopRouter.post("/addshop", 
  requireRole(["vendor", "admin"]), 
  upload.single("image"), 
  addOrEditShop
);

shopRouter.post("/editshop", 
  requireRole(["vendor", "admin"]), 
  upload.single("image"), 
  addOrEditShop
);

shopRouter.delete("/:shopId", 
  requireRole(["vendor", "admin"]), 
  deleteShop
);

export default shopRouter;


