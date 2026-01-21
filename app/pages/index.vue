<script setup lang="ts">
import CardFoto from '~/components/CardFoto.vue'

const username = useCookie<string | null>('username')

type Fotos = {
  id_foto: number
  id_user: number
  title_foto: string
  description_foto: string
  url_foto: string
  created_at: string
}

type GetFotoResponse = {
  status: number
  message: string
  foto: Fotos[]
}

type GetUserResponse = {
  status: number
  datas: {
    id_user: number
    username: string
  }
}

/* ================= STATE ================= */
const dataFotos = ref<Fotos[]>([])
const usernames = ref<Record<number, string>>({})
const token = ref<string | null>(null)
const dataFotoSelected = ref<Fotos>()

/* ================= API ================= */
const getFoto = async () => {
  const { data } = await useFetch<GetFotoResponse>(
    "/api/beranda/foto/get_foto",
    { server: false }
  )

  if (!data.value || data.value.status !== 200) return

  dataFotos.value = data.value.foto
  await fetchUsernames(data.value.foto)
}

const fetchUsernames = async (fotos: Fotos[]) => {
  const uniqueUserIds = [...new Set(fotos.map(f => f.id_user))]

  await Promise.all(
    uniqueUserIds.map(async (id_user) => {
      if (usernames.value[id_user]) return // cache

      const { data } = await useFetch<GetUserResponse>(
        `/api/user/${id_user}`,
        { server: false }
      )

      if (data.value?.status === 200) {
        usernames.value[id_user] = data.value.datas.username
      }
    })
  )
}

const getToken = async () => {
  const data = await $fetch<{ status: number, message: string, token: string }>(`/api/token/${username}`, {
    method: 'GET'
  })

  if(data.status !== 200){
    console.error('Gagal mendapatkan token')
    return
  }

  token.value = data.token
}

const onClickCardFoto = (dataFoto: Fotos) => {
  if(!token.value){
    useToastify("Silahkan login dulu", {
      type: "error",
      theme: "dark",
      position: "top-center"
    })

    useRouter().push('/auth/login')
    return
  }

  dataFotoSelected.value = dataFoto
}

/* ================= LIFECYCLE ================= */
watchEffect(async() => {
    await getFoto()
})

onMounted(async () => {
  await getToken()
})
</script>

<template>
  <div class="profile-page">
    <!-- HEADER -->
    <section class="profile-header">
      <h1 class="username">@ {{ username }}</h1>
      <p class="subtitle">Share GIF & meme-mu di sini!</p>
    </section>

    <!-- CONTENT -->
    <section class="content">
      <div v-if="dataFotos.length === 0" class="empty">
        Tidak ada foto
      </div>

      <div class="foto-grid">
        <div
          v-for="foto in dataFotos"
          :key="foto.id_foto"
          class="foto-card"
          @click="onClickCardFoto(foto)"
        >
          <img :src="foto.url_foto" :alt="foto.title_foto" />

          <div class="foto-info">
            <h3>{{ foto.title_foto }}</h3>
            <small>
              @{{ usernames[foto.id_user] || "loading..." }}
            </small>
          </div>
        </div>
      </div>
    </section>

    <CardFoto v-if="dataFotoSelected" :data-foto="dataFotoSelected" :token="token" @close="dataFotoSelected = undefined"/>
  </div>
</template>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: #0b0b16;
  color: white;
}

/* HEADER */
.profile-header {
  padding: 4rem 1rem 5rem;
  text-align: center;
  background: linear-gradient(
    135deg,
    #0b0822,
    #3a2c72,
    #5b3fa6
  );
}

.username {
  font-size: 3rem;
  font-weight: 800;
  color: #c89bff;
}

.subtitle {
  margin-top: 0.5rem;
  opacity: 0.85;
}

/* CONTENT */
.content {
  padding: 2rem;
  margin-top: -3rem;
}

.empty {
  text-align: center;
  opacity: 0.6;
}

/* GRID */
.foto-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.2rem;
}

.foto-card {
  background: #111;
  border-radius: 18px;
  overflow: hidden;
  transition: transform 0.2s ease;
}

.foto-card:hover {
  transform: translateY(-4px);
}

.foto-card img {
  width: 100%;
  height: 260px;
  object-fit: cover;
}

/* INFO */
.foto-info {
  padding: 0.8rem 1rem;
}

.foto-info h3 {
  font-size: 1rem;
  margin-bottom: 0.2rem;
}

.foto-info small {
  opacity: 0.7;
}
</style>
