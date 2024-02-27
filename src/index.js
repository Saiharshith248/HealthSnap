const express = require('express');
const app = express();
const cors = require('cors'); // Add this line
const helmet = require('helmet'); 
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const functions = require('firebase-functions');


const corsOptions = {


    origin: '*', // Allow requests from any origin
    methods: 'GET, POST', // Specify allowed HTTP methods
    credentials: true, // Allow cookies and authentication headers
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(bodyParser.json());



// Serve static files from the current directory
app.use(express.static(__dirname));

// Define route to serve sample.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});


// app.post('/process-image', async (req, res) => {

//     try {
//         console.log("Request body:", req.body);
//         const { imageUrl, prompt } = req.body;

//         // Download the image
//         const image = await downloadImage(imageUrl);
//         if (!image) {
//             throw new Error('Failed to download image');
//         }

//         const genAI = new GoogleGenerativeAI('AIzaSyBwfwR21h0FtoJOkEASbpsb_-1izjMVJ2w');
//         const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

//         const result = await model.generateContent([prompt, { inlineData: image }]);
//         const reported = await result.response.text()
//         console.log(reported)
//         res.contentType('application/json');
//         res.send({report: reported});
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });
// Define the Cloud Function
// exports.processImage = functions.https.onCall(async (req, res) => {

//         // try {
//             console.log("Request body:", req.body);
//         //     const { imageUrl, prompt } = req.body;

//         //     // Download the image
//         //     const image = await downloadImage(imageUrl);
//         //     if (!image) {
//         //         throw new Error('Failed to download image');
//         //     }

            // // Initialize Google Generative AI
            // const genAI = new GoogleGenerativeAI('AIzaSyBwfwR21h0FtoJOkEASbpsb_-1izjMVJ2w');
            // const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

            // // Generate content using the model
            // const result = await model.generateContent([prompt, { inlineData: image }]);
//         //     const reported = await result.response.text();
//         //     console.log(reported);

//         //     // Send the response
//         //     res.status(200).json({ report: reported });
//         // } catch (error) {
//         //     console.error('Error:', error);
//         //     res.status(500).json({ error: 'Internal server error' });
//         // }
//         res.send("hello world from processImage")
// });

exports.processImagecall = functions.https.onCall(async (data, context) => {
    try {
        // Access the text property from the data object
        const imageUrl = data.data.imageUrl;
        const prompt = data.data.prompt;
         const image = await downloadImage(imageUrl);
        if (!image) {
            throw new Error('Failed to download image');
        }
        // Initialize Google Generative AI
            const genAI = new GoogleGenerativeAI('AIzaSyBwfwR21h0FtoJOkEASbpsb_-1izjMVJ2w');
            const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

            // Generate content using the model
            const result = await model.generateContent([prompt, { inlineData: image }]);
            const reported = await result.response.text();

        return reported
    } catch (error) {
        console.error('Error processing image:', error);
        // You can handle errors here
        throw new functions.https.HttpsError('internal', 'An error occurred while processing the image.');
    }
});

async function downloadImage(imageUrl) {
    try {
        // Fetch the image as a binary buffer
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer', timeout: 5000 });

        // Convert the buffer to a Base64 string
        const base64Image = Buffer.from(response.data, 'binary').toString('base64');
        const mimeType = response.headers['content-type'];
        return { data: base64Image, mimeType };
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            console.error('Server responded with non-success status code:', error.response.status);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received from the server');
        } else {
            // Something else happened while setting up the request
            console.error('Error setting up the request:', error.message);
        }
        return null;
    }
}


// const PORT = process.env.PORT || 8361
// ;
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });
// // Expose the Express app as a Cloud Function
// exports.api = functions.https.onRequest(app);

