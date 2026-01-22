<script setup lang="ts">

/* ================= TYPES ================= */
type DatasFoto = {
  id_foto: number
  id_user: number
  title_foto: string
  description_foto: string
  url_foto: string
  created_at: string
}

type CommentData = {
  username: string
  comment: string
  created_at: string
}

type GetCommentResponse = { status: number; message: string; datas: CommentData[] } | null

/* ================= PROPS & EMIT ================= */
const props = defineProps<{
  dataFoto: DatasFoto
  token: string | null
}>()

const emit = defineEmits<{
  (e: "close"): void
}>()

/* ================= STATE ================= */
const username = useCookie("username").value
const isSubmiting = ref(false)
const index = ref(0)

const datasComment = ref({
  id_foto: props.dataFoto.id_foto,
  username: username,
  comment: ""
})

// ================ UseAsyncData GetComment =========
const {data: comment, refresh, pending} = await useAsyncData('get-comments',
  () => $fetch<GetCommentResponse>(`/api/comment/${props.dataFoto.id_foto}`, {
    method: "GET"
  }))

/* ================= API ================= */

const submitComment = async () => {
  if (isSubmiting.value) return
  if (!props.token) return

  isSubmiting.value = true

  try {
    if (!datasComment.value.comment.trim()) {
      useToastify("Isi komennya dulu yak!", {
        type: "warning",
        theme: "dark",
        position: "top-center"
      })
      return
    }

    const result = await $fetch<{ status: number; message: string }>(
      "/api/comment/post_comment",
      {
        method: "POST",
        headers: {
          Authorization: props.token
        },
        body: {
          id_foto: datasComment.value.id_foto,
          username: datasComment.value.username,
          comment: datasComment.value.comment
        }
      }
    )

    useToastify(result.message, {
      type: result.status === 200 ? "success" : "error",
      theme: "dark",
      position: "top-center"
    })

    datasComment.value.comment = ""

    await refresh()
  } catch (err) {
    console.error(err)
  } finally {
    isSubmiting.value = false

    index.value = 0
  }
}

</script>

<template>
  <!-- OVERLAY -->
  <div class="overlay" @click.self="emit('close')">
    <!-- MODAL -->
    <div class="modal">
      <button class="close-btn" @click="emit('close')">✕</button>

      <!-- FOTO -->
      <div class="foto-wrapper">
        <img
          :src="props.dataFoto.url_foto"
          :alt="props.dataFoto.title_foto"
        />
      </div>

      <!-- INFO -->
      <div class="info-wrapper">
        <h2 class="title">
          {{ props.dataFoto.title_foto || "Tanpa Judul" }}
        </h2>

        <p class="description">
          {{ props.dataFoto.description_foto || "Tidak ada deskripsi" }}
        </p>

        <div class="meta">
          Diposting:
          {{ new Date(props.dataFoto.created_at).toLocaleString("sv-SE") }}
        </div>
      </div>

      <!-- COMMENT -->
      <div class="comment-wrapper">
        <form class="comment-form" @submit.prevent="submitComment">
          <input
            v-model="datasComment.comment"
            placeholder="Tulis komentar..."
          />
          <button type="submit">Kirim</button>
        </form>

        <div v-if="pending" class="comment-loading">
          Memuat komentar...
        </div>

        <div v-else-if="comment?.status !== 200" class="comment-empty">
          Belum ada komentar
        </div>

        <div class="comment-list">
          <div
            v-for="(c, i) in comment?.datas"
            :key="i"
            class="comment-item"
          >
            <strong>@{{ c.username }}</strong>
            <p>{{ c.comment }}</p>
            <small>
              {{ new Date(c.created_at).toLocaleString("sv-SE") }}
            </small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ================= OVERLAY ================= */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 12, 41, 0.85);
  backdrop-filter: blur(6px);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* ================= MODAL ================= */
.modal {
  background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
  width: 95%;
  max-width: 900px;
  max-height: 95vh;
  border-radius: 18px;
  padding: 1.5rem;
  overflow-y: auto;
  color: white;
  position: relative;
  animation: fadeUp 0.25s ease;
}

/* CLOSE */
.close-btn {
  position: absolute;
  top: 14px;
  right: 16px;
  font-size: 1.4rem;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
}

/* ================= FOTO ================= */
.foto-wrapper {
  display: flex;
  justify-content: center;
  background: black;
  border-radius: 14px;
  overflow: hidden;
}

.foto-wrapper img {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
}

/* ================= INFO ================= */
.info-wrapper {
  margin-top: 1.2rem;
}

.title {
  font-size: 2rem;
  font-weight: 700;
}

.description {
  margin-top: 0.8rem;
  line-height: 1.6;
  opacity: 0.9;
}

.meta {
  margin-top: 0.8rem;
  font-size: 0.85rem;
  opacity: 0.7;
}

/* ================= COMMENT ================= */
.comment-wrapper {
  margin-top: 1.5rem;
}

.comment-form {
  display: flex;
  gap: 0.6rem;
}

.comment-form input {
  flex: 1;
  padding: 0.7rem 1rem;
  border-radius: 10px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.comment-form button {
  padding: 0.7rem 1.2rem;
  border-radius: 10px;
  border: none;
  background: linear-gradient(90deg, #7c3aed, #d946ef);
  color: white;
  font-weight: 600;
  cursor: pointer;
}

.comment-list {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;

  max-height: 260px;   /* ← WAJIB */
  overflow-y: auto;    /* ← WAJIB */
}

.comment-item {
  background: rgba(0, 0, 0, 0.35);
  padding: 0.7rem 1rem;
  border-radius: 12px;
}

.comment-item p {
  margin: 0.3rem 0;
}

.comment-item small {
  opacity: 0.6;
}

/* ================= ANIM ================= */
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
