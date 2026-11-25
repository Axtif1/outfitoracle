const Clothing = require('../models/Clothing');
const TryOn = require('../models/TryOn');
const cloudinary = require('../config/cloudinary');
const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// We use gemini-2.0-flash-exp as requested
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-image" });

// Helper function to fetch image and convert to base64
const fetchImageAsBase64 = async (url) => {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  const base64 = Buffer.from(response.data, 'binary').toString('base64');
  const mimeType = response.headers['content-type'];
  return { base64, mimeType };
};

const processTryOn = async (req, res) => {
  try {
    const { userImage, clothingId } = req.body;
    
    if (!userImage || !clothingId) {
      return res.status(400).json({ message: 'User image and clothing ID are required' });
    }

    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (req.user.credits <= 0) {
      return res.status(403).json({ message: 'Insufficient credits. Please contact admin.' });
    }

    // 1. Fetch Clothing document
    const clothing = await Clothing.findById(clothingId);
    if (!clothing) {
      return res.status(404).json({ message: 'Clothing item not found' });
    }

    // 2. Download both images as base64
    let userImgData, clothingImgData;
    try {
      userImgData = await fetchImageAsBase64(userImage);
      clothingImgData = await fetchImageAsBase64(clothing.imageUrl);
    } catch (err) {
      return res.status(400).json({ message: 'Failed to fetch one or both images', error: err.message });
    }

    const maxRetries = 1;
    let attempt = 0;
    let resultImageBase64 = null;

    // 3. Call Google Gemini API with retry logic
    while (attempt <= maxRetries && !resultImageBase64) {
      try {
        const prompt = "You are an advanced virtual try-on AI system. I will provide two images:\n1. A photo of a person\n2. A clothing item\n\nYour task: Digitally dress the person in the provided clothing. \nRules:\n- Keep the person's face EXACTLY the same (no changes)\n- Keep the body pose and position EXACTLY the same\n- Keep the original background EXACTLY the same\n- Keep skin tone and lighting consistent\n- The clothing should fit naturally on the body\n- Make the result look photorealistic, not like a collage\n- Only the clothing region should change\nReturn ONLY the final edited image with no explanation, no text, no borders.";

        const result = await model.generateContent([
          prompt,
          {
            inlineData: {
              data: userImgData.base64,
              mimeType: userImgData.mimeType
            }
          },
          {
            inlineData: {
              data: clothingImgData.base64,
              mimeType: clothingImgData.mimeType
            }
          }
        ]);

        // 4. Extract image data from Gemini response
        const candidate = result.response.candidates[0];
        if (candidate && candidate.content && candidate.content.parts) {
          const imagePart = candidate.content.parts.find(p => p.inlineData && p.inlineData.mimeType.startsWith('image/'));
          if (imagePart) {
            resultImageBase64 = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
          }
        }
        
        if (!resultImageBase64) {
           throw new Error('Image data not found in Gemini response parts');
        }

      } catch (err) {
        attempt++;
        if (attempt > maxRetries) {
          return res.status(500).json({ message: 'Gemini API failed to process images', error: err.message });
        }
        // Wait 2 seconds before retry
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    // 5. Upload result image to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(resultImageBase64, {
      folder: 'tryon_results'
    });

    // 6. Save TryOn record to MongoDB
    const tryOnRecord = await TryOn.create({
      userId: req.user._id,
      userImage: userImage,
      clothingId: clothingId,
      resultImage: cloudinaryResponse.secure_url
    });

    // 7. Deduct credit
    req.user.credits -= 1;
    await req.user.save();

    // 8. Return Result
    res.status(201).json({
      resultImage: cloudinaryResponse.secure_url,
      tryOnId: tryOnRecord._id,
      remainingCredits: req.user.credits
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  processTryOn
};
