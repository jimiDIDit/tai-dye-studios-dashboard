// Import and configure the Firebase SDK
// These scripts are made available when the app is served or deployed on Firebase Hosting
// If you do not serve/host your project using Firebase Hosting see https://firebase.google.com/docs/web/setup
// importScripts('/__/firebase/8.7.0/firebase-app.js');
// importScripts('/__/firebase/8.7.0/firebase-messaging.js');
// importScripts('/__/firebase/init.js');

// const messaging = firebase.messaging();

importScripts('https://www.gstatic.com/firebasejs/8.7.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.7.0/firebase-messaging.js');
firebase.initializeApp({
  apiKey: "AIzaSyDKFOGrdYVOQTT3DKAWftQZ0Gm5gxGHsDE",
   authDomain: "tai-dye-studios.firebaseapp.com",
   projectId: "tai-dye-studios",
   storageBucket: "tai-dye-studios.appspot.com",
   messagingSenderId: "381639159194",
   appId: "1:381639159194:web:b7217cf9f620c480135e23",
   measurementId: "G-V9367K1SYE"
});

const messaging = firebase.messaging();


// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
// Keep in mind that FCM will still show notification messages automatically
// and you should use data messages for custom notifications.
// For more info see:
// https://firebase.google.com/docs/cloud-messaging/concept-options
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});
