export async function fetchRedditPosts(subreddit) {
  try {
    const response = await fetch(
      `https://www.reddit.com/r/${subreddit}/hot.json?limit=10`
    );
    const data = await response.json();

    if (data.error) {
      throw new Error("Subreddit not found!");
    }

    return data.data.children.map((post) => post.data);
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Failed to fetch posts.");
  }
}
