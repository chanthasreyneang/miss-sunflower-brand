# Miss Sunflower — Firebase Setup Checklist

The app is fully wired for Firebase, but nothing will actually connect until you
create a real Firebase project and drop its config into a `.env` file. Follow
these steps in order.

## 1. Create the Firebase project

1. Go to the [Firebase console](https://console.firebase.google.com/) and click
   **Add project**. Name it whatever you like (e.g. "miss-sunflower").
2. Google Analytics is optional — you can skip it.

## 2. Register a Web App

1. In your new project, click the **Web** icon (`</>`) to add a web app.
2. Give it a nickname (e.g. "miss-sunflower-web"). You don't need Firebase
   Hosting for this step.
3. Firebase will show you a `firebaseConfig` object with keys like `apiKey`,
   `authDomain`, `projectId`, etc. Keep this tab open.

## 3. Enable Authentication

1. In the left sidebar, go to **Build → Authentication → Get started**.
2. Under **Sign-in method**, enable **Email/Password**.

## 4. Create Firestore

1. Go to **Build → Firestore Database → Create database**.
2. Choose **Start in production mode** (we're providing real security rules
   below, not the wide-open test-mode rules).
3. Pick any region close to you.

## 5. Publish the security rules

1. In Firestore, go to the **Rules** tab.
2. Replace the contents with everything in [`firestore.rules`](./firestore.rules)
   in this project, then click **Publish**.

## 6. Add your config to the app

1. In `react-app/`, copy `.env.example` to `.env`:
   ```
   cp .env.example .env
   ```
2. Fill in the six `VITE_FIREBASE_*` values using the `firebaseConfig` object
   from step 2. `.env` is already gitignored — never commit it.
3. Restart the dev server (`npm run dev`) if it was already running, so Vite
   picks up the new environment variables.

## 7. Create your admin account

Firestore security rules check a `role` field on your user document — there's
no built-in "first user is admin" behavior, so you set it by hand once:

1. Run the app and **Register** a normal account from the site (`/register`).
2. In the Firebase console, go to **Firestore Database → Data**, open the
   `users` collection, and find the document with your new user's UID.
3. Edit that document and change `role` from `"customer"` to `"admin"`.
4. Refresh the app (or log out/in). You'll now see **Admin Dashboard** in the
   account menu, and `/admin` will be reachable.

## 8. Seed the starter catalog

1. As your new admin, go to **Admin Dashboard → Products**.
2. Click **Seed Sample Data** — this writes the 18 products (and 7 categories)
   migrated from the original Miss Sunflower site into Firestore.
3. From here, use the dashboard's Add/Edit/Delete actions for real CRUD —
   changes show up live on the public site immediately.

## Notes

- Product images in the admin form are entered as **image URLs**, not file
  uploads — this build intentionally doesn't use Firebase Storage, to keep
  everything on Firebase's free Spark plan. Existing seeded products use their
  bundled local images automatically.
- Contact form submissions, product feedback, and newsletter signups are
  written to `contactMessages`, `feedback`, and `newsletterSignups` in
  Firestore — readable only by an admin account (via the Firestore console,
  since there's no in-app inbox UI for these).
