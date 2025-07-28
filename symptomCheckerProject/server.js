import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post('/api/diagnose', async (req, res) => {
  const userData = req.body;

  const prompt = `You are a medical diagnosis assistant...
Symptoms: ${userData.symptoms.join(', ')}
Age: ${userData.age}
Sex: ${userData.sex}
Height (cm): ${userData.height}
Weight (lbs): ${userData.weight}
Lifestyle: Smoking - ${userData.lifestyle.smoking}, Alcohol - ${userData.lifestyle.alcohol}, Exercise - ${userData.lifestyle.exercise}, Diet - ${userData.lifestyle.diet}
Medical History: ${userData.medicalHistory.join(', ') || 'None'}
Medications: ${userData.medications.join(', ') || 'None'}`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      temperature: 0.3,
      messages: [
        {
          role: 'system',
          content: `You are a medical diagnosis assistant. Respond ONLY with a JavaScript object formatted as JSON like:

{
  "diseases": [
    {
      "name": "Disease Name",
      "treatment": "Specific treatment recommendation"
    },
    ...
  ]
}

Do NOT explain anything or output anything else.`
        },
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const content = completion.choices[0].message.content;
    res.json(JSON.parse(content)); // Parse GPT output and return

  } catch (error) {
    console.error('OpenAI Error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));