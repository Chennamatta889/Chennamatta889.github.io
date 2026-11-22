/* Firebase Web App configuration is public by design. All authorization belongs in
   deployed Firestore rules. Never place service account or AI provider secrets here.
   Deliberately keep this public preview in SYNTHETIC DEMO mode until production
   Firestore permissions and staff auth are deployed and independently tested. */
export const CONFIG = Object.freeze({
  demoMode: true,
  instituteSlug:'demo-tech-academy',
  supabaseUrl:'',supabasePublishableKey:'',
  firebase:{
    apiKey:'AIzaSyA4ydTi6rf_7LIJzX6KWOmNRNnx9f-HtUg',
    authDomain:'enquiryflow-v3-pilot.firebaseapp.com',
    projectId:'enquiryflow-v3-pilot',
    appId:'1:4505765908:web:f6462220211df74f56bf01',
    messagingSenderId:'4505765908',
    storageBucket:'enquiryflow-v3-pilot.firebasestorage.app'
  }
});