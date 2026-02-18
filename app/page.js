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
  await supabase
    .from("bookmarks")
    .delete()
    .eq("id", id);
};

  return (
    <div style={{ display: "flex", height: "100vh", justifyContent: "center", alignItems: "center" }}>
      {user ? (
        <div>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
      <h1 style={{ fontSize: "36px", margin: "0" }}>
        Welcome
      </h1>
      <h2 style={{ fontSize: "24px", marginTop: "5px", fontWeight: "normal" }}>
        {user.user_metadata?.full_name?.split(" ")[0] || "User"}
      </h2>
    </div>
          
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
          <div style={{ marginTop: "20px" }}>
  <input
    type="text"
    placeholder="Bookmark Title"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
  />

  <input
    type="text"
    placeholder="Bookmark URL"
    value={url}
    onChange={(e) => setUrl(e.target.value)}
    style={{ marginLeft: "10px" }}
  />

  <button
    onClick={addBookmark}
    style={{ marginLeft: "10px" }}
  >
    Add
  </button>
</div>
<ul style={{ marginTop: "20px" }}>
  {bookmarks.map((bookmark) => (
    <li key={bookmark.id}>
      <a
  href={bookmark.url}
  target="_blank"
    rel="noopener noreferrer"
  >
    {bookmark.title}
  </a>

  <button
    onClick={() => handleDelete(bookmark.id)}
    style={{
      background: "red",
      color: "white",
      border: "none",
      padding: "4px 8px",
      marginLeft: "10px",
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
        <button onClick={handleLogin} style={{ padding: "12px 20px", fontSize: "16px" }}>
          Sign in with Google
        </button>
      )}
    </div>
  );
}
