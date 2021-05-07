<template>
  <v-card
    id="submit"
    class="elevation-12"
  >
    <AudioDisplay
      :show="isPlaying"
    />
    <v-card-text
      v-if="!isPlaying"
    >
      <div class="px-8 py-5 body-1">
        <div class="text-center">
          훈련을 마치셨습니다.
        </div>
        <div class="text-center">
          설문지를 작성하셔야 모든 실험이 완료됩니다.
        </div>
        <div class="text-center">
          ‘설문하러 가기’ 버튼을 누르시면 설문 페이지로 연결됩니다.
        </div>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn
        v-if="!isPlaying"
        block
        color="primary"
        :loading="isSending"
        @click="goSurvey"
      >
        설문하러 가기 {{ countDown > 0 ? `(${countDown})` : '' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from 'axios';
import AudioDisplay from './components/AudioDisplay2.vue';

export default {

  components: {
    AudioDisplay,
  },
  data: () => ({
    isPlaying: false,
    isSubmitted: false,
    isSending: false,
    countDown: 5,
  }),

  computed: {
    condition() {
      return this.$store.state.data.experimentType;
    },
  },

  async mounted() {
    this.playAudio();
    this.submitData();
    this.countDownTimer();

    setTimeout(() => {
      // this.goSurvey();
      // if (!this.isSending) {
      //   const url = 'https://docs.google.com/forms/d/e/1FAIpQLScJc0mV0mqJBh-TYiXZb4jDbsMf-exUKO3yJieu-zunOv3tUQ/viewform';
      //   window.location = url;
      // }
    }, this.countDown * 1000);
  },

  methods: {
    async submitData() {
      this.isSending = true;

      const data = this.$store.getters.getSubmitData;
      console.log(data, this.$store);
      const json = JSON.stringify(data);
      const fdata = new FormData();
      fdata.append('data', json);

      try {
        const url = 'https://api.l2-learning.site/results';
        // if (process.env.NODE_ENV === 'development') {
        //   url = 'http://localhost:3000/result';
        // }

        const response = await axios.post(
          url,
          fdata,
        );
        console.log(response);
      } catch (err) {
        console.log(err);
      } finally {
        this.isSending = false;
      }
    },

    playAudio() {
      const audio = document.getElementById('5.설문');

      this.isPlaying = true;
      audio.play();
      audio.onended = () => {
        this.isPlaying = false;
      };
    },

    goSurvey() {
      if (this.condition === '원어민') {
        window.open('https://forms.gle/EYgckr472vmc6erq5');
      } else if (this.condition === '내목소리') {
        window.open('https://forms.gle/7rwFfEoo1akJTxzx9');
      } else if (this.condition === '다른사람') {
        window.open('https://forms.gle/cqB84GQULN6eCDf57');
      }
    },

    countDownTimer() {
      if (this.countDown > 0) {
        setTimeout(() => {
          this.countDown -= 1;
          this.countDownTimer();
        }, 1000);
      }
    },
  },
};
</script>
