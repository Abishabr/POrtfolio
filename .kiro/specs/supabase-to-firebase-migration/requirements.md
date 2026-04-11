# Requirements Document

## Introduction

This feature migrates the backend of a React + TypeScript + Vite portfolio site from Supabase to Firebase. The current system uses Supabase Auth for authentication, Supabase PostgreSQL for data storage (projects, skills, contact messages), and Supabase Storage for project images. The target system replaces all of these with Firebase Auth, Firestore (NoSQL document database), and Firebase Storage. The admin panel (login, dashboard, projects, skills, messages, settings) and all public-facing pages that read data must continue to function identically after migration.

## Glossary

- **Firebase_Client**: The Firebase SDK instance initialized with the project's Firebase configuration, used throughout the app to interact with Firebase services.
- **Firebase_Auth**: The Firebase Authentication service, replacing Supabase Auth for user sign-in, sign-out, and password reset.
- **Firestore**: The Firebase Cloud Firestore NoSQL database, replacing the Supabase PostgreSQL tables (`projects`, `skills`, `contact_messages`).
- **Firebase_Storage**: The Firebase Cloud Storage service, replacing Supabase Storage for project image uploads.
- **Auth_Hook**: The `useAuth` React context hook (`src/hooks/useAuth.tsx`) that exposes authentication state and methods to the rest of the app.
- **Protected_Route**: The `ProtectedRoute` component (`src/components/admin/ProtectedRoute.tsx`) that guards admin pages from unauthenticated access.
- **Admin_User**: A Firebase Auth user whose UID is listed in the Firestore `admins` collection, granting access to the admin panel.
- **Firestore_Rules**: Firebase Security Rules that control read/write access to Firestore collections.
- **Storage_Rules**: Firebase Security Rules that control read/write access to Firebase Storage buckets.
- **Contact_Message**: A document in the Firestore `contact_messages` collection with fields: `id`, `name`, `email`, `subject`, `message`, `is_read`, `created_at`.
- **Project**: A document in the Firestore `projects` collection with fields: `id`, `name`, `description`, `status`, `tech`, `github_url`, `live_url`, `image_url`, `featured`, `display_order`, `created_at`, `updated_at`.
- **Skill**: A document in the Firestore `skills` collection with fields: `id`, `name`, `category`, `proficiency`, `icon`, `display_order`, `created_at`.

---

## Requirements

### Requirement 1: Firebase Client Initialization

**User Story:** As a developer, I want a single Firebase client module, so that all parts of the app share one initialized Firebase instance.

#### Acceptance Criteria

1. THE Firebase_Client SHALL be initialized using environment variables `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, and `VITE_FIREBASE_APP_ID`.
2. THE Firebase_Client SHALL export initialized `auth`, `db` (Firestore), and `storage` service instances from `src/integrations/firebase/client.ts`.
3. THE Firebase_Client SHALL replace the Supabase client at `src/integrations/supabase/client.ts` as the sole backend integration entry point.
4. IF any required Firebase environment variable is missing at build time, THE Firebase_Client SHALL throw a descriptive error identifying the missing variable.

---

### Requirement 2: Firebase Authentication

**User Story:** As an admin, I want to sign in and out using Firebase Auth, so that I can securely access the admin panel.

#### Acceptance Criteria

1. WHEN an admin submits valid credentials on the login page, THE Firebase_Auth SHALL authenticate the user with email and password and establish a persistent session.
2. WHEN an admin submits invalid credentials, THE Firebase_Auth SHALL return an error and THE Auth_Hook SHALL surface the error message to the UI.
3. WHEN an authenticated admin clicks sign out, THE Firebase_Auth SHALL terminate the session and THE Auth_Hook SHALL set `user` to `null`.
4. WHEN the app loads, THE Auth_Hook SHALL restore the previous session from local storage if one exists, without requiring the user to log in again.
5. THE Auth_Hook SHALL expose `user`, `isAdmin`, `isLoading`, `signIn`, `signOut`, and `signUp` with the same interface as the current Supabase-based hook.
6. WHEN a user requests a password reset, THE Firebase_Auth SHALL send a password reset email to the provided address with a link to the `/reset-password` route.
7. WHEN a user submits a new password on the reset password page with a valid out-of-band code, THE Firebase_Auth SHALL update the user's password and redirect to `/admin`.

---

### Requirement 3: Admin Role Verification

**User Story:** As the system, I want to verify that a logged-in user has admin privileges, so that only authorized users can access the admin panel.

#### Acceptance Criteria

1. THE Firestore SHALL contain an `admins` collection where each document ID is the UID of an Admin_User.
2. WHEN a user signs in, THE Auth_Hook SHALL query the `admins` collection to determine whether the user's UID exists as a document, and SHALL set `isAdmin` to `true` if found.
3. WHEN a user signs out, THE Auth_Hook SHALL set `isAdmin` to `false`.
4. THE Protected_Route SHALL redirect unauthenticated users or non-admin users to `/admin`.
5. WHILE `isLoading` is `true`, THE Protected_Route SHALL display a loading indicator and SHALL NOT redirect.

---

### Requirement 4: Firestore Security Rules

**User Story:** As a developer, I want Firestore security rules that mirror the existing Supabase RLS policies, so that data is protected appropriately.

#### Acceptance Criteria

1. THE Firestore_Rules SHALL allow any unauthenticated client to read documents from the `projects` collection.
2. THE Firestore_Rules SHALL allow any unauthenticated client to read documents from the `skills` collection.
3. THE Firestore_Rules SHALL allow any unauthenticated client to create documents in the `contact_messages` collection.
4. THE Firestore_Rules SHALL allow only Admin_Users to read, update, and delete documents in the `contact_messages` collection.
5. THE Firestore_Rules SHALL allow only Admin_Users to create, update, and delete documents in the `projects` collection.
6. THE Firestore_Rules SHALL allow only Admin_Users to create, update, and delete documents in the `skills` collection.
7. THE Firestore_Rules SHALL allow only Admin_Users to read and write documents in the `admins` collection.

---

### Requirement 5: Projects Data Layer

**User Story:** As a visitor, I want to view projects fetched from Firestore, so that the public projects page displays up-to-date data.

#### Acceptance Criteria

1. WHEN the Projects page loads, THE Firestore SHALL return all documents from the `projects` collection ordered by `display_order` ascending.
2. WHEN an Admin_User creates a project via the admin panel, THE Firestore SHALL add a new document to the `projects` collection with all provided fields and a server-generated `created_at` timestamp.
3. WHEN an Admin_User updates a project, THE Firestore SHALL update the corresponding document and set `updated_at` to the current server timestamp.
4. WHEN an Admin_User deletes a project, THE Firestore SHALL remove the corresponding document from the `projects` collection.
5. THE Projects page and AdminProjects page SHALL use the same Firestore data source and SHALL NOT reference any Supabase client.

---

### Requirement 6: Skills Data Layer

**User Story:** As a visitor, I want to view skills fetched from Firestore, so that the public skills page displays up-to-date data.

#### Acceptance Criteria

1. WHEN the Skills page loads, THE Firestore SHALL return all documents from the `skills` collection ordered by `display_order` ascending.
2. WHEN an Admin_User creates a skill, THE Firestore SHALL add a new document to the `skills` collection with all provided fields.
3. WHEN an Admin_User updates a skill, THE Firestore SHALL update the corresponding document in the `skills` collection.
4. WHEN an Admin_User deletes a skill, THE Firestore SHALL remove the corresponding document from the `skills` collection.
5. THE AdminSkills page SHALL NOT reference any Supabase client.
6. THE Skills page SHALL NOT use the hardcoded `skills` array defined in `src/pages/Skills.tsx`; all skill entries SHALL be fetched from Firestore.
7. THE Skills page SHALL NOT use the hardcoded `tech_stack` array in the "Technologies Grid" section; all technology names SHALL be derived from the Firestore `skills` collection.
8. WHEN the Skills page loads, THE Skills page SHALL compute the "System Stats Overview" stat cards dynamically from the Firestore `skills` collection, deriving the top skill name and highest proficiency value per category rather than using hardcoded values.
9. IF the Firestore query for skills fails, THE Skills page SHALL display an error message and SHALL NOT render hardcoded fallback data.

---

### Requirement 7: Contact Messages Data Layer

**User Story:** As a visitor, I want to submit a contact message that is stored in Firestore, so that the site owner can read it in the admin panel.

#### Acceptance Criteria

1. WHEN a visitor submits the contact form with valid fields (name, email, subject, message), THE Firestore SHALL add a new document to the `contact_messages` collection with `is_read` set to `false` and a server-generated `created_at` timestamp.
2. IF the Firestore write fails, THE Contact page SHALL display an error message to the visitor.
3. WHEN an Admin_User opens a message in the admin panel, THE Firestore SHALL update the document's `is_read` field to `true`.
4. WHEN an Admin_User deletes a message, THE Firestore SHALL remove the corresponding document from the `contact_messages` collection.
5. THE AdminMessages page SHALL NOT reference any Supabase client.

---

### Requirement 8: Firebase Storage for Project Images

**User Story:** As an Admin_User, I want to upload project images to Firebase Storage, so that project images are served from Firebase instead of Supabase Storage.

#### Acceptance Criteria

1. WHEN an Admin_User selects an image file in the AdminProjects form, THE Firebase_Storage SHALL upload the file to the `project-images/` path with a unique filename.
2. WHEN an image upload completes, THE Firebase_Storage SHALL return a public download URL and THE AdminProjects page SHALL store that URL in the project's `image_url` field in Firestore.
3. IF an image upload fails, THE AdminProjects page SHALL display an error toast and SHALL retain any previously saved image URL.
4. THE Storage_Rules SHALL allow any authenticated user to upload files to the `project-images/` path.
5. THE Storage_Rules SHALL allow any client (unauthenticated) to read files from the `project-images/` path.

---

### Requirement 9: Admin Dashboard Statistics

**User Story:** As an Admin_User, I want the dashboard to show counts of projects, skills, and messages, so that I have an overview of the portfolio content.

#### Acceptance Criteria

1. WHEN the AdminDashboard page loads, THE Firestore SHALL return the count of documents in the `projects` collection.
2. WHEN the AdminDashboard page loads, THE Firestore SHALL return the count of documents in the `skills` collection.
3. WHEN the AdminDashboard page loads, THE Firestore SHALL return the count of documents in the `contact_messages` collection and the count where `is_read` is `false`.
4. WHEN the AdminDashboard page loads, THE Firestore SHALL return the 3 most recent documents from `contact_messages` ordered by `created_at` descending.
5. THE AdminDashboard page SHALL NOT reference any Supabase client.

---

### Requirement 11: Home Page Featured Projects from Firestore

**User Story:** As a visitor, I want the "Featured Projects" section on the Home page to display real projects from Firestore, so that the home page reflects the actual portfolio content.

#### Acceptance Criteria

1. WHEN the Home page loads, THE Firestore SHALL return all documents from the `projects` collection where `featured` is `true`, ordered by `display_order` ascending.
2. THE Home page SHALL NOT use the hardcoded `featuredProjects` array defined in `src/pages/Home.tsx`; all featured project entries SHALL be fetched from Firestore.
3. WHEN the Firestore query returns zero featured projects, THE Home page SHALL render an empty "Featured Projects" grid and SHALL NOT display hardcoded placeholder projects.
4. IF the Firestore query for featured projects fails, THE Home page SHALL display an error message in the "Featured Projects" section and SHALL NOT render hardcoded fallback data.
5. WHEN the Home page is loading featured projects from Firestore, THE Home page SHALL display a loading skeleton in place of the project cards until the data is available.

---

### Requirement 10: Removal of Supabase Dependencies

**User Story:** As a developer, I want all Supabase code and dependencies removed, so that the codebase has no remaining Supabase references after migration.

#### Acceptance Criteria

1. THE codebase SHALL NOT contain any import of `@supabase/supabase-js` or `src/integrations/supabase/client` after migration is complete.
2. THE `@supabase/supabase-js` package SHALL be removed from `package.json` dependencies.
3. THE `firebase` npm package SHALL be added to `package.json` dependencies.
4. THE `src/integrations/supabase/` directory SHALL be replaced by `src/integrations/firebase/` containing `client.ts` and `types.ts`.
5. THE `src/integrations/firebase/types.ts` file SHALL define TypeScript interfaces for `Project`, `Skill`, and `ContactMessage` matching the Firestore document shapes.

---

### Requirement 12: Real-Time Data Synchronization

**User Story:** As a visitor, I want public pages to reflect admin changes immediately, so that I always see the latest portfolio content without refreshing the page.

#### Acceptance Criteria

1. THE Projects page SHALL use a Firestore `onSnapshot` listener instead of a one-time `getDocs` call, so that any create, update, or delete made by an Admin_User is reflected in the UI within the same listener cycle without a page reload.
2. THE Skills page SHALL use a Firestore `onSnapshot` listener instead of a one-time `getDocs` call, so that any create, update, or delete made by an Admin_User is reflected in the UI within the same listener cycle without a page reload.
3. THE Home page "Featured Projects" section SHALL use a Firestore `onSnapshot` listener instead of a one-time `getDocs` call, so that any change to featured projects made by an Admin_User is reflected in the UI within the same listener cycle without a page reload.
4. WHEN an Admin_User creates, updates, or deletes a Project, THE Projects page SHALL update its displayed project list within the same Firestore listener cycle.
5. WHEN an Admin_User creates, updates, or deletes a Skill, THE Skills page SHALL update its displayed skill list within the same Firestore listener cycle.
6. WHEN an Admin_User marks a Contact_Message as read or deletes it, THE AdminMessages page SHALL update its displayed message list within the same Firestore listener cycle without a page reload.
7. WHEN the AdminDashboard page is active, THE AdminDashboard SHALL use Firestore `onSnapshot` listeners to keep the project count, skill count, total message count, unread message count, and recent messages list up to date in real-time.
8. WHEN a component using a Firestore `onSnapshot` listener is unmounted, THE component SHALL unsubscribe from the listener to prevent memory leaks.
9. IF a Firestore `onSnapshot` listener receives an error, THE affected page SHALL display an error message and SHALL NOT render stale or partial data silently.
