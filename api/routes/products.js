const express = require("express");
const router = express.Router();

const multer = require("multer");
const checkAuth = require("../middleware/check-auth");
const productController = require("../controllers/v1/products");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = new multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

// Get all the products
router.get("/", checkAuth, productController.get_all_products);

// Write a product into the DB
router.post(
  "/",
  checkAuth,
  upload.single("productImage"),
  productController.new_product
);

// Fetch the product by its ID
router.get("/:productId", checkAuth, productController.get_product_by_id);

// Delete a product
router.delete("/:productId", checkAuth, productController.delete_product);

router.patch("/:productId", checkAuth, productController.update_product);

module.exports = router;
