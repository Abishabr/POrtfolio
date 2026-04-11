# Implementation Plan: Supabase to Firebase Migration

## Overview

Replace all Supabase dependencies (Auth, PostgreSQL, Storage) with Firebase (Auth, Firestore, Storage) across the React + TypeScript + Vite portfolio site. Each task builds incrementally — starting with the Firebase client, then auth, then page-by-page data layer migration, finishing with cleanup and tests.

## Tasks

- [ ] 1. Install Firebase and remove Supabase dependency
  - Remove `@supabase/supabase-js` from `package.json` dependencies
  - Add `firebase` npm package to `package.json` dependencies
  - Run `npm install` (or `bun install`) to update lockfile
  - _Requirements: 10.2, 10.3_

- [ ] 2. Create Firebase integration module
  - [ ] 2.1 Create `src/integrations/firebase/client.ts`
    - Initialize Firebase app with `getApps()` guard to prevent duplicate initialization
    - Read all six env vars (`VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`)
    - Throw a descriptive `Error: Missing Firebase config: VITE_FIREBASE_*` for any missing var before calling `initializeApp`
    - Export `auth`, `db`, and `storage` service singletons
    - _Requirements: 1.1, 1.2, 1.4_
  - [ ] 2.2 Create `src/integrations/firebase/types.ts`
    - Define `Project`, `Skill`, and `ContactMessage` TypeScript interfaces matching the Firestore document shapes described in the design
    - _Requirements: 10.5_

- [ ] 3. Update `useAuth` hook to use Firebase Auth + Firestore admins collection
  - Replace `@supabase/supabase-js` imports with `firebase/auth` and `firebase/firestore`
  - Replace `supabase.auth.onAuthStateChange` with `onAuthStateChanged`
  - Replace `supabase.auth.getSession` initial load with the `onAuthStateChanged` listener (Firebase handles persistence automatically)
  - Replace `supabase.rpc("has_role", ...)` admin check with `getDoc(doc(db, "admins", uid))` — `isAdmin = snapshot.exists()`
  - Replace `supabase.auth.signInWithPassword` with `signInWithEmailAndPassword`
  - Replace `supabase.auth.signUp` with `createUserWithEmailAndPassword`
  - Replace `supabase.auth.signOut` with `signOut(auth)`
  - Remove the `session` field from `AuthContextType` (Firebase has no session object)
  - Keep `user`, `isAdmin`, `isLoading`, `signIn`, `signOut`, `signUp` interface intact
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3_

- [ ] 4. Update `ProtectedRoute` component
  - Remove any remaining Supabase imports if present
  - Verify the component still reads `{ user, isAdmin, isLoading }` from `useAuth()` — no logic change needed since the hook interface is preserved
  - _Requirements: 3.4, 3.5_

- [ ] 5. Update `AdminLogin` page
  - Remove Supabase imports; import `auth` from `src/integrations/firebase/client`
  - Replace inline `supabase.auth.resetPasswordForEmail` call with `sendPasswordResetEmail(auth, email, { url: \`${window.location.origin}/reset-password\` })`
  - The sign-in form already calls `useAuth().signIn`, which is updated in task 3 — no further change needed for sign-in itself
  - Display `toast.error(error.message)` if `sendPasswordResetEmail` throws
  - _Requirements: 2.6_

- [ ] 6. Update `ResetPassword` page
  - Remove Supabase imports
  - Replace `supabase.auth.updateUser` / OOB code handling with Firebase `confirmPasswordReset(auth, oobCode, newPassword)` using the `oobCode` query param from the URL
  - On success, redirect to `/admin`
  - _Requirements: 2.7_

- [ ] 7. Update `Projects` page — replace Supabase with Firestore `onSnapshot`
  - Remove Supabase imports; import `db` from `src/integrations/firebase/client` and `Project` from `types.ts`
  - Replace one-time `supabase.from("projects").select(...)` with an `onSnapshot` listener on `query(collection(db, "projects"), orderBy("display_order", "asc"))`
  - Map each `DocumentSnapshot` to `{ id: doc.id, ...doc.data() } as Project`
  - Set `error` state in the `onSnapshot` error callback; render an error message when set
  - Unsubscribe from the listener on component unmount (return `unsub` from `useEffect`)
  - _Requirements: 5.1, 5.5, 12.1, 12.4, 12.8, 12.9_

- [ ] 8. Update `Skills` page — replace hardcoded data with Firestore `onSnapshot`
  - Remove Supabase imports and delete the hardcoded `skills` and `tech_stack` arrays
  - Import `db` from `src/integrations/firebase/client` and `Skill` from `types.ts`
  - Add `onSnapshot` listener on `query(collection(db, "skills"), orderBy("display_order", "asc"))`
  - Derive the "Technologies Grid" section from the fetched skills (map `skill.name`)
  - Compute "System Stats Overview" stat cards dynamically: top skill name and highest proficiency per category from the fetched data
  - Display an error message (not hardcoded fallback) if the listener errors
  - Unsubscribe on unmount
  - _Requirements: 6.1, 6.6, 6.7, 6.8, 6.9, 12.2, 12.5, 12.8, 12.9_

- [ ] 9. Update `Home` page — replace hardcoded featured projects with Firestore `onSnapshot`
  - Remove the hardcoded `featuredProjects` array
  - Import `db` from `src/integrations/firebase/client` and `Project` from `types.ts`
  - Add `onSnapshot` listener on `query(collection(db, "projects"), where("featured", "==", true), orderBy("display_order", "asc"))`
  - Show a loading skeleton while `isLoading` is `true`
  - Render an empty grid (no hardcoded placeholders) when zero featured projects are returned
  - Display an error message in the "Featured Projects" section if the listener errors
  - Unsubscribe on unmount
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 12.3, 12.8, 12.9_

- [ ] 10. Update `Contact` page — replace Supabase with Firestore `addDoc`
  - Remove Supabase imports; import `db` from `src/integrations/firebase/client`
  - Replace `supabase.from("contact_messages").insert(...)` with `addDoc(collection(db, "contact_messages"), { ...fields, is_read: false, created_at: serverTimestamp() })`
  - On write failure, display `[ERROR] Failed to send message` in terminal output and call `toast.error`
  - _Requirements: 7.1, 7.2_

- [ ] 11. Update `AdminProjects` page — replace Supabase with Firestore CRUD + Firebase Storage
  - Remove Supabase imports; import `db`, `storage` from `src/integrations/firebase/client` and `Project` from `types.ts`
  - Replace list query with `onSnapshot` listener on `collection(db, "projects")` ordered by `display_order`
  - Replace insert with `addDoc(collection(db, "projects"), { ...payload, created_at: serverTimestamp() })`
  - Replace update with `updateDoc(doc(db, "projects", id), { ...payload, updated_at: serverTimestamp() })`
  - Replace delete with `deleteDoc(doc(db, "projects", id))`
  - Replace Supabase Storage upload with `uploadBytes(ref(storage, \`project-images/${Date.now()}-${filename}\`), file)` then `getDownloadURL`
  - On upload failure, call `toast.error("Image upload failed: ...")` and retain the previous `image_url`
  - Unsubscribe `onSnapshot` on unmount
  - _Requirements: 5.2, 5.3, 5.4, 5.5, 8.1, 8.2, 8.3, 12.8_

- [ ] 12. Update `AdminSkills` page — replace Supabase with Firestore CRUD
  - Remove Supabase imports; import `db` from `src/integrations/firebase/client` and `Skill` from `types.ts`
  - Replace list query with `onSnapshot` listener on `collection(db, "skills")` ordered by `display_order`
  - Replace insert with `addDoc(collection(db, "skills"), { ...payload, created_at: serverTimestamp() })`
  - Replace update with `updateDoc(doc(db, "skills", id), payload)`
  - Replace delete with `deleteDoc(doc(db, "skills", id))`
  - Unsubscribe `onSnapshot` on unmount
  - _Requirements: 6.2, 6.3, 6.4, 6.5, 12.8_

- [ ] 13. Update `AdminMessages` page — replace Supabase with Firestore `onSnapshot` + CRUD
  - Remove Supabase imports; import `db` from `src/integrations/firebase/client` and `ContactMessage` from `types.ts`
  - Replace list query with `onSnapshot` listener on `collection(db, "contact_messages")` ordered by `created_at` descending
  - Replace mark-as-read with `updateDoc(doc(db, "contact_messages", id), { is_read: true })`
  - Replace delete with `deleteDoc(doc(db, "contact_messages", id))`
  - Unsubscribe `onSnapshot` on unmount
  - _Requirements: 7.3, 7.4, 7.5, 12.6, 12.8_

- [ ] 14. Update `AdminDashboard` page — replace Supabase with Firestore `onSnapshot` counts
  - Remove Supabase imports; import `db` from `src/integrations/firebase/client`
  - Replace project count query with `onSnapshot` on `collection(db, "projects")` — derive count from `snap.size`
  - Replace skill count query with `onSnapshot` on `collection(db, "skills")` — derive count from `snap.size`
  - Replace message count query with `onSnapshot` on `collection(db, "contact_messages")` — derive total and unread (`is_read === false`) counts
  - Replace recent messages query with `onSnapshot` on `query(collection(db, "contact_messages"), orderBy("created_at", "desc"), limit(3))`
  - Unsubscribe all listeners on unmount
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 12.7, 12.8_

- [ ] 15. Update `AdminSettings` page if it references Supabase
  - Search `src/pages/admin/AdminSettings.tsx` for any Supabase imports or `supabase.*` calls
  - Replace any found references with Firebase equivalents following the same patterns used in tasks 3–14
  - If no Supabase references exist, no changes are needed
  - _Requirements: 10.1_

- [ ] 16. Checkpoint — verify all pages compile and core flows work
  - Ensure all TypeScript diagnostics pass across modified files
  - Confirm no remaining `@supabase/supabase-js` or `src/integrations/supabase` imports exist in `src/`
  - Ask the user if any questions arise before proceeding to cleanup

- [ ] 17. Delete `src/integrations/supabase/` directory
  - Delete `src/integrations/supabase/client.ts`
  - Delete `src/integrations/supabase/types.ts`
  - _Requirements: 10.4_

- [ ] 18. Update `.env` with Firebase env vars
  - Remove `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` entries
  - Add placeholder entries for all six Firebase vars: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`
  - _Requirements: 1.1_

- [ ] 19. Write property-based tests using fast-check
  - Install `fast-check` as a dev dependency if not already present
  - [ ]* 19.1 Write property test for contact message round-trip (Property 1)
    - Generate random `{ name, email, subject, message }` with non-empty strings using `fc.record`
    - Assert: after `addDoc` + `getDoc` against Firestore emulator, returned fields match input and `is_read === false`
    - Tag: `Feature: supabase-to-firebase-migration, Property 1: contact message round-trip`
    - **Property 1: Contact message round-trip**
    - **Validates: Requirements 7.1**
  - [ ]* 19.2 Write property test for admin check correctness (Property 2)
    - Generate random UIDs and a boolean deciding whether to insert an `admins` doc
    - Assert: `checkIsAdmin(uid)` returns `true` iff the doc was inserted
    - Tag: `Feature: supabase-to-firebase-migration, Property 2: admin check correctness`
    - **Property 2: Admin check correctness**
    - **Validates: Requirements 3.2**
  - [ ]* 19.3 Write property test for onSnapshot listener cleanup (Property 3)
    - Generate random mount/unmount sequences; use a mock `onSnapshot` that returns a tracked unsubscribe function
    - Assert: after unmount, the mock unsubscribe has been called exactly once
    - Tag: `Feature: supabase-to-firebase-migration, Property 3: onSnapshot listener cleanup`
    - **Property 3: onSnapshot listener cleanup**
    - **Validates: Requirements 12.8**
  - [ ]* 19.4 Write property test for Skills page derives data from Firestore (Property 4)
    - Generate random arrays of `Skill` objects with varying names, categories, and proficiency values
    - Assert: rendered skill list matches the generated array exactly; no hardcoded skill names appear
    - Tag: `Feature: supabase-to-firebase-migration, Property 4: skills page derives data from Firestore`
    - **Property 4: Skills page derives data from Firestore**
    - **Validates: Requirements 6.6, 6.7, 6.8**
  - [ ]* 19.5 Write property test for Home page featured projects from Firestore (Property 5)
    - Generate random arrays of `Project` objects with random `featured` booleans and `display_order` values
    - Assert: rendered featured project cards match `projects.filter(p => p.featured).sort(by display_order)` exactly
    - Tag: `Feature: supabase-to-firebase-migration, Property 5: home page featured projects from Firestore`
    - **Property 5: Home page featured projects from Firestore**
    - **Validates: Requirements 11.2, 11.3**
  - [ ]* 19.6 Write property test for image upload URL stored in Firestore (Property 6)
    - Generate random file names and mock download URLs; mock `uploadBytes` and `getDownloadURL`
    - Assert: after `uploadImage()`, the `image_url` in the saved Firestore doc equals the mocked `getDownloadURL` return value
    - Tag: `Feature: supabase-to-firebase-migration, Property 6: image upload URL stored in Firestore`
    - **Property 6: Image upload URL stored in Firestore**
    - **Validates: Requirements 8.2**

- [ ] 20. Final cleanup — verify no remaining Supabase imports
  - Search the entire `src/` directory for any remaining `supabase`, `@supabase`, or `VITE_SUPABASE` references
  - Fix any stragglers found
  - Run `npm test` (or `bun test`) to confirm all tests pass
  - _Requirements: 10.1, 10.2_

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Property tests (19.1–19.6) require the Firebase Local Emulator Suite for tasks that hit Firestore/Auth; tasks 19.3 and 19.6 use mocks only
- Each task references specific requirements for traceability
- The `supabase/` directory at the project root (migrations, config) is out of scope — it can be removed separately once the Firebase project is fully set up
