let currentUser = null;
let currentPage = 'dashboard';
let games = [];

document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  setupEventListeners();
});

function setupEventListeners() {
  document.getElementById('login-form')?.addEventListener('submit', handleLogin);
  document.getElementById('logout-btn')?.addEventListener('click', handleLogout);
  document.getElementById('add-game-btn')?.addEventListener('click', () => openGameModal());
  document.getElementById('game-form')?.addEventListener('submit', handleGameSubmit);
  document.getElementById('content-form')?.addEventListener('submit', handleContentSubmit);
  document.getElementById('close-modal')?.addEventListener('click', closeGameModal);
  document.getElementById('cancel-modal')?.addEventListener('click', closeGameModal);
  
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      if (link.id === 'logout-btn') return;
      e.preventDefault();
      const page = link.getAttribute('data-page');
      if (page) navigateTo(page);
    });
  });

  window.onclick = (e) => {
    const modal = document.getElementById('game-modal');
    if (e.target === modal) {
      closeGameModal();
    }
  };
}

async function checkAuth() {
  try {
    const response = await fetch('/api/admin/check');
    const data = await response.json();
    
    if (data.authenticated) {
      currentUser = data.username;
      showAdminPanel();
      loadDashboard();
    } else {
      showLoginPanel();
    }
  } catch (error) {
    console.error('Auth check failed:', error);
    showLoginPanel();
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const errorDiv = document.getElementById('login-error');
  errorDiv.classList.remove('show');
  
  const formData = new FormData(e.target);
  const credentials = {
    username: formData.get('username'),
    password: formData.get('password')
  };
  
  try {
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      currentUser = data.username;
      showAdminPanel();
      loadDashboard();
    } else {
      errorDiv.textContent = data.error || 'Login failed';
      errorDiv.classList.add('show');
    }
  } catch (error) {
    errorDiv.textContent = 'Connection error. Please try again.';
    errorDiv.classList.add('show');
  }
}

async function handleLogout() {
  try {
    await fetch('/api/admin/logout', { method: 'POST' });
    currentUser = null;
    showLoginPanel();
  } catch (error) {
    console.error('Logout failed:', error);
  }
}

function showLoginPanel() {
  document.getElementById('login-container').style.display = 'flex';
  document.getElementById('admin-container').style.display = 'none';
}

function showAdminPanel() {
  document.getElementById('login-container').style.display = 'none';
  document.getElementById('admin-container').style.display = 'flex';
  document.getElementById('current-user').textContent = currentUser;
}

function navigateTo(page) {
  currentPage = page;
  
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });
  document.querySelector(`[data-page="${page}"]`)?.classList.add('active');
  
  document.querySelectorAll('.page-content').forEach(content => {
    content.style.display = 'none';
  });
  
  const titles = {
    dashboard: 'Dashboard',
    games: 'Manage Games',
    content: 'Site Content'
  };
  
  document.getElementById('page-title').textContent = titles[page] || page;
  document.getElementById(`${page}-page`).style.display = 'block';
  
  if (page === 'dashboard') loadDashboard();
  if (page === 'games') loadGames();
  if (page === 'content') loadContent();
}

async function loadDashboard() {
  try {
    const response = await fetch('/api/games');
    const gamesData = await response.json();
    
    document.getElementById('total-games').textContent = gamesData.length;
    document.getElementById('last-updated').textContent = 'Just now';
  } catch (error) {
    console.error('Failed to load dashboard:', error);
  }
}

async function loadGames() {
  const tbody = document.getElementById('games-table-body');
  tbody.innerHTML = '<tr><td colspan="6" class="loading">Loading...</td></tr>';
  
  try {
    const response = await fetch('/api/games');
    games = await response.json();
    
    if (games.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="loading">No games found. Click "Add New Game" to get started.</td></tr>';
      return;
    }
    
    tbody.innerHTML = games.map(game => `
      <tr>
        <td><img src="${game.image}" alt="${game.title}" class="game-image"></td>
        <td>${game.title}</td>
        <td>${game.genre}</td>
        <td>${game.category}</td>
        <td>${game.cta_text}</td>
        <td>
          <button class="action-btn btn-edit" onclick="editGame(${game.id})">Edit</button>
          <button class="action-btn btn-delete" onclick="deleteGame(${game.id})">Delete</button>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    console.error('Failed to load games:', error);
    tbody.innerHTML = '<tr><td colspan="6" class="loading">Error loading games</td></tr>';
  }
}

function openGameModal(gameId = null) {
  const modal = document.getElementById('game-modal');
  const form = document.getElementById('game-form');
  const modalTitle = document.getElementById('modal-title');
  const previewDiv = document.getElementById('current-image-preview');
  
  form.reset();
  previewDiv.innerHTML = '';
  
  if (gameId) {
    const game = games.find(g => g.id === gameId);
    if (game) {
      modalTitle.textContent = 'Edit Game';
      document.getElementById('game-id').value = game.id;
      document.getElementById('game-title').value = game.title;
      document.getElementById('game-genre').value = game.genre;
      document.getElementById('game-description').value = game.description;
      document.getElementById('game-category').value = game.category;
      document.getElementById('game-cta').value = game.cta_text;
      document.getElementById('existing-image').value = game.image;
      
      previewDiv.innerHTML = `<p style="color: var(--text-dark); margin-top: 10px;">Current image:</p><img src="${game.image}" style="max-width: 200px; border-radius: 4px; margin-top: 5px;">`;
    }
  } else {
    modalTitle.textContent = 'Add New Game';
  }
  
  modal.classList.add('show');
}

function closeGameModal() {
  document.getElementById('game-modal').classList.remove('show');
}

async function handleGameSubmit(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const gameId = formData.get('game_id');
  
  const url = gameId ? `/api/games/${gameId}` : '/api/games';
  const method = gameId ? 'PUT' : 'POST';
  
  try {
    const response = await fetch(url, {
      method: method,
      body: formData
    });
    
    const data = await response.json();
    
    if (response.ok) {
      closeGameModal();
      loadGames();
      showSuccessMessage('Game saved successfully!');
    } else {
      alert('Error: ' + (data.error || 'Failed to save game'));
    }
  } catch (error) {
    console.error('Failed to save game:', error);
    alert('Error saving game. Please try again.');
  }
}

async function deleteGame(gameId) {
  if (!confirm('Are you sure you want to delete this game?')) {
    return;
  }
  
  try {
    const response = await fetch(`/api/games/${gameId}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      loadGames();
      showSuccessMessage('Game deleted successfully!');
    } else {
      alert('Failed to delete game');
    }
  } catch (error) {
    console.error('Failed to delete game:', error);
    alert('Error deleting game. Please try again.');
  }
}

function editGame(gameId) {
  openGameModal(gameId);
}

async function loadContent() {
  try {
    const response = await fetch('/api/content');
    const content = await response.json();
    
    Object.keys(content).forEach(key => {
      const input = document.getElementById(key);
      if (input) {
        input.value = content[key];
      }
    });
  } catch (error) {
    console.error('Failed to load content:', error);
  }
}

async function handleContentSubmit(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const updates = [];
  
  for (let [key, value] of formData.entries()) {
    updates.push(
      fetch(`/api/content/${key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value })
      })
    );
  }
  
  try {
    await Promise.all(updates);
    showSuccessMessage('Content updated successfully!');
  } catch (error) {
    console.error('Failed to update content:', error);
    alert('Error updating content. Please try again.');
  }
}

function showSuccessMessage(message) {
  const existingMsg = document.querySelector('.success-message');
  if (existingMsg) {
    existingMsg.remove();
  }
  
  const msgDiv = document.createElement('div');
  msgDiv.className = 'success-message';
  msgDiv.textContent = message;
  
  const pageContent = document.querySelector('.page-content[style*="display: block"]');
  if (pageContent) {
    pageContent.insertBefore(msgDiv, pageContent.firstChild);
    
    setTimeout(() => {
      msgDiv.remove();
    }, 3000);
  }
}
