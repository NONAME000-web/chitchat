<script setup lang="ts">
  type GetTokenResponse = {status: number, message: string, token: string} 
    | {status: number, message: string, token: undefined}

const emit = defineEmits(['close', 'uploaded'])

const foto = ref<File | null>(null)
const previewUrl = ref<string | null>(null)
const isUploading = ref(false)
const errorMsg = ref<string | null>(null)
const Username = useCookie("username").value

const datas = ref({
  title: "",
  description: "",
  Username: Username || ""
})

const fileInput = ref<HTMLInputElement | null>(null)
const token = ref<string | undefined>(undefined)

// Preview saat file dipilih
const onFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input.files?.[0]) {
    const file = input.files[0]
    if (!file.type.startsWith('image/')) {
      errorMsg.value = "Hanya file gambar atau GIF yang diperbolehkan"
      useToastify(errorMsg.value, { type: "error", theme: "dark" })
      return
    }
    foto.value = file
    previewUrl.value = URL.createObjectURL(file)
    errorMsg.value = null
  }
}

// Submit ke API (sesuaikan endpoint dengan backend kamu)
const submitForm = async () => {
  if (!foto.value || !datas.value.title.trim() || !Username) {
    useToastify("Lengkapi semua field dan pilih file", { type: "error", theme: "dark" })
    return
  }

  const {data: resultGetToken} = await useFetch<GetTokenResponse>(`/api/token/${Username}`, {
    method: "GET"
  })

  if(resultGetToken.value?.status !== 200) {
    useToastify(resultGetToken.value?.message, {type: "error", theme: "dark"})
    return
  }

  token.value = resultGetToken.value.token

  isUploading.value = true
  errorMsg.value = null

  try {
    const formData = new FormData()
    formData.append('file', foto.value)
    formData.append('title', datas.value.title)
    formData.append('description', datas.value.description)
    formData.append('username', Username)

    const { data, error } = await useFetch('/api/upload-media/foto', {
      method: 'POST',
      headers: {
        Authorization: `${token.value}`
      },
      body: formData
    })

    if (error.value) throw error.value

    useToastify(data.value?.message, { type: data.value?.status === 200 ? "success" : "error", 
    theme: "dark", position: "top-center" })

    // Reset form
    foto.value = null
    previewUrl.value = null
    datas.value.title = ""
    datas.value.description = ""
    
    // Emit event ke parent (profile) agar bisa refresh list post
    emit('uploaded')
    emit('close')
    
  } catch (err: any) {
    errorMsg.value = err.message || "Gagal upload, coba lagi"
    useToastify(errorMsg.value, { type: "error", theme: "dark" })
  } finally {
    isUploading.value = false
  }
}

// Cleanup preview URL saat modal ditutup
onUnmounted(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
})
</script>

<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="upload-modal">
      <div class="modal-header">
        <h2>Upload GIF / Foto</h2>
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>

      <div class="upload-area" @click="fileInput?.click()">
        <input
          ref="fileInput"
          type="file"
          accept="image/*,.gif"
          hidden
          @change="onFileChange"
        />

        <div v-if="previewUrl" class="preview-container">
          <img :src="previewUrl" alt="Preview" class="preview-img" />
          <div class="preview-overlay">
            <span>Ganti file</span>
          </div>
        </div>

        <div v-else class="placeholder">
          <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <p>Klik untuk pilih GIF atau Foto</p>
          <small>JPG, PNG, GIF • Maks 10MB</small>
        </div>
      </div>

      <div class="form-fields">
        <div class="input-group">
          <label>Caption</label>
          <input
            type="text"
            placeholder="Judul atau caption keren..."
            v-model="datas.title"
            required
          />
        </div>

        <div class="input-group">
          <label>Deskripsi</label>
          <textarea
            placeholder="Ceritain tentang meme ini..."
            v-model="datas.description"
            rows="3"
          ></textarea>
        </div>
      </div>

      <div v-if="errorMsg" class="error-message">{{ errorMsg }}</div>

      <div class="modal-actions">
        <button class="cancel-btn" @click="$emit('close')" :disabled="isUploading">
          Batal
        </button>
        <button
          class="submit-btn"
          @click="submitForm"
          :disabled="isUploading || !foto || !datas.title.trim()"
        >
          {{ isUploading ? 'Mengupload...' : 'Upload' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.upload-modal {
  background: rgba(30, 30, 60, 0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(139, 92, 246, 0.25);
  border-radius: 20px;
  width: 90%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7);
  color: white;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 1.5rem;
  border-bottom: 1px solid rgba(100, 100, 255, 0.15);
}

.modal-header h2 {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: #a0a0c0;
  font-size: 1.8rem;
  cursor: pointer;
  line-height: 1;
}

.close-btn:hover {
  color: white;
}

.upload-area {
  padding: 2rem 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: background 0.2s;
}

.upload-area:hover {
  background: rgba(139, 92, 246, 0.08);
}

.preview-container {
  position: relative;
  margin: 0 auto;
  max-width: 100%;
}

.preview-img {
  max-height: 320px;
  border-radius: 12px;
  object-fit: contain;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
}

.preview-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
  border-radius: 12px;
}

.preview-container:hover .preview-overlay {
  opacity: 1;
}

.preview-overlay span {
  color: white;
  font-weight: 600;
  background: rgba(0, 0, 0, 0.6);
  padding: 0.5rem 1rem;
  border-radius: 8px;
}

.placeholder {
  padding: 3rem 1rem;
  border: 2px dashed rgba(139, 92, 246, 0.4);
  border-radius: 16px;
  background: rgba(20, 20, 40, 0.4);
}

.upload-icon {
  width: 60px;
  height: 60px;
  margin-bottom: 1rem;
  stroke: #a78bfa;
}

.placeholder p {
  margin: 0.5rem 0;
  font-size: 1.1rem;
}

.placeholder small {
  color: #9ca3af;
}

.form-fields {
  padding: 0 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group label {
  color: #d1d5db;
  font-weight: 500;
  font-size: 0.95rem;
}

.input-group input,
.input-group textarea {
  padding: 0.9rem 1.1rem;
  background: rgba(20, 20, 40, 0.7);
  border: 1px solid rgba(100, 116, 139, 0.5);
  border-radius: 10px;
  color: white;
  font-size: 1rem;
  transition: all 0.2s;
}

.input-group input:focus,
.input-group textarea:focus {
  outline: none;
  border-color: #a78bfa;
  box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.2);
}

.input-group textarea {
  resize: vertical;
  min-height: 80px;
}

.error-message {
  color: #f87171;
  text-align: center;
  padding: 0 1.5rem;
  font-size: 0.9rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(100, 100, 255, 0.15);
  justify-content: flex-end;
}

.cancel-btn,
.submit-btn {
  padding: 0.8rem 1.6rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn {
  background: rgba(255, 255, 255, 0.08);
  color: white;
}

.cancel-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

.submit-btn {
  background: linear-gradient(90deg, #7c3aed, #d946ef);
  color: white;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(139, 92, 246, 0.4);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>