const mongoose = require("mongoose");

const Order = require("../../models/orders");
const Product = require("../../models/products");

// Method to fetch all the orders from the DB
exports.orders_get_all = (req, res, next) => {
  Order.find()
    .select("_id quantity product")
    .exec()
    .then(docs => {
      console.log(docs);
      const response = {
        count: docs.length,
        orders: docs.map(doc => {
          return {
            product: doc.product,
            quantity: doc.quantity,
            _id: doc._id
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

// Method to create a new order
exports.create_new_order = (req, res, next) => {
  Product.findById(req.body.productId)
    .then(product => {
      if (!product) {
        res.status(404).json({
          message: "product not found"
        });
      }
      const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
      });
      return order.save();
    })
    .then(result => {
      console.log(result);
      res.status(201).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

// Fetch an order by its id
exports.get_order_by_id = (req, res, next) => {
  Order.findById(req.params.orderId)
    .exec()
    .then(order => {
      if (!order) {
        res.status(500).json({
          message: "Order not found"
        });
      }
      res.status(200).json({
        order: order,
        request: {
          type: "GET",
          url: "http://localhost:8000/orders"
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

// Remove an order.
exports.delete_order = (req, res, next) => {
  Order.remove({ _id: req.params.orderId })
    .exec()
    .then(order => {
      res.status(200).json({
        message: "Order deleted",
        request: {
          type: "GET",
          url: "http://localhost:8000/orders"
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};
