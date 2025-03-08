<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title class="text-center text-h5">채팅
          </v-card-title>
          <v-card-text>
            <div class="chat-box">
              <div v-for="(msg, index) in  messages" :key="index">
                {{ msg }}
              </div>
            </div>
            <v-text-field
                v-model="newMessage"
                label="메세지 입력"
                @keyup.enter="sendMessage"
            />
            <v-btn color="primary" block @click="sendMessage">전송</v-btn>
          </v-card-text>

        </v-card>
      </v-col>

    </v-row>
  </v-container>
</template>

<script>
import SockJs from "sockjs-client";
import Stomp from "webstomp-client";
// import axios from "axios";

export default {
  data() {
    return {
      // ws: null,
      messages: [],
      newMessage: "",
      stompClient: null,
    }
  },
  created() {
    this.connectWebSocket();
  },
  beforeUnmount() {
    this.disconnectWebSocket();
  },
  methods: {
    connectWebSocket() {
      const sockJs = new SockJs(`${process.env.VUE_APP_API_BASE_URL}/connect`);
      this.stompClient = Stomp.over(sockJs);

      this.stompClient.connect({},
          () => {
            this.stompClient.subscribe(`/topic/1`, (message) => {
                  console.log(message)
                  this.messages.push(message.body);
                  this.scrollTOBottom();
                }
            )
          }
      )
    },
    sendMessage() {
      if (this.newMessage.trim() === "") return;
      this.stompClient.send(`/publish/1`, this.newMessage);
      this.newMessage = "";
    },
    scrollTOBottom() {
      this.$nextTick(() => {
        const chatBox = this.$el.querySelector(".chat-box");
        chatBox.scrollTop = chatBox.scrollHeight;
      })
    },
    disconnectWebSocket() {
      if (this.stompClient) {
        this.stompClient.disconnect(() => {
          console.log("STOMP client disconnected");
        });
      }
    },
  }
}
</script>

<style>

.chat-box {
  height: 300px;
  overflow-y: auto;
  border: 1px solid #ddd;
  margin-bottom: 10px;
}

</style>