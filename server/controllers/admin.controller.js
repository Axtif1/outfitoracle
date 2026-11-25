const User = require('../models/User');
const TryOn = require('../models/TryOn');
const Clothing = require('../models/Clothing');

const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalClothes = await Clothing.countDocuments();
    const totalTryOns = await TryOn.countDocuments();
    
    // Sum total credits given across all users
    const creditAggregate = await User.aggregate([
      { $group: { _id: null, totalCreditsGiven: { $sum: "$credits" } } }
    ]);
    const totalCreditsGiven = creditAggregate.length > 0 ? creditAggregate[0].totalCreditsGiven : 0;

    res.json({
      totalUsers,
      totalClothes,
      totalTryOns,
      totalCreditsGiven
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTryOns = async (req, res) => {
  try {
    // Populate user and clothing information
    const tryons = await TryOn.find({})
      .populate('userId', 'name email')
      .populate('clothingId', 'name category')
      .sort({ createdAt: -1 });
    res.json(tryons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addCredits = async (req, res) => {
  try {
    const { userId, credits } = req.body;

    if (!userId || credits === undefined || credits <= 0) {
      return res.status(400).json({ message: 'Valid userId and credits amount are required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.credits += Number(credits);
    await user.save();

    res.json({ message: `Added ${credits} credits to ${user.name}`, credits: user.credits });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStats,
  getUsers,
  getTryOns,
  addCredits
};
