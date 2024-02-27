

var coordid = '';
var email = '';
 const db = firebase.firestore();
 const auth = firebase.auth();
auth.onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        coordid = user.uid;
        email = user.email;
        // You can access the user's information and perform actions here.
        console.log("User is signed in:", user.uid);
        console.log("user gmail:", email);
      
    } else {
        // No user is signed in.
        document.getElementById("loginerr").style.display = "block";
        console.log("No user is signed in.");
    }
});



document.getElementById("logout-btn").addEventListener("click", function(){
    logoutUser();
});

function logoutUser() {
    auth.signOut().then(() => {
        // Sign-out successful.
        console.log("User has been logged out");

        // Replace the current page in the browser's history with "index.html"
        if (window.parent) {
            // If there is a parent frame, use its location to replace
            window.parent.location.replace("login.html");
        } else {
            // If no parent frame, use the main window's location
            window.location.replace("login.html");
        }

        // Use history.pushState to add a new entry to the history
        history.pushState(null, null, "index.html");
    }).catch((error) => {
        // An error occurred.
        console.error("Error logging out: ", error);
    });
}

const loader = document.getElementById("loading-spinner")

  document.getElementById('upload-submit').addEventListener('click', async () => {
    console.log("kkokokokok")
    loader.style.display = "block"

    saveImageStore(dataURL)



});



function saveImageStore(dataURL) {
    const storage = firebase.storage();
    const imageId = generateUniqueId(); // Generate a unique ID
    const folderName = "reportImages"; // Replace with the desired folder name
    const storageRef = storage.ref(`${folderName}/${imageId}.jpg`); // Assuming the image is in JPEG format

    // Convert data URL to Blob
    const byteCharacters = atob(dataURL.split(',')[1]);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: 'image/jpeg' });

    // Upload the image to Firebase Storage
    const uploadTask = storageRef.put(blob);

    uploadTask.on(
        "state_changed",
        (snapshot) => {
            // You can monitor the upload progress here (optional).
        },
        (error) => {
            // Handle upload errors
            console.log("Error uploading image:", error);
        },
        () => {
            // The image has been successfully uploaded
            
            console.log("Image uploaded successfully!");
             retrieveImageFromStorage(imageId+"jpg")
            // Get the download URL of the uploaded image
            storageRef.getDownloadURL().then((downloadURL) => {
                console.log("Image download URL:", downloadURL);
               retrieveImageFromStorage(imageId+".jpg")
                // You can store the download URL in your Firebase Firestore or use it as needed.
            });
        }
    );
}

// Function to generate a unique ID
function generateUniqueId() {
    // Use a timestamp combined with a random number to generate a unique ID
    const timestamp = new Date().getTime();
    const randomNumber = Math.floor(Math.random() * 1000000);
    return `${timestamp}-${randomNumber}`;
}
function retrieveImageFromStorage(filename) {
    const storage = firebase.storage();
    const storageRef = storage.ref().child("reportImages").child(filename);

    // Get the download URL of the image
    storageRef.getDownloadURL()
      .then((url) => {

        processImage(url,filename)
        
      })
      .catch((error) => {
        console.error("Error retrieving image:", error);
      });
  }

const imageInput = document.getElementById('imageInput');
const cameraPreview = document.getElementById('cameraPreview');
const inputOption = document.getElementById('inputOption');
const cameraOption = document.getElementById('cameraOption');
const actionButton = document.getElementById('actionButton');
var dataURL = '';
// Event listener for radio button change
inputOption.addEventListener('change', toggleOptions);
cameraOption.addEventListener('change', toggleOptions);

// Event listener for action button click
actionButton.addEventListener('click', performAction);


// Function to toggle input options based on selected radio button
function toggleOptions() {
  const selectedOption = document.querySelector('input[name="source"]:checked').value;
  if (selectedOption === 'input') {

            snaped.style.display = "none"
        cameraPreview.style.display = "none"
      if (cameraPreview.srcObject) {
    const tracks = cameraPreview.srcObject.getTracks();
    tracks.forEach(track => track.stop());
    cameraPreview.srcObject = null;
    cameraPreview.pause(); // Pause the video

  }
  

    actionButton.style.display = "block"
    actionButton.textContent = 'Upload Image';
    
    actionButton.addEventListener('change', function(event) {

  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const dataURL = e.target.result;
      // Upload the image data to Firebase
       upload.style.display = "block"
      uploadToFirebase(dataURL);
      upload.style.display = "none"
    };
    reader.readAsDataURL(file);
  }
});


  } 
  else if (selectedOption === 'camera') {
    upload.style.display = "none"
    uploadedFileName.style.display = "none"
    cameraPreview.style.display = "block"
    actionButton.style.display = "block"
    actionButton.textContent = 'Capture Photo';
    capturePhoto()
  }
  else{
     actionButton.style.display = "none"
  }
}

   const upload = document.getElementById("upload-submit")
   const snaped = document.getElementById("click")
 const canvas = document.createElement('canvas');

canvas.style.display = 'none'; 

 var capturedImage = document.getElementById('capturedImage');



// Function to perform action (upload image or capture photo) based on selected radio button
function performAction() {
  const selectedOption = document.querySelector('input[name="source"]:checked').value;
  if (selectedOption === 'input') {
    // Upload image if input option is selected
    snaped.style.display = "none"
    upload.style.display = "none"
    canvas.style.display = "none"
    imageInput.click(); // Trigger file input click event
   
  } else if (selectedOption === 'camera') {
        upload.style.display = "none"
        
    // Capture photo if camera option is selected
    capturePhoto();
  }
}

// Function to capture photo from camera and upload to Firebase
function capturePhoto() {
  // Use getUserMedia API to access the device's camera
  navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
      cameraPreview.srcObject = stream;
      cameraPreview.play();

      snaped.style.display = "block"

      snaped.onclick = function() {
       
        canvas.width = cameraPreview.videoWidth;
        canvas.height = cameraPreview.videoHeight;
        canvas.getContext('2d').drawImage(cameraPreview, 0, 0, canvas.width, canvas.height);
        
        // Pause the video stream
        cameraPreview.pause();
        
        // Convert canvas to data URL
         dataURL = canvas.toDataURL('image/jpeg');
           upload.style.display = "block"
            




      };
    })
    .catch((error) => {
      console.error('Error accessing camera:', error);
    });
}
// Event listener for file input change
imageInput.addEventListener('change', function(event) {

  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
       dataURL = e.target.result;
        
       upload.style.display = "block"

upload.style.display = "block"
 uploadedFileName.style.display = 'block';
    uploadedFileName.textContent = 'Uploaded file: ' + imageInput.files[0].name;
    
    upload.addEventListener("click", ()=>{
    // uploadToFirebase(dataURL)
})


    };
    reader.readAsDataURL(file);


   
  }

});




function saveReport(coordid, email, prompt, report, imageId) {
    // Get a reference to the Firestore database



  

    // Create the "reports" collection
    const reportsCollection = db.collection("reports");

  
    // Add a document to the "reports" collection with an automatically generated ID
    reportsCollection.add({
        "coorId": coordid,
        "email": email,
        "prompt": prompt,
        "report": report,
        "datetime": new Date(),
        "imageId":imageId
    })
    .then((docRef) => {
        console.log("Document added with ID: ", docRef.id);
        loader.style.display = "none"

    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });
}


async function getReportsByEmail(email) {
    try {
       
        const reportsRef = db.collection("reports");

        // Query reports with the given email
        const querySnapshot = await reportsRef.where("email", "==", email).get();

        if (!querySnapshot.empty) {
            // Convert the query snapshot to an array of reports
            const reportsArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Sort the reports by datetime in descending order
            reportsArray.sort((a, b) => new Date(b.datetime) - new Date(a.datetime));

            // Store the sorted reports in a dictionary
            const reportsDict = {};
            reportsArray.forEach(report => {
                reportsDict[report.id] = report;
            });

            // Handle the sorted reports
            console.log("Sorted reports:", reportsDict);
            return reportsDict;
        } else {
            console.log("No reports found for the given email.");
            return null;
        }
    } catch (error) {
        console.error("Error getting reports:", error);
        return null;
    }
}
document.getElementById("history").addEventListener('click',()=>{
// const userEmail = 'test1@gmail.com'; // Replace with the desired email
displaySortedReports(email);

})



async function displaySortedReports(email) {
    const reportsDict = await getReportsByEmail(email);
    const reportsContainer = document.getElementById('reportsContainer');
    reportsContainer.style.display = "block"
    // Clear previous contents of reports container
    reportsContainer.innerHTML = '';

    // Loop through sorted reports and display each one
    for (const id in reportsDict) {
        const report = reportsDict[id];
        const reportElement = document.createElement('div');

        reportElement.classList.add('report');

        // Create HTML content for the report
        const datetime = report.datetime.toDate();
        const prompt = report.prompt;
        const reportText = report.report;

        // Set inner HTML of the report element
        reportElement.innerHTML = `
            <p><strong>Datetime:</strong> ${datetime}</p>
            <p><strong>Prompt:</strong> ${prompt}</p>
            <p><strong>Report:</strong> ${reportText}</p>
        `;

        // Append report element to reports container
        reportsContainer.appendChild(reportElement);
    }
}

async function processImage(imageUrl,filename) {
   const additionalInfo = document.getElementById("description").value
//     

        var prompt = "Please carefully analyze the image. If it does not depict a medical condition, please guide the user to upload a photo of a wound that matches the user's description provided at the end of the prompt. Upon confirmation of a wound image, accurately identify the injury. If the image is not an injury, provide an appropriate response. However, if it is indeed an injury image, provide comprehensive details on the cause and treatment for each identified injury, presented in an organized manner. Additionally, suggest possible medications to alleviate the symptoms. At the end, provide the location of the nearest hospital, calculated using the provided coordinates. In the case of a potentially serious injury, offer immediate steps for handling it and strongly advise the user to seek urgent medical attention. Description"+additionalInfo;

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
 
        console.log(result.data)
        const reportElement = document.getElementById('report');
        reportElement.textContent = result.data;
    
          

        saveReport(coordid, email, additionalInfo, result.data, filename)

        

    })
    .catch(error => {
        // Handle any errors
        console.error('Error calling Cloud Function:', error);
    });

    

}







