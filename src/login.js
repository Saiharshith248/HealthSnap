
var coordid = ''

const newUserDetails = {
    email : String,
    location: String,
    userId: String
}





function login() {
    console.log("Hell")
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // User successfully logged in, and userCredential contains user information.
        const user = userCredential.user;
        
        console.log("User successfully logged in:", user.email);
  
        // Display a success message to the user
        console.log("Login successful. Welcome, " + user.email);

        window.location.href = "diagnostic.html"


      })
      .catch((error) => {
        // Handle errors in login
        console.log(error.message);
        document.getElementById("passwordError").textContent = "Invalid Credentials"
        // You can display an error message to the user here if needed.
      });
  }
  document.getElementById('loginButton').addEventListener('click', function() {
    login()
  })

  document.getElementById('forgotPasswordLink').addEventListener('click', function () {

    if(document.getElementById('forgotPasswordSection').style.display == 'block'){
      document.getElementById('forgotPasswordSection').style.display = 'none';
    }
    else{
      document.getElementById('forgotPasswordSection').style.display = 'block';      
    }
});



 document.getElementById('newuser').addEventListener('click', function () {

    if(document.getElementById('newusersection').style.display == 'block'){
      document.getElementById('newusersection').style.display = 'none';
    }
    else{
      document.getElementById('newusersection').style.display = 'block';      
    }
});



document.getElementById('sendResetLinkButton').addEventListener('click', function() {
  forgotPass()
})

document.getElementById('newuserbutton').addEventListener('click', function() {
    console.log("hello")
    // if (validateForm()){
    //     console.log("hello")
    const email = document.getElementById('newemail').value
    const password = document.getElementById('newpassword').value
    console.log(email)
    console.log(password)
   signUpNewUser(email,password)
   

    
// }
});


function forgotPass(){
    var email = document.getElementById('forgotPasswordEmail').value;

            // Send a password reset email
            firebase.auth().sendPasswordResetEmail(email)
                .then(function () {
                    // Password reset email sent successfully
                    alert('Password reset email has been sent to your email address.');
                })
                .catch(function (error) {
                    // Handle errors
                    alert('Error sending password reset email: ' + error.message);
                });
}


function signUpNewUser(email, password) {
    console.log("helloooooo");
  
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // User was successfully created, and userCredential contains user information.
        console.log("User successfully created:", userCredential.user);
        // Redirect to another page using JavaScript

        saveUserDetails(email, "73.09,66.90")
        .then((userID) => {
          console.log("User details saved successfully. UserID:", userID);
            window.location.href = "login.html";
        })
        .catch((error) => {
          console.error("Error saving user details:", error);
        });

        // window.location.href = "login.html";
        console.log("in here")
      })
      .catch((error) => {
        // Handle errors in user creation
        console.log(error.message);
        // You can display an error message to the user here if needed.
      });
  }

function validateForm() {
    const password = document.getElementById("newpassword").value;
    const confirmPassword = document.getElementById("newpasswordconfirm").value;
    const passwordError = document.getElementById("passwordError");
    const passwordMatchError = document.getElementById("passwordMatchError");

    // Password validation - You can customize this regex pattern
    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;

    if (!passwordPattern.test(password)) {
        passwordError.textContent = "Password is invalid.";
        return false; // Prevent form submission
    } else {
        passwordError.textContent = ""; // Clear error message
    }

    if (password !== confirmPassword) {
        passwordMatchError.textContent = "Passwords do not match!";
        return false; // Prevent form submission
    } else {
        passwordMatchError.textContent = ""; // Clear error message
    }

    
    return true;

    
}



function saveUserDetails(email, locationString) {
    // Initialize Firestore
    const firestore = firebase.firestore();
  
    // Reference to the 'users' collection
    const usersRef = firestore.collection("users");

    // Split the location string into latitude and longitude
    const [latitude, longitude] = locationString.split(',');

    // Generate a unique ID for the document
    const userId = firestore.collection("users").doc().id;

    // Add a new document with the generated unique ID
    return usersRef.doc(userId).set({
        email: email,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        userId: userId  // Include the generated userId in the document
    }).then(() => {
        console.log("New user document created with userId: ", userId);
        return userId; // Return the generated userId
    }).catch((error) => {
        console.error("Error adding user document: ", error);
        return Promise.reject(error); // Return a rejected promise if an error occurs
    });
}
