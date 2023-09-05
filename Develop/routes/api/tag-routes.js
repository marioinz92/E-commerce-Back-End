const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  try {
    // Find all tags and include their associated Product data
    const tags = await Tag.findAll({
      include: Product, // Include associated products
    });
    res.json(tags);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error retrieving tags' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    // Find a single tag by its `id` and include its associated Product data
    const tag = await Tag.findByPk(req.params.id, {
      include: Product, // Include associated products
    });

    if (!tag) {
      res.status(404).json({ message: 'Tag not found' });
      return;
    }

    res.json(tag);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error retrieving the tag' });
  }
});

router.post('/', async (req, res) => {
  try {
    // Create a new tag
    const newTag = await Tag.create(req.body);
    res.status(201).json(newTag);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    // Update a tag's name by its `id` value
    const updatedTag = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (updatedTag[0] === 0) {
      res.status(404).json({ message: 'Tag not found' });
      return;
    }

    res.json({ message: 'Tag updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    // Delete one tag by its `id` value
    const deletedTag = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!deletedTag) {
      res.status(404).json({ message: 'Tag not found' });
      return;
    }

    res.json({ message: 'Tag deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting the tag' });
  }
});

module.exports = router;

