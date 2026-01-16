<script setup lang="ts">
import type CardFoto from '~/components/CardFoto.vue';
import FormUpload from '~/components/formUpload.vue'

type GetTokenResponse =
  | { status: 200; message: string; token: string }
  | { status: number; message: string; token: string }

type DatasFoto = {
  id_foto: number
  id_user: number
  title_foto: string
  description_foto: string
  url_foto: string
  created_at: string
}

type GetFotoResponse =
  | { status: 200; message: string; datas: DatasFoto[] }
  | { status: number; message: string; datas: DatasFoto[]}

const username = useCookie<string | null>('username')
const hasToken = ref<string | null>(null)
const isClosed = ref(true) //menutup formUpload
const fotos = ref<DatasFoto[]>([])
const loading = ref(false)
const hasSelectedData = ref<DatasFoto>()

/* Ambil token */
if (username.value) {
  const { data } = await useFetch<GetTokenResponse>(`/api/token/${username.value}`)
  if (data.value?.status === 200) {
    hasToken.value = data.value.token
  }
}

/* Ambil foto */
const getFotos = async () => {
  if (!hasToken.value || !username.value) return

  loading.value = true
  try {
    const { data } = await useFetch<GetFotoResponse>(
      `/api/media/foto/${username.value}`,
      {
        headers: {
          Authorization: hasToken.value
        }
      }
    )

    if (data.value?.status === 200) {
      fotos.value = data.value.datas
    }
  } catch {
    useToastify("Gagal memuat foto", {
      type: "error",
      theme: "dark",
      position: "top-center"
    })
  } finally {
    loading.value = false
  }
}

watchEffect(async() => {
    if(hasToken) await getFotos()
})

const openFormUpload = async () => isClosed.value = false
const closeFormUpload = () => isClosed.value = true
const onUploadSuccess = async () => isClosed.value = true
const onClickCardFoto = async (foto: DatasFoto) => hasSelectedData.value = foto
</script>

<template>
  <div class="profile-container">

    <!-- ================= LOGIN STATE ================= -->
    <div v-if="!username || !hasToken" class="auth-prompt">
      <h1>Mohon login terlebih dahulu</h1>
      <NuxtLink to="/auth/login" class="login-link">
        Masuk
      </NuxtLink>
    </div>

    <!-- ================= PROFILE ================= -->
    <div v-else class="profile-content">

      <div class="profile-header">
        <h1>@{{ username }}</h1>
        <p>Share GIF & meme-mu di sini!</p>
      </div>

      <!-- FAB -->
      <button class="fab" @click="openFormUpload">+</button>

      <!-- CONTENT -->
      <div v-if="loading" class="loading">
        Memuat postingan...
      </div>

      <div v-else-if="fotos.length === 0" class="empty-state">
        <p>Belum ada postingan. Yuk upload yang pertama!</p>
      </div>

      <div v-else class="posts-grid">
        <div
          v-for="foto in fotos"
          :key="foto.id_foto"
          class="post-card"
          @click="onClickCardFoto(foto)"
        >
          <img
            :src="foto.url_foto"
            :alt="foto.title_foto"
            class="post-img"
            loading="lazy"
          />
          <div class="post-overlay">
            <div class="post-info">
              <h3>{{ foto.title_foto || 'Tanpa judul' }}</h3>
              <p>{{ foto.description_foto || '' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- MODAL //-->
      <FormUpload
        v-show="!isClosed"
        @close="closeFormUpload"
        @uploaded="onUploadSuccess"
      />

      <CardFoto v-if="hasSelectedData" :data-foto="hasSelectedData" :token="hasToken" @close="hasSelectedData = undefined"/>
    </div>
  </div>
</template>

<style scoped>
/* STYLE KAMU TETAP DIPAKAI */
.profile-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
  padding: 2rem 1rem;
  color: white;
}

.auth-prompt {
  text-align: center;
  padding: 6rem 1rem;
}

.login-link {
  display: inline-block;
  margin-top: 1.5rem;
  padding: 0.8rem 2rem;
  background: linear-gradient(90deg, #6366f1, #a855f7);
  border-radius: 12px;
  text-decoration: none;
  color: white;
  font-weight: 600;
}

.profile-header {
  text-align: center;
  margin-bottom: 2rem;
}

.profile-header h1 {
  font-size: 2.8rem;
  background: linear-gradient(90deg, #a78bfa, #c084fc, #f472b6);
  -webkit-background-clip: text;
  background-clip: null;
  -webkit-text-fill-color: transparent;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.post-card {
  position: relative;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  border-radius: 12px;
}

.post-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  opacity: 0;
  transition: 0.3s;
  display: flex;
  align-items: flex-end;
  padding: 1rem;
}

.post-card:hover .post-overlay {
  opacity: 1;
}

.fab {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  font-size: 2rem;
}
</style>