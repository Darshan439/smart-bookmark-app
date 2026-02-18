"use client";

import { useEffect, useState } from "react";
import {supabase} from "../lib/supabase";

export default function Home() {
  const [title, setTitle] = useState("");
const [url, setUrl] = useState("");
const [bookmarks, setBookmarks] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
  const getSession = async () => {
    const { data } = await supabase.auth.getSession();
    setUser(data.session?.user ?? null);
  };

  getSession();

  const { data: listener } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      setUser(session?.user ?? null);
    }
  );

  return () => {
    listener.subscription.unsubscribe();
  };
}, []);
useEffect(() => {
  if (user) {
    fetchBookmarks();
  }
}, [user]);
  const fetchBookmarks = async () => {
  if (!user) return;

  const { data, error } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("user_id", user.id);

  if (!error) {
    setBookmarks(data);
  }
};

  const addBookmark = async () => {
  console.log("User:", user);

  if (!title || !url || !user) {
    console.log("Missing data");
    return;
  }

  const { data, error } = await supabase
    .from("bookmarks")
    .insert([
      {
        title,
        url,
        user_id: user.id,
      },
    ]);

  console.log("Insert result:", data);
  console.log("Insert error:", error);
  if(!error) {
    fetchBookmarks();
  }

  setTitle("");
  setUrl("");
};



  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://smart-bookmark-app-mu-ruddy.vercel.app",
      },
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };
  const handleDelete = async (id) => {
  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("id", id);

  if (!error) {
    fetchBookmarks();
  }
};


  
return (
  <div
    style={{
      minHeight: "100vh",
      backgroundColor: "#000",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "Arial, sans-serif",
      color: "white"
    }}
  >
    {user ? (
      <div
        style={{
          backgroundColor: "#111",
          padding: "40px",
          borderRadius: "12px",
          width: "400px",
          boxShadow: "0 0 20px rgba(255,255,255,0.1)"
        }}
      >
       <h1 style={{ 
  fontSize: "48px",
  marginBottom: "8px",
  fontWeight: "600"
}}>
  Welcome
</h1>

<h3 style={{ 
  fontSize: "30px",
  marginTop: "0",
  marginBottom: "25px",
  fontWeight: "400",
  color: "#bbbbbb"
}}>
  {user.user_metadata?.full_name?.split(" ")[0] || "User"}
</h3>

        <button
          onClick={handleLogout}
          style={{
            padding: "6px 12px",
            backgroundColor: "#ff4d4d",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            marginBottom: "20px"
          }}
        >
          Logout
        </button>

        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Bookmark Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "10px",
              borderRadius: "6px",
              border: "1px solid #333",
              backgroundColor: "#222",
              color: "white"
            }}
          />

          <input
            type="text"
            placeholder="Bookmark URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "10px",
              borderRadius: "6px",
              border: "1px solid #333",
              backgroundColor: "#222",
              color: "white"
            }}
          />

          <button
            onClick={addBookmark}
            style={{
              width: "100%",
              padding: "8px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Add Bookmark
          </button>
        </div>

        <ul style={{ listStyle: "none", padding: 0 }}>
          {bookmarks.map((bookmark) => (
            <li
              key={bookmark.id}
              style={{
                backgroundColor: "#1a1a1a",
                padding: "10px",
                borderRadius: "6px",
                marginBottom: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#4da6ff",
                  textDecoration: "none"
                }}
              >
                {bookmark.title}
              </a>

              <button
                onClick={() => handleDelete(bookmark.id)}
                style={{
                  backgroundColor: "#ff4d4d",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "4px 8px",
                  cursor: "pointer"
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    ) : (
      <button
        onClick={handleLogin}
        style={{
          padding: "12px 20px",
          fontSize: "16px",
          borderRadius: "6px",
          border: "none",
          cursor: "pointer"
        }}
      >
        Sign in with Google
      </button>
    )}
  </div>
);
}