const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions


const admin = require('firebase-admin');
admin.initializeApp();

exports.addAdminRole = functions.https.onCall((data, context)=>{
    // Check request is made by admin
    if(context.auth.token.admin !== true){
        return {
            error: "Only admins can add more admins..."
        }
    }

    //get user and add custom claim (admin);
    return admin.auth().getUserByEmail(data.email).then((user)=>{
        return admin.auth().setCustomUserClaims(user.uid, {
            admin: true
        })
    }).then(()=>{
        return {
            message: `Success ${data.email} has been made an admin.`
        }
    }).catch((err)=>{
        console.log(err)
    });

})