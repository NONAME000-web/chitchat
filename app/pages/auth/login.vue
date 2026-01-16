<script setup lang="ts">

type LoginResponse = 
  | { status: 200; message: string; datas: { username: string } }
  | { status: number; message: string }

const datas = ref({
  username: "",
  password: ""
})

const router = useRouter()
const loading = ref(false)

const submitForm = async () => {
  if (loading.value) return
  loading.value = true

  try {
    const { data: resultLogin } = await useFetch<LoginResponse>('/api/user/login_user', {
      method: "POST",
      body: datas.value,
      lazy: true
    })

    // Reset form segera setelah request (seperti kode asli)
    datas.value = { username: "", password: "" }

    if (!resultLogin.value) {
      useToastify("Tidak ada respon dari server", { type: "error", theme: "dark", position: "top-center" })
      return
    }

    useToastify(resultLogin.value.message, {
      type: resultLogin.value.status === 200 ? "success" : "error",
      theme: "dark",
      position: "top-center"
    })

    if (resultLogin.value.status !== 200) return

    if ("datas" in resultLogin.value) {
      const username = resultLogin.value.datas.username
      useCookie("username", { maxAge: 3600 * 24 * 7, secure: true}).value = username  // 7 hari lebih aman daripada 1 jam
    }

    router.push({ path: "/" })
  } catch (err) {
    useToastify("Gagal terhubung ke server", { type: "error", theme: "dark", position: "top-center" })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="page-container">
    <div class="card">
      <div class="header">
        <h1 class="logo">ChitChat</h1>
        <p class="tagline">Share Your Memes and let's have a chitchat</p>
      </div>

      <form @submit.prevent="submitForm" class="form">
        <div class="form-group">
          <label>Username</label>
          <input
            type="text"
            placeholder="coolmeme420"
            required
            v-model="datas.username"
          />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            required
            v-model="datas.password"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="submit-btn"
        >
          <span v-if="loading">Memproses...</span>
          <span v-else>Masuk</span>
          <svg v-if="!loading" class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        <p class="register-link">
          Belum punya akun? 
          <router-link to="/auth/register">Daftar di sini</router-link>
        </p>
      </form>
    </div>

    <!-- Background decoration -->
    <div class="bg-blob blob1"></div>
    <div class="bg-blob blob2"></div>
  </div>
</template>

<style scoped>
.page-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
}

.card {
  width: 100%;
  max-width: 420px;
  background: rgba(30, 30, 60, 0.65);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(100, 100, 255, 0.18);
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5),
              0 0 30px rgba(79, 70, 229, 0.15);
  overflow: hidden;
}

.header {
  text-align: center;
  padding: 2.8rem 2rem 1.5rem;
}

.logo {
  margin: 0;
  font-size: 3.2rem;
  font-weight: 800;
  background: linear-gradient(90deg, #a78bfa, #c084fc, #f472b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.tagline {
  margin: 0.8rem 0 0;
  color: #d1d5db;
  font-size: 1.15rem;
  font-weight: 300;
  letter-spacing: 0.5px;
}

.form {
  padding: 0 2rem 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #d1d5db;
  font-size: 0.95rem;
  font-weight: 500;
}

.form-group input {
  padding: 1rem 1.2rem;
  background: rgba(20, 20, 40, 0.7);
  border: 1px solid rgba(100, 116, 139, 0.6);
  border-radius: 10px;
  color: white;
  font-size: 1rem;
  transition: all 0.25s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.25);
}

.submit-btn {
  margin-top: 0.5rem;
  padding: 1.15rem;
  background: linear-gradient(90deg, #6366f1, #a855f7);
  color: white;
  font-size: 1.05rem;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  transition: all 0.3s ease;
  box-shadow: 0 10px 25px rgba(99, 102, 241, 0.35);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 15px 35px rgba(99, 102, 241, 0.45);
  background: linear-gradient(90deg, #4f46e5, #9333ea);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.arrow {
  width: 20px;
  height: 20px;
}

.register-link {
  text-align: center;
  color: #9ca3af;
  font-size: 0.95rem;
  margin: 1rem 0 0;
}

.register-link a {
  color: #a78bfa;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.register-link a:hover {
  color: #c4b5fd;
  text-decoration: underline;
}

/* Background blobs */
.bg-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.18;
  pointer-events: none;
  z-index: 0;
}

.blob1 {
  width: 500px;
  height: 500px;
  background: #8b5cf6;
  top: -150px;
  right: -150px;
}

.blob2 {
  width: 450px;
  height: 450px;
  background: #6366f1;
  bottom: -120px;
  left: -120px;
}
</style>