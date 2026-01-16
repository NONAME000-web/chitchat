<!-- components/Navbar.vue -->
<template>
  <nav class="bottom-navbar">
    <div class="navbar-pill">
      <!-- Kiri: Beranda -->
      <NuxtLink to="/" class="nav-btn" :class="{ active: isHome }">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </NuxtLink>

      <!-- Tengah: Chitchat / Chat (ikon kotak bicara) -->
      <NuxtLink to="/chat" class="nav-btn central" :class="{ active: isFeed }">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </NuxtLink>

      <!-- Kanan: Profile -->
      <NuxtLink to="/profile" class="nav-btn" :class="{ active: isProfile }">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const isHome   = computed(() => route.path === '/' || route.path === '')
const isProfile = computed(() => route.path === '/profile')
const isFeed   = computed(() => route.path === '/feed' || route.path.startsWith('/feed/'))
</script>

<style scoped>
.bottom-navbar {
  position: fixed;
  bottom: 16px;
  left: 0;
  right: 0;
  z-index: 1000;
  pointer-events: none; /* agar tidak blok konten di belakang */
}

.navbar-pill {
  pointer-events: auto;
  width: max-content;
  margin: 0 auto;
  padding: 0 24px;
  height: 68px;
  background: rgba(20, 20, 40, 0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 9999px; /* sangat rounded = pill shape */
  border: 1px solid rgba(100, 100, 255, 0.18);
  box-shadow: 
    0 10px 30px rgba(0, 0, 0, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 48px; /* jarak antar ikon */
}

.nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  color: #a0a0c0;
  transition: all 0.25s ease;
  text-decoration: none;
}

.nav-btn:hover {
  color: #e0e0ff;
  background: rgba(100, 100, 255, 0.12);
}

.nav-btn.active {
  color: #c084fc;
  background: rgba(192, 132, 252, 0.18);
  box-shadow: 0 0 20px rgba(192, 132, 252, 0.35);
}

/* Ikon tengah lebih besar & punya efek glow */
.central {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #7c3aed, #d946ef);
  color: white;
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.5);
  transform: scale(1.15);
  margin: -6px 0; /* sedikit naik supaya lebih menonjol */
}

.central:hover {
  transform: scale(1.25);
  box-shadow: 0 12px 35px rgba(139, 92, 246, 0.7);
}

.nav-icon {
  width: 26px;
  height: 26px;
  stroke-width: 2.5;
}

/* Di layar sangat kecil, kurangi ukuran sedikit */
@media (max-width: 380px) {
  .navbar-pill {
    padding: 0 16px;
    height: 60px;
    gap: 32px;
  }
  .nav-btn {
    width: 42px;
    height: 42px;
  }
  .central {
    width: 52px;
    height: 52px;
  }
  .nav-icon {
    width: 22px;
    height: 22px;
  }
}
</style>