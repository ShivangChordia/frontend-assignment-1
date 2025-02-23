import { useState, useEffect } from "react";
import { fetchRedditPosts } from "./api/reddit";
import PostList from "./components/PostList";
import "./App.css";

function App() {
  const [subreddit, setSubreddit] = useState("");
  const [posts, setPosts] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage on initial render
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    if (favorites.length > 0) {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
  }, [favorites]);

  const handleFetchPosts = async () => {
    if (!subreddit) return;

    try {
      const fetchedPosts = await fetchRedditPosts(subreddit);
      setPosts(fetchedPosts);
    } catch (error) {
      alert(error.message);
      setPosts([]);
    }
  };

  // Toggle favorite status for a post
  const handleFavoriteToggle = (postId) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(postId)) {
        return prevFavorites.filter((id) => id !== postId);
      } else {
        return [...prevFavorites, postId];
      }
    });
  };

  // Fetch favorite posts from Reddit using the post IDs stored in localStorage
  const fetchFavoritePosts = async () => {
    const favoritePostIds = JSON.parse(localStorage.getItem("favorites")) || [];
    const favoritePosts = [];

    for (let id of favoritePostIds) {
      try {
        const response = await fetch(
          `https://www.reddit.com/comments/${id}.json`
        );
        const postData = await response.json();
        favoritePosts.push(postData[0].data.children[0].data);
      } catch (error) {
        console.error("Error fetching favorite post:", error);
      }
    }

    return favoritePosts;
  };

  // Fetch favorite posts when favorites change
  const [favoritePosts, setFavoritePosts] = useState([]);

  useEffect(() => {
    const getFavoritePosts = async () => {
      const fetchedFavoritePosts = await fetchFavoritePosts();
      setFavoritePosts(fetchedFavoritePosts);
    };

    getFavoritePosts();
  }, [favorites]);

  return (
    <div className="App">
      <h1>Reddit Favorites</h1>
      <div>
        <input
          type="text"
          placeholder="Enter subreddit"
          value={subreddit}
          onChange={(e) => setSubreddit(e.target.value)}
        />
        <button onClick={handleFetchPosts}>Fetch Posts</button>
      </div>

      <div className="section-container">
        {/* Subreddit Posts Section */}
        <div className="section">
          <h2>Top Posts from {subreddit}</h2>
          <PostList
            posts={posts}
            favorites={favorites}
            onFavoriteToggle={handleFavoriteToggle}
          />
        </div>

        {/* All Favorite Posts Section */}
        <div className="section">
          <h2>Your Favorite Posts</h2>
          {favoritePosts.length === 0 ? (
            <p>No favorite posts yet.</p>
          ) : (
            <PostList
              posts={favoritePosts}
              favorites={favorites}
              onFavoriteToggle={handleFavoriteToggle}
            />
          )}
        </div>
      </div>

      {/* Footer Section */}
      <footer className="footer">
        <p>Author: Shivang Chordia</p>
      </footer>
    </div>
  );
}

export default App;
