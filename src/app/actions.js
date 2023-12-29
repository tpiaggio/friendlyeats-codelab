"use server";

import {addReviewToRestaurant} from "@/src/lib/firebase/firestore.js";
import {
  getAdminAuth,
  getAuthenticatedAppForUser,
} from "@/src/lib/firebase/firebase";
import {getFirestore} from "firebase/firestore";
import {cookies} from "next/headers";

// This is a next.js server action, an alpha feature, so
// use with caution
// https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions

export async function handleReviewFormSubmission(data) {
  const {app} = await getAuthenticatedAppForUser();
  console.log("handleReviewFormSubmission - app", app);
  const db = getFirestore(app);

  await addReviewToRestaurant(db, data.get("restaurantId"), {
    text: data.get("text"),
    rating: data.get("rating"),

    // This came from a hidden form field.
    userId: data.get("userId"),
  });
}

export async function createSessionCookie(idToken) {
  console.log("createSessionCookie");
  const adminAuth = await getAdminAuth();
  const expiresIn = 60 * 60 * 24 * 5 * 1000;
  const sessionCookie = await adminAuth.createSessionCookie(idToken, {
    expiresIn,
  });
  console.log("sessionCookie", sessionCookie);
  const options = {
    name: "__session",
    value: sessionCookie,
    maxAge: expiresIn,
    httpOnly: true,
    secure: true,
  };

  //Add the cookie to the browser
  const responseCookies = cookies().set(options);
  console.log("responseCookies", responseCookies);
}

export async function deleteSessionCookie() {
  //Remove the cookie from the browser
  console.log("session cookie", cookies().get("__session"));
  cookies().delete("__session");
}
