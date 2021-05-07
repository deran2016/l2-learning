<template>
  <v-card class="elavation-12">
    <v-card-text>
      <div class="text-center">
        <h1>연습 녹음</h1>
        <br />
        <p>원어민 선생님의 발음을 듣고 직접 따라해보세요.</p>
        <br />
      </div>
    </v-card-text>
    <div>
      <AudioDisplay
        :show="isPlaying"
      />

      <div
        class="relative-right"
      >
        <v-btn
          icon
          :disabled="isPlaying"
          @click="reset"
        >
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
        다시 듣기
      </div>

      <div class="text-center">
        <p>마이크 버튼을 누르면 녹음이 시작되며, 버튼을 한 번 더 누르면 녹음이 완료됩니다.</p>
      </div>
    </div>
    <div
      class="body-1 d-flex justify-center mb-5"
    >
      <!-- Real recoder -->
      <VueRecordAudio
        v-if="!isPlaying"
        class="recorder"
        mode="press"
        @result="onResult"
      />

      <!-- Fake recoder -->
      <div
        v-else-if="isPlaying"
        class="audio-recorder"
      >
        <span></span>
      </div>
    </div>

    <div
      v-if="recFirst"
      class="relative-right"
    >
      <v-btn
        icon
        :disabled="isPlaying"
        @click="myRecPlay(url)"
      >
        <v-icon>mdi-arrow-right-drop-circle</v-icon>
      </v-btn>
      녹음재생
    </div>

    <v-card-text>
      <div class="text-center">
        <p>* 새로 녹음하려면 마이크 버튼을 다시 눌러주세요.</p>
      </div>
    </v-card-text>

    <v-card-actions>
      <v-btn
        block
        color="primary"
        :disabled="!nextBtn"
        @click="goNextPage"
      >
        다음
      </v-btn>
    </v-card-actions>
    <div>
      <audio
        :id="url"
        :src="url"
        preload="auto"
      >
        <p>Your browser does not support the <code>audio</code> element.</p>
      </audio>
    </div>
  </v-card>
</template>

<script>
import { mapMutations } from 'vuex';
import AudioDisplay from './components/AudioDisplay.vue';

export default {
  name: 'PreExperiment',

  components: {
    AudioDisplay,
  },

  data: () => ({
    file: '',
    recfile: '',
    isPlaying: false,
    next: false,
    nextBtn: false,
    url: '',
    step: 0,
    recFirst: false,
  }),

  computed: {
    devMode() {
      return process.env.NODE_ENV === 'development';
    },

    condition() {
      return this.$store.state.data.experimentType;
    },

    sex() {
      return this.$store.state.data.participantSex;
    },
  },

  mounted() {
    this.handler();
  },

  methods: {
    ...mapMutations([
      'updateFields',
    ]),

    handler() {
      if (this.step === 0) {
        this.playAudio('4-1-1.녹음절차 설명');
        this.step += 1;
      } else if (this.step === 1) {
        console.log(`연습용_${this.sex}_자동차`);
        this.playAudio(`연습용_${this.sex}_자동차`);
        this.step += 1;
      }
    },

    playAudio(file) {
      this.file = file;

      const audio = document.getElementById(this.file);

      this.isPlaying = true;
      audio.play();
      audio.onended = () => {
        this.isPlaying = false;
        if (this.step === 1) {
          this.handler();
        }
        if (this.next === true) {
          this.nextBtn = true;
        }
      };
    },

    playMyAudio(file) {
      this.recfile = file;

      const audio = document.getElementById(this.recfile);

      this.isPlaying = true;
      audio.play();
      audio.onended = () => {
        this.isPlaying = false;
        if (this.step === 1) {
          this.handler();
        }
        if (this.next === true) {
          this.nextBtn = true;
        }
      };
    },

    myRecPlay() {
      this.playMyAudio(this.url);
    },

    reset() {
      this.playAudio(`연습용_${this.sex}_자동차`);
    },

    onResult(data) {
      this.pushBlobUrl(data);
      if (!this.recFirst) {
        this.playAudio('4-1-2.녹음재생 설명');
        this.recFirst = true;
        this.next = true;
      }
    },

    pushBlobUrl(data) {
      const audioURL = URL.createObjectURL(data);
      this.url = audioURL;
    },

    goNextPage() {
      this.$router.push({ name: 'ex' });
    },
  },
};
</script>

<style lang="scss">
  .recorder {
    background-color: gray;
    &:hover {
      background-color: rgb(95, 95, 95);
    }
    &.active {
      background-color: red;
    }
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0px rgba(0, 0, 0, 0.2);
    }
    100% {
      box-shadow: 0 0 0 25px rgba(0, 0, 0, 0);
    }
  }

  .relative-right {
    position: relative;
    left: 480px;
    bottom: 70px;
  }

  .audio-recorder {
    position: relative;
    background-color: gray;
    border-radius: 50%;
    width: 64px;
    height: 64px;
    display: inline-block;
    box-shadow: 0 0 0 0 rgba(232, 76, 61, 0.7);

    &:before,
    &:after {
      content: '';
      position: absolute;
      background-color: #fff;
    }
    &:after {
      top: 30%;
      left: 43%;
      height: 15%;
      width: 14%;
      border-top-left-radius: 50%;
      border-top-right-radius: 50%;
    }
    &:before {
      top: 40%;
      left: 43%;
      height: 15%;
      width: 14%;
      border-bottom-left-radius: 50%;
      border-bottom-right-radius: 50%;
    }
    span {
      position: absolute;
      top: 50%;
      left: 36%;
      height: 24%;
      width: 28%;
      overflow: hidden;
      &:before,
      &:after {
        content: '';
        position: absolute;
        background-color: #fff;
      }
      &:before {
        bottom: 50%;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        border-radius: 50%;
        border: 0.125em solid #fff;
        background: none;
        left: 0;
      }
      &:after {
        top: 50%;
        left: 40%;
        width: 20%;
        height: 25%;
      }
    }
  }
</style>
