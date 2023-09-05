const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try {
    const products = await Product.findAll({
      include: [
        {
          model: Category,
        },
        {
          model: Tag,
          through: ProductTag,
        },
      ],
    });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error retrieving products' });
  }
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        {
          model: Category,
        },
        {
          model: Tag,
          through: ProductTag,
        },
      ],
    });

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error retrieving the product' });
  }
});

// create new product
router.post('/', async (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
    try {
      // Create a new product
      const newProduct = await Product.create(req.body);
      
      // If there are product tags, create pairings in the ProductTag model
      if (req.body.tagIds && req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: newProduct.id,
            tag_id,
          };
        });
        await ProductTag.bulkCreate(productTagIdArr);
      }
      
      res.status(201).json(newProduct);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  });

// update product
router.put('/:id', async (req, res) => {
  // update product data
  try {
    // Update product data
    const updatedProduct = await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    // Handle product tags
    if (req.body.tagIds && req.body.tagIds.length) {
      // Your logic to update product tags should be here
    }

    res.json({ message: 'Product updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try {
    // Delete one product by its `id` value
    const deletedProduct = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!deletedProduct) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting the product' });
  }
});

module.exports = router;
