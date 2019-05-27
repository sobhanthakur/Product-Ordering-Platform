const mongoose = require("mongoose");
const Product = require("../../models/products");

// Fetch all the product
exports.get_all_products = (req, res, next) => {
  Product.find()
    .select("_id name price productImage")
    .exec()
    .then(docs => {
      console.log(docs);
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            name: doc.name,
            price: doc.price,
            productImage: doc.productImage,
            _id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + doc._id
            }
          };
        })
      };
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

// Create a new product
exports.new_product = (req, res, next) => {
  console.log(req.file);
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
  });

  product
    .save()
    .then(result => {
      console.log(result);
      const response = {
        message: "Created product successfully",
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: "GET",
            url: "http://localhost:3000/products/" + result._id
          }
        }
      };
      res.status(201).json({ response });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

// Fetch product by its id
exports.get_product_by_id = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("_id name price")
    .exec()
    .then(doc => {
      console.log(doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({
          message: "No valid entry found for the provided ID"
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

// Remove a product.
exports.delete_product = (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json({
        message: err
      });
    });
};

// Patch a product
exports.update_product = (req, res, next) => {
  const id = req.params.productId;
  Product.updateOne(
    { _id: id },
    {
      $set: {
        name: req.body.newName,
        price: req.body.newPrice
      }
    }
  )
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Product updated",
        data: result
      });
    })
    .catch(err => {
      res.send(500).json({
        error: err
      });
    });
};
