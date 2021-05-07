<template>
  <v-card
    id="intro"
    class="elevation-12"
  >
    <v-card-text>
      <div class="px-8 py-5 body-1">
        <ul>
          <li>
            해당 실험 참여를 위해 반드시 ‘<b>Chrome</b>’을 사용해 주십시오.
          </li>
          <li>
            마이크 허용 알림창이 뜨면 ‘허용’을 선택해 주십시오.
          </li>
          <li>
            또한, 실험 중 녹음이 진행되므로 반드시 <b>소음이 없는 조용한 장소</b>에서 실험을 진행해주시기 바랍니다.
            <br /> (녹음 중 외부 소음이 들릴 경우, 실험대상에서 제외될 수 있습니다.)
          </li>
        </ul>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn
        block
        color="primary"
        :disabled="disabled"
        @click="goNextPage"
      >
        다음 {{ countDown > 0 ? `(${countDown})` : '' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  data: () => ({
    countDown: 7,
  }),

  computed: {
    disabled() {
      return this.countDown > 0;
    },
  },

  async mounted() {
    this.countDownTimer();

    // Ask microphone permission
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        console.log('You let me use your mic!', stream);
      })
      .catch((err) => {
        console.log('No mic for you!', err);
      });

    setTimeout(() => {
      this.initState();
    }, 800);
  },

  methods: {
    ...mapMutations([
      'initState',
    ]),

    countDownTimer() {
      if (this.countDown > 0) {
        setTimeout(() => {
          this.countDown -= 1;
          this.countDownTimer();
        }, 1000);
      }
    },

    goNextPage() {
      // this.$refs.speechToTextTest.endSpeechRecognition();
      this.$router.push({ name: 'terms' });
    },
  },
};
</script>
