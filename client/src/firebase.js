import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: "venue-web-builder.firebaseapp.com",
    projectId: "venue-web-builder",
    storageBucket: "venue-web-builder.appspot.com",
    messagingSenderId: "431377118230",
    appId: "1:431377118230:web:ceddaee513f031e96df137",
    measurementId: "G-PRPCF3QVWP"
};
let app = null;
let auth = null;
try {
    app = initializeApp(firebaseConfig);
    auth = getAuth();
    auth.useDeviceLanguage()
    const analytics = getAnalytics(app);
} catch (error) {
    console.log("failed initializing firebase : "+error)
}

export { app, auth };