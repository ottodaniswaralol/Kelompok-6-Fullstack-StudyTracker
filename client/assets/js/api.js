// =============================================
// StudyTracker - API Helper
// Ganti BASE_URL dengan URL Railway kamu
// =============================================
const BASE_URL = 'https://studytracker-server-production.up.railway.app'; // GANTI INI

const api = {
  getToken: () => localStorage.getItem('st_token'),
  getUser: () => JSON.parse(localStorage.getItem('st_user') || 'null'),

  setAuth: (token, user) => {
    localStorage.setItem('st_token', token);
    localStorage.setItem('st_user', JSON.stringify(user));
  },

  clearAuth: () => {
    localStorage.removeItem('st_token');
    localStorage.removeItem('st_user');
  },

  isLoggedIn: () => !!localStorage.getItem('st_token'),

  headers: () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('st_token')}`
  }),

  fetch: async (endpoint, options = {}) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: api.headers()
    });
    const data = await res.json();
    if (res.status === 401 || res.status === 403) {
      api.clearAuth();
      window.location.href = 'login.html';
      return;
    }
    if (!res.ok) throw new Error(data.message || 'Terjadi kesalahan');
    return data;
  },

  // Auth
  login: (email, password) => fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  }).then(r => r.json()),

  register: (nama_lengkap, email, password) => fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nama_lengkap, email, password })
  }).then(r => r.json()),

  checkEmail: (email) => fetch(`${BASE_URL}/api/auth/check-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  }).then(r => r.json()),

  resetPassword: (email, new_password) => fetch(`${BASE_URL}/api/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, new_password })
  }).then(r => r.json()),

  // Tasks
  getTasks: (status) => api.fetch(`/api/tasks${status ? `?status=${status}` : ''}`),
  getDashboard: () => api.fetch('/api/tasks/dashboard'),
  createTask: (data) => api.fetch('/api/tasks', { method: 'POST', body: JSON.stringify(data) }),
  updateTaskStatus: (id, status) => api.fetch(`/api/tasks/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  deleteTask: (id) => api.fetch(`/api/tasks/${id}`, { method: 'DELETE' }),

  // Daily Plans
  getDailyPlans: (tanggal) => api.fetch(`/api/daily-plans${tanggal ? `?tanggal=${tanggal}` : ''}`),
  createPlan: (aktivitas) => api.fetch('/api/daily-plans', { method: 'POST', body: JSON.stringify({ aktivitas }) }),
  updatePlan: (id, is_done) => api.fetch(`/api/daily-plans/${id}`, { method: 'PATCH', body: JSON.stringify({ is_done }) }),
  deletePlan: (id) => api.fetch(`/api/daily-plans/${id}`, { method: 'DELETE' }),

  // Focus
  saveFocusSession: (data) => api.fetch('/api/focus', { method: 'POST', body: JSON.stringify(data) }),
  getFocusStats: () => api.fetch('/api/focus/stats'),

  // AI
  getAiRekomendasi: () => api.fetch('/api/ai/rekomendasi', { method: 'POST' }),
};

// Guard: redirect ke login jika belum login (kecuali di halaman auth)
const authPages = ['login.html', 'register.html', 'forgot-password.html'];
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
if (!authPages.includes(currentPage) && !api.isLoggedIn()) {
  window.location.href = 'login.html';
}

// Isi nama user di header
function initUserHeader() {
  const user = api.getUser();
  if (!user) return;

  const initial = user.nama_lengkap ? user.nama_lengkap.charAt(0).toUpperCase() : 'U';
  document.querySelectorAll('.user-initial').forEach(el => el.textContent = initial);
  document.querySelectorAll('.user-name').forEach(el => el.textContent = user.nama_lengkap);

  // Cek notif (deadline dalam 24 jam)
  checkDeadlineNotif();
}

// Notifikasi deadline 24 jam
async function checkDeadlineNotif() {
  try {
    const tasks = await api.getTasks('pending');
    const now = new Date();
    const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const urgent = tasks.filter(t => {
      const dl = new Date(t.deadline);
      return dl >= now && dl <= in24h;
    });

    const notifBadge = document.getElementById('notif-badge');
    const notifCount = document.getElementById('notif-count');
    const notifList = document.getElementById('notif-list');

    if (urgent.length > 0 && notifBadge) {
      notifBadge.classList.remove('hidden');
      if (notifCount) notifCount.textContent = urgent.length;
    }

    if (notifList) {
      notifList.innerHTML = urgent.length === 0
        ? '<p class="text-sm text-gray-500 p-3">Tidak ada deadline dalam 24 jam.</p>'
        : urgent.map(t => `
          <div class="p-3 border-b border-gray-100 last:border-0">
            <p class="text-sm font-semibold text-gray-800">${t.judul}</p>
            <p class="text-xs text-red-500">⏰ Deadline: ${formatDeadline(t.deadline)}</p>
          </div>
        `).join('');
    }
  } catch (e) { /* silent */ }
}

// Format deadline ke bahasa manusia
function formatDeadline(isoString) {
  if (!isoString) return '-';
  // Parse as WIB (UTC+7) - tambahkan +07:00 kalau belum ada timezone info
  let dateStr = isoString;
  if (!isoString.includes('+') && !isoString.includes('Z')) {
    dateStr = isoString.replace(' ', 'T') + '+07:00';
  }
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = d - now;
  const diffH = Math.floor(diffMs / 3600000);
  const diffD = Math.floor(diffMs / 86400000);

  const timeOpts = { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' };
  const dateOpts = { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Jakarta' };

  if (diffMs < 0) return 'Sudah lewat';
  if (diffH < 24) return `${diffH} jam lagi (${d.toLocaleTimeString('id-ID', timeOpts)})`;
  if (diffD === 1) return `Besok, ${d.toLocaleTimeString('id-ID', timeOpts)}`;
  return d.toLocaleDateString('id-ID', dateOpts) + ', ' + d.toLocaleTimeString('id-ID', timeOpts);
}

function getPriorityClass(p) {
  return p === 'high' ? 'bg-red-100 text-red-700' :
         p === 'medium' ? 'bg-yellow-100 text-yellow-700' :
         'bg-green-100 text-green-700';
}

function getPriorityLabel(p) {
  return p === 'high' ? 'Tinggi' : p === 'medium' ? 'Sedang' : 'Rendah';
}

function showToast(msg, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium transition-all ${type === 'error' ? 'bg-red-500' : 'bg-indigo-600'}`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

window.api = api;
window.formatDeadline = formatDeadline;
window.getPriorityClass = getPriorityClass;
window.getPriorityLabel = getPriorityLabel;
window.showToast = showToast;
window.initUserHeader = initUserHeader;
