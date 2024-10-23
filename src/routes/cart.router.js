import express from 'express';
import CartModel from '../models/cart.model.js';
import ProductModel from '../models/product.model.js';

const cartRouter = express.Router();

const createDefaultCart = async () => {
  try {
    const cartCount = await CartModel.countDocuments();
    if (cartCount === 0) {
      const defaultCart = new CartModel({
        items: [],
        totalPrice: 0,
      });
      await defaultCart.save();
      console.log('Default cart created');
    }
  } catch (error) {
    console.error('Error creating default cart:', error.message);
  }
};

createDefaultCart();

cartRouter.get('/', async (req, res) => {
  try {
    const carts = await CartModel.find().lean();
    res.status(200).send(carts);
  } catch (error) {
    res.status(400).send({
      message: 'Error while getting the carts',
      error: error.message,
    });
  }
});

cartRouter.get('/:cid', async (req, res) => {
  const {cid} = req.params;

  try {
    const cart = await CartModel.findById(cid).populate('items.product').lean();
    if (!cart) {
      return res.status(404).send({message: 'Cart not found'});
    }
    res.render('cartById', cart);
  } catch (error) {
    res.status(400).send({
      message: 'Error while getting the cart',
      error: error.message,
    });
  }
});

cartRouter.post('/', async (req, res) => {
  try {
    const cart = new CartModel(req.body);
    await cart.save();
    res.status(201).json({message: 'Cart created successfully', cart});
  } catch (error) {
    res.status(400).send({
      message: 'Error while creating the cart',
      error: error.message,
    });
  }
});

cartRouter.put('/:cid', async (req, res) => {
  const {cid} = req.params;
  const {productId, quantity} = req.body;

  try {
    const cart = await CartModel.findById(cid);
    if (!cart) {
      return res.status(404).send({message: 'Cart not found'});
    }

    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).send({message: 'Product not found'});
    }

    const existingItem = cart.items.find(
      item => item.product.toString() === productId,
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({product: productId, quantity});
    }

    // Calcular el precio total del carrito
    cart.totalPrice = await cart.items.reduce(async (totalPromise, item) => {
      const total = await totalPromise;
      const itemProduct = await ProductModel.findById(item.product);
      const itemTotal = item.quantity * itemProduct.price;
      return total + itemTotal;
    }, Promise.resolve(0));

    console.log(cart);

    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(400).send({
      message: 'Error while updating the cart',
      error: error.message,
    });
  }
});

cartRouter.put('/:cid/product/:pid', async (req, res) => {
  const {cid, pid} = req.params;
  const {quantity} = req.body;

  try {
    const cart = await CartModel.findById(cid);
    if (!cart) {
      return res.status(404).send({message: 'Cart not found'});
    }
    const product = await ProductModel.findById(pid);
    if (!product) {
      return res.status(404).send({message: 'Product not found'});
    }

    const existingItem = cart.items.find(
      item => item.product.toString() === pid,
    );

    if (!existingItem) {
      return res.status(404).send({message: 'Product not found in the cart'});
    }

    existingItem.quantity = quantity;

    // Recalcular el precio total del carrito
    cart.totalPrice = await cart.items.reduce(async (totalPromise, item) => {
      const total = await totalPromise;
      const itemProduct = await ProductModel.findById(item.product);
      const itemTotal = item.quantity * itemProduct.price;
      return total + itemTotal;
    }, Promise.resolve(0));

    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(400).send({
      message: 'Error while updating the product in the cart',
      error: error.message,
    });
  }
});

cartRouter.delete('/:cid/product/:pid', async (req, res) => {
  const {cid, pid} = req.params;

  try {
    const cart = await CartModel.findById(cid);
    if (!cart) {
      return res.status(404).send({message: 'Cart not found'});
    }

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === pid,
    );
    if (itemIndex === -1) {
      return res.status(404).send({message: 'Product not found in the cart'});
    }
    cart.items.splice(itemIndex, 1);

    // Recalcular el precio total del carrito
    cart.totalPrice = await cart.items.reduce(async (totalPromise, item) => {
      const total = await totalPromise;
      const itemProduct = await ProductModel.findById(item.product);
      const itemTotal = item.quantity * itemProduct.price;
      return total + itemTotal;
    }, Promise.resolve(0));

    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(400).send({
      message: 'Error while deleting the product from the cart',
      error: error.message,
    });
  }
});

export default cartRouter;
