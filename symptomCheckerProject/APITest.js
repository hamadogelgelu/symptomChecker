import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
const apiKey = process.env.RapidAPI_KEY;

const options = {
  method: 'POST',
  url: 'https://ai-medical-diagnosis-api-symptoms-to-results.p.rapidapi.com/analyzeSymptomsAndDiagnose',
  params: { noqueue: '1' },
  headers: {
    'x-rapidapi-key': process.env.RAPIDAPI_KEY,
    'x-rapidapi-host': 'ai-medical-diagnosis-api-symptoms-to-results.p.rapidapi.com',
    'Content-Type': 'application/json'
  },
  data: {
    symptoms: ['fever', 'fatigue', 'headache'],
    patientInfo: {
      age: 30,
      gender: 'female',
      height: 160,
      weight: 60,
      medicalHistory: [],
      currentMedications: [],
      allergies: [],
      lifestyle: {
        smoking: false,
        alcohol: 'none',
        exercise: 'moderate',
        diet: 'balanced'
      }
    },
    lang: 'en'
  }
};

async function fetchData() {
  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error("Fetch error:", error.message);
    return null;
  }
}

// IIFE (Immediately Invoked Function Expression) to use await at top level
(async () => {
  const data = await fetchData();

  if (!data || !data.result?.analysis?.possibleConditions) {
    console.error("No possible conditions found");
    return; // Prevent further execution if data is invalid
  }

  const conditions = data.result.analysis.possibleConditions;
  for (const condition of conditions) {
    console.log(condition.condition);
  }
})();