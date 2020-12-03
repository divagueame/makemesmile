/// Auth.js

// Google Auth
  //Google provider instance
  var provider =  new firebase.auth.GoogleAuthProvider();

  function googleSignin(){
    firebase.auth().signInWithPopup(provider).then((result)=>{
      var token = result.credential.accessToken;
      var user = result.user;
      console.log("You have sucessfully signed through Google")
      console.log(token,user);
      
        const modalLogin = document.querySelector("#modal-login");
        M.Modal.getInstance(modalLogin).close();
        const modal = document.querySelector("#modal-signup");
        M.Modal.getInstance(modal).close();

    }).catch((err)=>{
      var errorMessage = err.message;
      console.log( errorMessage)
    })
  }

  const googleSignup = document.querySelector("#google-signup");
  googleSignup.addEventListener('click', googleSignin);

  const googleLogin = document.querySelector("#google-login");
  googleLogin.addEventListener('click', googleSignin);

  //Listen to auth status changes
  auth.onAuthStateChanged(user => {
    if(user){
      user.getIdTokenResult().then((idTokenResult)=>{
        console.log("idTokenResult.claims:", idTokenResult.claims);
        user.admin = idTokenResult.claims.admin;
        setupUI(user);
      });
    console.log("USER LOGGED IN");
    //Get data
  db.collection('drops').onSnapshot(snapshot => {
    setupGuides(snapshot.docs);
}, error => {
  console.log(error)
});

    } 
    else {
      console.log("USER LOGGED OUT");
      setupGuides([]);
      setupUI();
    }

  });


//   //Create new guide
//   const createForm = document.querySelector("#create-form");
//   createForm.addEventListener('submit', (e)=>{
//   e.preventDefault();
//   db.collection('drops').add({
//     dropsContent: createForm['dropText'].value
//   }).then(()=>{
//     //Close the modal and reset the form
//     const modal = document.querySelector("#modal-create");
//     M.Modal.getInstance(modal).close();
//     createForm.reset();
//   }, error =>{ console.log(error.message)})
// })
  //Signup
const signupForm = document.querySelector("#signup-form");
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();

  //Get user info
  const email = signupForm['signup-email'].value;
  const password = signupForm['signup-password'].value;
  
  //Sign up user with email
  auth.createUserWithEmailAndPassword(email,password).then(cred => {
    return db.collection('users').doc(cred.user.uid).set({
      'favouriteFruit': signupForm['favourite-fruit'].value
    })
  }).then(()=>{
    const modal = document.querySelector("#modal-signup");
    M.Modal.getInstance(modal).close();
    signupForm.reset();
    signupForm.querySelector(".error").innerHTML = '';
  }).catch((err)=>{
    signupForm.querySelector(".error").innerHTML = err.message;
  });  
});


//Log out
const logout = document.querySelector("#logout");
logout.addEventListener("click", (e)=> {
  e.preventDefault();
  auth.signOut()
})


// LOG IN
const loginForm = document.querySelector("#login-form");
loginForm .addEventListener('submit',(e)=>{
  e.preventDefault();

  //Get user info
  const email = loginForm["login-email"].value;
  const password = loginForm["login-password"].value;

  auth.signInWithEmailAndPassword(email, password).then(cred => {
    console.log("USER HAS LOGGED IN!")
    // console.log(cred.user);

    //Close the modal and clear the form
    const modal = document.querySelector("#modal-login"); 
    M.Modal.getInstance(modal).close();
    loginForm.reset();
    loginForm.querySelector('.error').innerHTML = '';
  }).catch(err=>{
    loginForm.querySelector('.error').innerHTML = err.message;
  })
})

//Index.js
const guidesList = document.querySelector(".guides");
const loggedOutLinks = document.querySelectorAll(".logged-out");
const loggedInLinks = document.querySelectorAll(".logged-in");
const accountDetails = document.querySelector(".account-details");


const setupUI = function(user){
  if(user){
    //Account info
    db.collection('users').doc(user.uid).get().then((doc)=>{
       const html = `
    <div class="black-text"> Logged in as ${user.email}</div>
    `; //  <div class="black-text">Your favourite fruit is ${doc.data().favouriteFruit}</div>
    accountDetails.innerHTML = html;
    })

   
    loggedInLinks.forEach(item => {
      item.style.display = 'block';
    });

    loggedOutLinks.forEach(item => {
      item.style.display = 'none';
    });
  }
  else{
    
    // Empty account details
    accountDetails.innerHTML = '';

    loggedInLinks.forEach(item => {
      item.style.display = 'none';
    });

    loggedOutLinks.forEach(item => {
      item.style.display = 'block';
    });
  }
};

function setupGuides (data){
  if(data.length){
  let html = '';
  data.forEach(drop => {
    const guide = drop.data();
    const li = `
      <li>
        <div class="collapsible-header grey">${guide.dropsContent}</div>
        <div class="collapsible-body white"></div>
      </li>
    `;
    html += li;
  });
  guidesList.innerHTML = html;
  } else {
    guidesList.innerHTML = '<h5 class="center-align">Log in to view drops</h5>'
  }
};




// Add new drop
const addDropForm = document.querySelector("#addDropForm");
addDropForm.addEventListener('submit',(e)=>{
  e.preventDefault();
  db.collection('drops').add({
    dropText: addDropForm['dropText'].value,
    dropCreator: 'user ID',
    dropRating: 0,
    votedBy: []
  }).then(()=>{
    // Close the modal and reset the form
    addDropForm.reset();
    const modal = document.querySelector("#modal-addDrop");
    M.Modal.getInstance(modal).close();

    
  }, error => {
    console.log("ALGO FALLA: ",error.message)
  })
});


// setup materialize components
document.addEventListener('DOMContentLoaded', function() {
  var modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);  
});


