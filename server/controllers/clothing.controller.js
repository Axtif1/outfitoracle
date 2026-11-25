const Clothing = require('../models/Clothing');
const cloudinary = require('../config/cloudinary');

const getClothes = async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};
    
    if (category && category !== 'all') {
      query.category = category;
    }

    const clothes = await Clothing.find(query).sort({ createdAt: -1 });
    res.json(clothes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadClothing = async (req, res) => {
  try {
    const { name, category } = req.body;

    if (!name || !category) {
      return res.status(400).json({ message: 'Name and category are required' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    const b64 = Buffer.from(req.file.buffer).toString('base64');
    let dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'tryon_clothes'
    });

    const clothing = await Clothing.create({
      name,
      category,
      imageUrl: result.secure_url,
      publicId: result.public_id
    });

    res.status(201).json(clothing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteClothing = async (req, res) => {
  try {
    const clothing = await Clothing.findById(req.params.id);

    if (!clothing) {
      return res.status(404).json({ message: 'Clothing not found' });
    }

    await cloudinary.uploader.destroy(clothing.publicId);
    await clothing.deleteOne();

    res.json({ message: 'Clothing removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getClothes,
  uploadClothing,
  deleteClothing
};
