import app from "./app.js";
import { prismaConnect } from "./config/prisma.js";
import { initializeGlobalCategories } from "./services/globalCategories.services.js";
import { env } from "./config/env.js";
import initializeFirebaseAdmin from "./config/firebase.js";


const PORT = env.PORT;


initializeFirebaseAdmin();

const startServer = async () => {



    try {

        await prismaConnect();
        
        await initializeGlobalCategories();

        await app.listen({ port: PORT }).then(() => {
            console.log(`Server is running at port ${PORT}`)

        });
    } catch (err) {
        console.error(err)
    }
};


startServer()