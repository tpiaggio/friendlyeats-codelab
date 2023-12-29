import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged as _onAuthStateChanged,
} from "firebase/auth";

import {auth} from "@/src/lib/firebase/firebase";
import {createSessionCookie, deleteSessionCookie} from "@/src/app/actions";

export function onAuthStateChanged(cb) {
  return _onAuthStateChanged(auth, cb);
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();

  try {
    await signInWithPopup(auth, provider).then(async (userCredential) => {
      const idToken = await userCredential.user.getIdToken();
      await createSessionCookie(idToken);
    });
  } catch (error) {
    console.error("Error signing in with Google", error);
  }
}

export async function signOut() {
  try {
    return auth.signOut().then(async () => {
      await deleteSessionCookie();
    });
  } catch (error) {
    console.error("Error signing out with Google", error);
  }
}
