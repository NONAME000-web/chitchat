<script setup lang="ts">
import { createClient } from '@supabase/supabase-js';

type Room = {
    id_room: number;
    room_name: string;
    username: string;
}

    const room_name = ref('')
    const username = useCookie('username').value
    const supabase = createClient(
        useRuntimeConfig().public.supabase_URL,
        useRuntimeConfig().public.supabase_Key
    )
    const rooms = ref<Room[] | []>([])
    // const hasToken = ref('')

    const getToken = async () => {
        const data = await $fetch<{status: number, message: string, token: string}>(`/api/token/${username}`, {
            method: 'GET'
        })

        if(data.status !== 200){
            useToastify("Login terlebih dahulu", {
                type: "error",
                position: "top-center",
                theme: "dark"
            })

            navigateTo('/auth/login')

            return
        }

        return true
        // hasToken.value = data.token
    }

    const submitCreateRoom = async () => {
        if(room_name.value === '') return;
        if(!username) return;

        try {
            const { error } = await supabase
                .schema('chitchat')
                .from('room_chat')
                .insert({
                    room_name: room_name.value,
                    username: username
                })    
            
            if(error) 
                console.log(error)
            else{
                room_name.value = ''

                console.log('Room created successfully')
            }
        } catch (error) {
            console.log(error)
        }
    }

    const fetchRooms = async () => {
        try {
            const {data, error} = await supabase
                .schema('chitchat')
                .from('room_chat')
                .select('*')
                .order('id_room', { ascending: true })
            
            if(error){
                console.log(error)
                return
            }

            rooms.value = data
        } catch (error) {
            console.log(error)
        }
    }

    const onClickRoom = (room: Room) => {
        console.log('Clicked room:', room)
        navigateTo(`/chat/room/${room.id_room}`)
    }

    let channel: any

    onMounted(async() => {
        await fetchRooms()

        await getToken()

        channel = supabase
            .channel('public:chitchat:room_chat')
            .on(
                'postgres_changes',
                { event: '*', schema: 'chitchat', table: 'room_chat' },
                async (payload) => {
                    console.log('Change received!', payload)
                    await fetchRooms()
                }
            )
            .subscribe()
    })

    onUnmounted(() => {
        if(channel){
            supabase.removeChannel(channel)
        }
    })
</script>

<template>
  <div class="room-page">

    <!-- HEADER -->
    <section class="room-header">
      <h1>💬 ChitChat Rooms</h1>
      <p>Buat atau gabung room obrolan</p>
    </section>

    <!-- CREATE ROOM -->
    <section class="card create-room">
      <h2>Buat Room</h2>

      <form class="form" @submit.prevent="submitCreateRoom">
        <input
          v-model="room_name"
          type="text"
          placeholder="Nama room..."
          class="input"
        />

        <button
          class="btn"
          type="submit"
          :disabled="!room_name"
        >
          Create
        </button>
      </form>
    </section>

    <!-- ROOM LIST -->
    <section class="card room-list">
      <h2>Available Rooms</h2>

      <div v-if="rooms.length === 0" class="empty">
        Belum ada room 😴
      </div>

      <ul v-else>
        <li
          v-for="room in rooms"
          :key="room.id_room"
          class="room-item"
          @click="onClickRoom(room)"
        >
          <div class="room-info">
            <span class="room-name">{{ room.room_name }}</span>
            <small class="room-owner">@{{ room.username }}</small>
          </div>

          <span v-show="room.username !== username" class="join">Join →</span>
        </li>
      </ul>
    </section>

  </div>
</template>

<style scoped>
.room-page {
  min-height: 100vh;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
  color: white;
}

/* HEADER */
.room-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.room-header h1 {
  font-size: 2.6rem;
  font-weight: 800;
  background: linear-gradient(90deg, #a78bfa, #c084fc, #f472b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.room-header p {
  opacity: 0.8;
  margin-top: 0.4rem;
}

/* CARD */
.card {
  max-width: 720px;
  margin: 0 auto 1.5rem;
  background: rgba(15, 15, 35, 0.85);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 18px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
}

.card h2 {
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

/* FORM */
.form {
  display: flex;
  gap: 0.75rem;
}

.input {
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border: 1px solid #4c1d95;
  background: #0f0f2a;
  color: white;
  outline: none;
}

.input::placeholder {
  opacity: 0.6;
}

.input:focus {
  border-color: #a855f7;
}

/* BUTTON */
.btn {
  padding: 0.75rem 1.4rem;
  border-radius: 12px;
  background: linear-gradient(90deg, #6366f1, #a855f7);
  border: none;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: 0.25s;
}

.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* ROOM LIST */
.room-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.room-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.9rem 1rem;
  border-radius: 14px;
  background: #0f0f2a;
  border: 1px solid rgba(255,255,255,0.05);
  cursor: pointer;
  transition: 0.25s;
  margin-bottom: 0.6rem;
}

.room-item:hover {
  background: #1e1b4b;
  transform: translateY(-2px);
}

.room-info {
  display: flex;
  flex-direction: column;
}

.room-name {
  font-weight: 600;
}

.room-owner {
  font-size: 0.75rem;
  opacity: 0.6;
}

.join {
  font-size: 0.85rem;
  opacity: 0.8;
}

/* EMPTY */
.empty {
  text-align: center;
  opacity: 0.6;
  padding: 1rem;
}
</style>