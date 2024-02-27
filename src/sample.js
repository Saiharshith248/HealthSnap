const imageUrl = "https://firebasestorage.googleapis.com/v0/b/axxesshackathon.appspot.com/o/reportImages%2F1708583646614-369154.jpg?alt=media&token=51cdcbb7-7c4b-47a0-a968-4fcf1fc5444f";
console.log("in sample.js");

processImage("https://firebasestorage.googleapis.com/v0/b/axxesshackathon.appspot.com/o/reportImages%2F1708583646614-369154.jpg?alt=media&token=51cdcbb7-7c4b-47a0-a968-4fcf1fc5444f");

async function processImage(imageUrl) {
   
        var prompt = "Please carefully analyze the image. If it does not depict a medical condition, please guide the user to upload a photo of a wound that matches the user's description provided at the end of the prompt. Upon confirmation of a wound image, accurately identify the injury. If the image is not an injury, provide an appropriate response. However, if it is indeed an injury image, provide comprehensive details on the cause and treatment for each identified injury, presented in an organized manner. Additionally, suggest possible medications to alleviate the symptoms. At the end, provide the location of the nearest hospital, calculated using the provided coordinates. In the case of a potentially serious injury, offer immediate steps for handling it and strongly advise the user to seek urgent medical attention. Description";

const callableFunction = firebase.functions().httpsCallable('processImagecall');

const data = {
    data: {
        imageUrl: imageUrl,
        prompt: prompt
    },
    context: {

    }
};

// Call the Cloud Function
callableFunction(data)
    .then(result => {
        // Handle the result
        console.log("here")
        console.log(result); // { result: 'Your result data here' }
    })
    .catch(error => {
        // Handle any errors
        console.error('Error calling Cloud Function:', error);
    });

}
