import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors());
app.use(express.json());

cloudinary.config({ 
  cloud_name: 'dcg93yhe4', 
  api_key: '136228777668615', 
  api_secret: 'ZLhxtkYpERAAnRUT63tIOIVGNiM' 
});
const upload = multer({ storage: multer.memoryStorage() });

  app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Nenhum arquivo fornecido.' });
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'primitiva', resource_type: 'auto' },
    (error, result) => {
      if (error) {
        console.error("Cloudinary Error:", error);
        return res.status(500).json({ error: error.message || error.http_code || JSON.stringify(error) });
      }
      res.json({ secure_url: result.secure_url });
    }
  );
  uploadStream.end(req.file.buffer);
});

app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { amount, missionId, missionTitle, currencyCode } = req.body;
    const stripeCurrency = currencyCode ? currencyCode.toLowerCase() : 'brl';
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: stripeCurrency,
            product_data: {
              name: `Doação: ${missionTitle}`,
              description: `Apoio direto para a missão ${missionTitle}.`,
            },
            unit_amount: Math.round(amount * 100), // Stripe uses cents, protect against floats
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:5173/missao/${missionId}?success=true&amount=${amount}&currency=${stripeCurrency}`,
      cancel_url: `http://localhost:5173/missao/${missionId}?canceled=true`,
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Stripe Backend running on port ${PORT}`);
});
