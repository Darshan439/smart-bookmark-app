Smart Bookmark App :

This is a full-stack bookmark management web application built using Next.js and Supabase. Users can securely log in using Google OAuth and manage their personal bookmarks.

  Tech Stack:
 Next.js (App Router)
 Supabase (Authentication & Database)
 Vercel (Deployment)

 Features:
Google OAuth authentication
 User-specific bookmark storage
 Add bookmarks
 Delete bookmarks
 Real-time UI updates
 Secure user data isolation

 Authentication & Privacy:
Each bookmark is stored with a user_id. While fetching bookmarks, queries are filtered using the logged-in user's ID to ensure privacy between users.

 Real-Time Updates
After inserting or deleting a bookmark, the application refreshes the state using fetchBookmarks() to update the UI instantly.

 Deployment:
The application is deployed on Vercel and connected to Supabase backend services.

 Challenges Faced
Configuring OAuth redirect URLs correctly
 Handling authentication session management
