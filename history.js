import { db } from "./firebase.js"; 
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js"; 

export async function saveHistoricalData(activePreset) {
  if (!activePreset || !activePreset.city) return;
  
  const locationId = activePreset.city.toLowerCase().replace(/\s+/g, '_') + "_" + (activePreset.country ? activePreset.country.toLowerCase() : "loc");
  
  // 1. Define the historical data object
  const historyData = {
    locationId: locationId,
    date: new Date(), // Saved as a Firestore Timestamp
    avgTemp: activePreset.temp || 0,
    maxTemp: activePreset.tempHigh || 0,
    minTemp: activePreset.tempLow || 0,
    totalPrecipitation: activePreset.precip24h || 0,
    avgHumidity: activePreset.humidity || 0,
    avgAqi: activePreset.aqi || 0
  };

  // 2. Define a unique Document ID (e.g., nagpur_in_2026_06_06)
  const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '_');
  const docId = `${locationId}_${dateStr}`;

  // 3. Write/Save the document inside the 'history' collection
  try {
    await setDoc(doc(db, "history", docId), historyData);
    console.log(`Historical weather record for ${activePreset.city} saved successfully to Firestore!`);
  } catch (error) {
    console.error("Error saving historical record to Firestore: ", error);
  }
}