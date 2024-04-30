import {initializeApp} from "firebase/app";
import {getAuth, getIdToken} from "firebase/auth";
import {getInstallations, getToken} from "firebase/installations";

const firebaseConfig = {
  apiKey: "AIzaSyDzV6xcQ0VTlq61Y6PfF4hLdG0TNdGp3YE",
  authDomain: "friendlyeats-codelab-ca68f.firebaseapp.com",
  projectId: "friendlyeats-codelab-ca68f",
  storageBucket: "friendlyeats-codelab-ca68f.appspot.com",
  messagingSenderId: "928431631163",
  appId: "1:928431631163:web:abb7c084cc88177ae8251e",
};

self.addEventListener("fetch", (event) => {
  const {origin} = new URL(event.request.url);
  if (origin !== self.location.origin) return;
  event.respondWith(fetchWithFirebaseHeaders(event.request));
});

async function fetchWithFirebaseHeaders(request) {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const installations = getInstallations(app);
  const headers = new Headers(request.headers);
  const [authIdToken, installationToken] = await Promise.all([
    getAuthIdToken(auth),
    getToken(installations),
  ]);
  headers.append("Firebase-Instance-ID-Token", installationToken);
  if (authIdToken) headers.append("Authorization", `Bearer ${authIdToken}`);
  const newRequest = new Request(request, {headers});
  return await fetch(newRequest);
}

async function getAuthIdToken(auth) {
  await auth.authStateReady();
  if (!auth.currentUser) return;
  return await getIdToken(auth.currentUser);
}
