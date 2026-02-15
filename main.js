// Connect to Supabase
const supabaseUrl = "https://ibcsaiaxgfaqmowvoqmk.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliY3NhaWF4Z2ZhcW1vd3ZvcW1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNDg1ODksImV4cCI6MjA4NjcyNDU4OX0.yTmZ_XHxx5dQHrP1XISSkGs4bJ8YtEsUnfx-e48SY7c";
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

let currentUser = null;

async function login() {
  const username = document.getElementById('username').value.trim();
  if (!username) return alert("Enter a username");

  const { data, error } = await supabase.from('users').select().eq('username', username).limit(1);
  if (error) return alert("Error: " + error.message);

  if (data.length === 0) {
    const { data: newUser, error: e } = await supabase.from('users').insert([{ username }]).select();
    if (e) return alert("Error: " + e.message);
    currentUser = newUser[0];
  } else {
    currentUser = data[0];
  }

  alert("Logged in as: " + username);
  renderFeed();
}

async function createPost() {
  if (!currentUser) return alert("Login first");
  const content = document.getElementById('postContent').value.trim();
  if (!content) return alert("Write something");

  const { data, error } = await supabase.from('posts').insert([{ user_id: currentUser.id, content }]).select();
  if (error) return alert("Error: " + error.message);

  document.getElementById('postContent').value = '';
  renderFeed();
}

async function renderFeed() {
  const { data: posts, error } = await supabase.from('posts').select('content, user_id').order('id', { ascending: false });
  if (error) return alert("Error: " + error.message);

  const feedDiv = document.getElementById('feed');
  feedDiv.innerHTML = '';
  posts.forEach(post => {
    const el = document.createElement('div');
    el.textContent = post.content + " (by user " + post.user_id + ")";
    el.style.border = "1px solid #ccc";
    el.style.padding = "5px";
    el.style.margin = "5px 0";
    feedDiv.appendChild(el);
  });
}
