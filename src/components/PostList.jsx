function PostList({ posts, onFavoriteToggle, favorites }) {
  const isFavorite = (id) => favorites.includes(id);

  return (
    <ul style={{ listStyle: "none", padding: 0, marginTop: "20px" }}>
      {posts.map((post) => (
        <li key={post.id} style={{ marginBottom: "10px" }}>
          <a
            href={`https://www.reddit.com${post.permalink}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {post.title}
          </a>
          <button
            onClick={() => onFavoriteToggle(post.id)}
            style={{
              marginLeft: "10px",
              backgroundColor: isFavorite(post.id) ? "red" : "green",
              color: "white",
              padding: "5px 10px",
            }}
          >
            {isFavorite(post.id) ? "Unfavorite" : "Favorite"}
          </button>
        </li>
      ))}
    </ul>
  );
}

export default PostList;
