importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');
const bellIconUrl = `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
    </svg>
    `)}`;

firebase.initializeApp({
  apiKey: "AIzaSyDwWx3VMUkH8B5tIzwL-7-Qok-p0GGGZpQ",
  authDomain: "headstaart.firebaseapp.com",
  projectId: "headstaart",
  storageBucket: "headstaart.firebasestorage.app",
  messagingSenderId: "792517609416",
  appId: "1:792517609416:web:8acd2f6f1df5904ad0a2fd"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);

  const notificationTitle = payload.notification?.title || 'New Message';
  const notificationOptions = {
    body: payload.notification?.body || 'New notification received',
    icon: bellIconUrl, 
    badge: bellIconUrl, 
    data: payload.data
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});