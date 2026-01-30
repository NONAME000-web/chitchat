<script setup lang="ts">
import { createClient } from '@supabase/supabase-js'

type Message = {
  id_chat: number
  id_room: string
  chat: string
  username: string
  created_at: Date
}

const route = useRoute()
const roomId = route.params.id as string
const username = useCookie<string | null>('username')

const supabase = createClient(
  useRuntimeConfig().public.supabase_URL,
  useRuntimeConfig().public.supabase_Key
)

const message = ref('')
const allMessages = ref<Message[]>([])
const messagesEndRef = ref<HTMLElement | null>(null)

/* ================= SEND ================= */
const sendMessage = async () => {
  if (!username.value || !message.value.trim()) return

  const { error } = await supabase
    .schema('chitchat')
    .from('chat')
    .insert({
      id_room: roomId,
      chat: message.value,
      username: username.value,
      created_at: new Date().toISOString()
    })

  if (!error) message.value = ''
}

/* ================= FETCH ================= */
const fetchMessages = async () => {
  const { data } = await supabase
    .schema('chitchat')
    .from('chat')
    .select('*')
    .eq('id_room', roomId)
    .order('created_at', { ascending: true })

  if (data) {
    allMessages.value = data
    scrollToBottom()
  }
}

/* ================= SCROLL ================= */
const scrollToBottom = () => {
  nextTick(() => {
    messagesEndRef.value?.scrollIntoView({ behavior: 'smooth' })
  })
}

/* ================= REALTIME ================= */
let channel: any

onMounted(async () => {
  await fetchMessages()

  channel = supabase
    .channel(`room-${roomId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'chitchat',
        table: 'chat',
        filter: `id_room=eq.${roomId}`
      },
      (payload) => {
        allMessages.value.push(payload.new as Message)
        scrollToBottom()
      }
    )
    .subscribe()
})

onUnmounted(() => {
  if (channel) supabase.removeChannel(channel)
})
</script>

<template>
  <div class="chat-page">

    <!-- HEADER -->
    <header class="chat-header">
      <button class="back" @click="navigateTo('/')">←</button>
      <div>
        <h2>Room #{{ roomId }}</h2>
        <small>Realtime Chat</small>
      </div>
    </header>

    <!-- CHAT BODY -->
    <main class="chat-body">
      <div
        v-for="msg in allMessages"
        :key="msg.id_chat"
        class="bubble"
        :class="{ me: msg.username === username }"
      >
        <span class="user">{{ msg.username }}</span>
        <p>{{ msg.chat }}</p>
        <small class="time">
          {{ new Date(msg.created_at).toLocaleTimeString() }}
        </small>
      </div>

      <div ref="messagesEndRef"></div>

      <div v-if="allMessages.length === 0" class="empty">
        Belum ada pesan 💭
      </div>
    </main>

    <!-- INPUT -->
    <form class="chat-input" @submit.prevent="sendMessage">
      <input
        v-model="message"
        type="text"
        placeholder="Ketik pesan..."
      />
      <button type="submit">➤</button>
    </form>

  </div>
</template>

<style scoped>
.chat-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding-bottom: 72px; /* tinggi navbar */
  background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
  color: white;
}

/* HEADER */
.chat-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(0,0,0,0.3);
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.chat-header h2 {
  font-size: 1.2rem;
}

.back {
  background: none;
  border: none;
  color: #a78bfa;
  font-size: 1.4rem;
  cursor: pointer;
}

/* BODY */
.chat-body {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
}

/* BUBBLE */
.bubble {
  max-width: 70%;
  margin-bottom: 0.8rem;
  padding: 0.6rem 0.8rem;
  border-radius: 14px;
  background: #1e1b4b;
}

.bubble.me {
  margin-left: auto;
  background: linear-gradient(135deg, #6366f1, #a855f7);
}

.user {
  font-size: 0.7rem;
  opacity: 0.7;
}

.time {
  font-size: 0.65rem;
  opacity: 0.5;
  display: block;
  margin-top: 0.2rem;
}

/* INPUT */
.chat-input {
  position: sticky;
  bottom: 72px; /* sejajar di atas navbar */
  display: flex;
  padding: 0.8rem;
  gap: 0.6rem;
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(8px);
}

.chat-input input {
  flex: 1;
  padding: 0.7rem 1rem;
  border-radius: 999px;
  border: none;
  background: #0f0f2a;
  color: white;
  outline: none;
}

.chat-input button {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(90deg, #6366f1, #a855f7);
  color: white;
  cursor: pointer;
}

/* EMPTY */
.empty {
  text-align: center;
  opacity: 0.6;
  margin-top: 2rem;
}
</style>