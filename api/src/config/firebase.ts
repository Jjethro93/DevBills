import admin from "firebase-admin";
import {env} from "./env";



const initializeFirebaseAdmin = (): void =>{

    if(admin.apps.length>0) return;

    const { FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY, FIREBASE_PROJECT_ID } = env;

    if(!FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY || !FIREBASE_PROJECT_ID) {
        throw new Error("Failed to initialize firebase admin, credentials not found")
    };

    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: FIREBASE_PROJECT_ID,
                 clientEmail: FIREBASE_CLIENT_EMAIL,
                 privateKey: FIREBASE_PRIVATE_KEY,
            }),
        });
    } catch (error) {
        console.error("Error initializing firebase admin:", error);
        process.exit(1);
    };


};


export default initializeFirebaseAdmin