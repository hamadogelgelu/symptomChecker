console.log('Diagnosis Loaded!')

async function getDiagnosis(userData) {
  try {
    const response = await fetch('http://localhost:3000/api/diagnose', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) throw new Error('Failed to fetch diagnosis');
    const result = await response.json();
    return result; // This should be an object: { diseases: [ ... ] }

  } catch (error) {
    console.error('Diagnosis error:', error);
    return { error: error.message };
  }
}

window.getDiagnosis = getDiagnosis;