import express from 'express';
import ProductModel from '../models/product.model.js';

const productRouter = express.Router();

// Get all products
productRouter.get('/', async (req, res) => {
  try {
    const {page = 1, limit = 10, sort = 'asc', query = ''} = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const searchCondition = query ? {name: {$regex: query, $options: 'i'}} : {};

    const result = await ProductModel.paginate(searchCondition, {
      limit: limitNumber,
      page: pageNumber,
      lean: true,
    });

    result.prevLink = result.hasPrevPage
      ? `http://localhost:8080/product?page=${result.prevPage}&limit=${limitNumber}`
      : null;
    result.nextLink = result.hasNextPage
      ? `http://localhost:8080/product?page=${result.nextPage}&limit=${limitNumber}`
      : null;
    result.isValid = !(pageNumber <= 0 || pageNumber > result.totalPages);

    res.render('products', result);
  } catch (error) {
    res.status(400).send({
      message: 'Error while getting the products',
      error: error.message,
    });
  }
});

// Get a product by id
productRouter.get('/:id', async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id).lean();
    if (!product) {
      return res.render('error', {message: 'Product not found'});
    }
    res.render('productById', {product});
  } catch (error) {
    res.status(400).send({
      message: 'Error while getting the product',
      error: error.message,
    });
  }
});

// Create a new product
productRouter.post('/', async (req, res) => {
  try {
    const product = new ProductModel(req.body);
    await product.save();
    res.status(201).json({message: 'Product created successfully', product});
  } catch (error) {
    res.status(400).json({
      message: 'Error while creating the product',
      error: error.message,
    });
  }
});

productRouter.delete('/:id', async (req, res) => {
  try {
    const product = await ProductModel.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({message: 'Product not found'});
    }
    res.json({message: 'Product deleted successfully', success: true});
  } catch (error) {
    res.status(400).json({
      message: 'Error while deleting the product',
      error: error.message,
    });
  }
});

export default productRouter;
