// -----------------------------
// Minimal Main.js for Mini Social
// -----------------------------

// Connect to Supabase
const supabaseUrl = "https://ibcsaiaxgfaqmowvoqmk.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliY3NhaWF4Z2ZhcW1vd3ZvcW1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNDg1ODksImV4cCI6MjA4NjcyNDU4OX0.yTmZ_XHxx5dQHrP1XISSkGs4bJ8YtEsUnfx-e48SY7c";
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Current logged-in user
let currentUser = null;

// -----------------------------
// Login Function
// -----------------------------
async function login() {
  const username = document.getElementById('username').value.trim();
  if (!username) return alert("Please enter a username");

  // Check if user exists
  const { data: existingUser, error } = await supabase
    .from('users')
    .select()
    .eq('username', username)
    .limit(1);

  if (error) return alert("Error checking user: " + error.message);

  if (existingUser.length === 0) {
    // Create new user
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([{ username }])
      .select();

    if (insertError) return alert("Error creating user: " + insertError.message);
    currentUser = newUser[0];
  } else {
    currentUser = existingUser[0];
  }

  alert("Logged in as: " + username);
  renderFeed();
}

// -----------------------------
// Create Post Function
// -----------------------------
async function createPost() {
  if (!currentUser) return alert("Please login first");
  const content = document.getElementById('postContent').value.trim();
  if (!content) return alert("Write something to post");

  const { data, error } = await supabase
    .from('posts')
    .insert([{ user_id: currentUser.id, content }])
    .select();

  if (error) return alert("Error creating post: " + error.message);

  document.getElementById('postContent').value = '';
  renderFeed();
}

// -----------------------------
// Render Feed Function
// -----------------------------
async function renderFeed() {
  const { data: posts, error } = await supabase
    .from('posts')
    .select('content, user_id')
    .order('id', { ascending: false });

  if (error) return alert("Error fetching feed: " + error.message);

  const feedDiv = document.getElementById('feed');
  feedDiv.innerHTML = '';

  posts.forEach(post => {
    const postEl = document.createElement('div');
    postEl.style.border = "1px solid #ccc";
    postEl.style.padding = "5px";
    postEl.style.margin = "5px 0";
    postEl.textContent = `${post.content} (by user ${post.user_id})`;
    feedDiv.appendChild(postEl);
  });
}

// -----------------------------
// Optional: auto-render feed every 5 seconds
// -----------------------------
setInterval(() => {
  if (currentUser) renderFeed();
}, 5000);
