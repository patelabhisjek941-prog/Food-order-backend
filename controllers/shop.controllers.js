// import uploadOnCloudinary from "../config/cloudinary.js"
// import Shop from "../models/shop.model.js"

// export const getAllShops=async (req,res) => {
//     try {
//         const shops=await Shop.find({}).populate("owner")
//         if(shops.length>0){
//             return res.status(200).json(shops)
//         }
//         return
//     } catch (error) {
//         return res.status(500).json({message:`get all shops error ${error}`})
//     }
// }

// export const addShop=async (req,res)=>{
//     try {
//         const {name,city,state,address}=req.body
//         let image;
//         if(req.file){
// image=await uploadOnCloudinary(req.file.path)
//         }
//         let shop=await Shop.findOne({owner:req.userId})
//         if(!shop){
//          shop=await Shop.create({
//             name,city,image,state,address,owner:req.userId
//         })
      
//         }else{
//          shop.name=name
//          shop.image=image
//          shop.city=city
//          shop.address=address
//          await shop.save()
//         }  
//         await shop.populate("owner")
//        return res.status(200).json(shop) 
//     } catch (error) {
//         return res.status(500).json({message:`add shop error ${error}`})
//     }
// }

 




// export const getCurrentShop=async (req,res) => {
//     try {
//         const shop=await Shop.findOne({owner:req.userId}).populate("owner").populate({
//         path: "items",
//         options: { sort: { createdAt: -1 } }
//       });
//         if(shop){
// return res.status(200).json(shop)
//         }
//         return null
//     } catch (error) {
//          return res.status(500).json({message:`get shop error ${error}`})
//     }
// }

// export const getShopsByCity=async (req,res)=>{
//     try {
//         const { city } = req.params;

//     if (!city) {
//       return res.status(400).json({ message: "City parameter is required" });
//     }

//     // Case-insensitive search
//     const shops = await Shop.find({
//       city: { $regex: new RegExp(`^${city}$`, "i") }
//     });
   
//     return res.status(200).json(shops);
//     } catch (error) {
//          return res.status(500).json({message:`get shop by city error ${error}`})
//     }
// }

// export const getShopById=async (req,res)=>{
// try {
//     const {shopId}=req.params
//     const shop=await Shop.findById(shopId)
//     if(!shop){
//          return res.status(400).json({ message: "shop not found" });
//     }
//     return res.status(200).json(shop);

// } catch (error) {
//     return res.status(500).json({message:`get shop by id error ${error}`})
// }
// }




import uploadOnCloudinary from "../config/cloudinary.js";
import Shop from "../models/shop.model.js";

// Get all shops (for admin or browsing)
export const getAllShops = async (req, res) => {
  try {
    console.log("🛍️ Fetching all shops");
    
    const shops = await Shop.find({})
      .populate("owner", "fullName email mobile")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Shops fetched successfully",
      count: shops.length,
      shops
    });
  } catch (error) {
    console.error("❌ Get all shops error:", error);
    return res.status(500).json({ 
      message: "Failed to fetch shops",
      error: error.message 
    });
  }
};

// Add or Edit shop for current user
export const addOrEditShop = async (req, res) => {
  try {
    console.log("🛍️ Add/Edit shop request received");
    console.log("👤 User ID:", req.userId);
    console.log("📦 Request body:", req.body);
    console.log("📁 File:", req.file);

    const { name, city, state, address } = req.body;

    // Validation
    if (!name || !city || !address) {
      return res.status(400).json({ 
        message: "Name, city, and address are required" 
      });
    }

    let image;
    if (req.file) {
      try {
        image = await uploadOnCloudinary(req.file.path);
        console.log("✅ Image uploaded to Cloudinary:", image);
      } catch (uploadError) {
        console.error("❌ Cloudinary upload error:", uploadError);
        return res.status(500).json({ 
          message: "Failed to upload image" 
        });
      }
    }

    // Check if shop already exists for this user
    let shop = await Shop.findOne({ owner: req.userId });

    if (!shop) {
      // Create new shop
      shop = await Shop.create({
        name,
        city,
        state,
        address,
        image: image || "",
        owner: req.userId,
      });
      console.log("✅ New shop created");
    } else {
      // Update existing shop
      shop.name = name;
      shop.city = city;
      shop.state = state || shop.state;
      shop.address = address;
      if (image) shop.image = image;
      await shop.save();
      console.log("✅ Existing shop updated");
    }

    // Populate owner details
    await shop.populate("owner", "fullName email mobile");

    return res.status(200).json({
      message: shop.isNew ? "Shop created successfully" : "Shop updated successfully",
      shop
    });

  } catch (error) {
    console.error("❌ Add/Edit shop error:", error);
    return res.status(500).json({ 
      message: "Failed to process shop request",
      error: error.message 
    });
  }
};

// Get current user's shop
export const getCurrentShop = async (req, res) => {
  try {
    console.log("🛍️ Fetching current user's shop");
    
    const shop = await Shop.findOne({ owner: req.userId })
      .populate("owner", "fullName email mobile")
      .populate({
        path: "items",
        options: { sort: { createdAt: -1 } }
      });

    if (!shop) {
      return res.status(404).json({ 
        message: "No shop found for this user" 
      });
    }

    return res.status(200).json({
      message: "Shop fetched successfully",
      shop
    });
  } catch (error) {
    console.error("❌ Get current shop error:", error);
    return res.status(500).json({ 
      message: "Failed to fetch shop",
      error: error.message 
    });
  }
};

// Get shops by city
export const getShopsByCity = async (req, res) => {
  try {
    const { city } = req.params;
    console.log("🏙️ Fetching shops by city:", city);

    if (!city) {
      return res.status(400).json({ 
        message: "City parameter is required" 
      });
    }

    // Case-insensitive search with regex
    const shops = await Shop.find({
      city: { $regex: new RegExp(city, "i") }
    }).populate("owner", "fullName email mobile");

    return res.status(200).json({
      message: "Shops fetched successfully",
      count: shops.length,
      city: city,
      shops
    });
  } catch (error) {
    console.error("❌ Get shops by city error:", error);
    return res.status(500).json({ 
      message: "Failed to fetch shops by city",
      error: error.message 
    });
  }
};

// Get shop by ID
export const getShopById = async (req, res) => {
  try {
    const { shopId } = req.params;
    console.log("🛍️ Fetching shop by ID:", shopId);

    if (!shopId) {
      return res.status(400).json({ 
        message: "Shop ID is required" 
      });
    }

    const shop = await Shop.findById(shopId)
      .populate("owner", "fullName email mobile")
      .populate({
        path: "items",
        options: { sort: { createdAt: -1 } }
      });

    if (!shop) {
      return res.status(404).json({ 
        message: "Shop not found" 
      });
    }

    return res.status(200).json({
      message: "Shop fetched successfully",
      shop
    });
  } catch (error) {
    console.error("❌ Get shop by ID error:", error);
    return res.status(500).json({ 
      message: "Failed to fetch shop",
      error: error.message 
    });
  }
};

// Delete shop (admin or owner only)
export const deleteShop = async (req, res) => {
  try {
    const { shopId } = req.params;
    console.log("🗑️ Deleting shop:", shopId);

    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ 
        message: "Shop not found" 
      });
    }

    // Check if user is owner or admin
    if (shop.owner.toString() !== req.userId && req.user.role !== "admin") {
      return res.status(403).json({ 
        message: "Access denied. You can only delete your own shops." 
      });
    }

    await Shop.findByIdAndDelete(shopId);

    return res.status(200).json({
      message: "Shop deleted successfully"
    });
  } catch (error) {
    console.error("❌ Delete shop error:", error);
    return res.status(500).json({ 
      message: "Failed to delete shop",
      error: error.message 
    });
  }
};
