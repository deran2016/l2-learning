<template>
  <v-card
    id="experiment"
    class="elevation-12"
  >
    <v-card-text
      v-if="!quiz"
    >
      <div class="text-center">
        <h1>실전 녹음</h1>
        <br />
        <p>10개의 러시아 발음을 크고 정확하게 녹음해주세요.</p>
        <br />
      </div>
    </v-card-text>

    <v-card-text
      v-else-if="preEx"
    >
      <div class="text-center">
        <h1>러시아 발음과 뜻을 암기해보세요.</h1>
        <br />
        <v-banner
          elevation="6"
        >
          <br />
          <h1>{{ step + 1 }}. {{ getNowWord() }}</h1>
          <br />
        </v-banner>
      </div>
    </v-card-text>

    <AudioDisplay
      :show="isPlaying"
    />

    <div
      v-if="!quiz || !preEx"
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

    <div
      v-if="!quiz"
      class="text-center"
    >
      <p>마이크 버튼을 누르면 녹음이 시작되며, 버튼을 한 번 더 누르면 녹음이 완료됩니다.</p>
    </div>

    <div
      v-else-if="quiz && preEx"
      class="text-center"
    >
      <p>음성 버튼이 파란색으로 바뀌면, 발음을 따라해주세요.</p>
    </div>

    <v-card-text
      v-if="quiz && !preEx"
    >
      <div class="text-center">
        <p>원어민 선생님의 발음과 함께, 화면에 나타나는 한글 뜻을 외워주세요.</p>
        <p>
          음성 버튼에 파란불이 켜지면, 발음을 소리내어 따라해보세요.<br />
          러시아 발음과 한글 뜻, 총 10세트를 외워주세요.
        </p>
        <p>*** 암기학습이 끝나면 간단한 테스트를 진행할 예정입니다. ***</p>
      </div>
    </v-card-text>

    <div
      v-if="!quiz || preEx"
      class="body-1 d-flex justify-center mb-5"
    >
      <VueRecordAudio
        v-show="!isPlaying && !quiz"
        ref="mic"
        class="recorder"
        mode="press"
        @result="onResult"
      />

      <!-- Fake recoder for 실전녹음 -->
      <div
        v-show="isPlaying && !quiz"
        class="audio-recorder"
      >
        <span></span>
      </div>

      <!-- Fake recoder for 학습세트 -->
      <div
        v-show="!isAutorec && quiz"
        class="auto-audio-recorder-inactive"
      >
        <span></span>
      </div>

      <!-- Fake active recoder for 학습세트-->
      <div
        v-show="isAutorec && quiz"
        class="auto-audio-recorder-active"
      >
        <span></span>
      </div>
    </div>

    <div
      v-if="!quiz && next"
      class="relative-right"
    >
      <v-btn
        icon
        :disabled="isPlaying"
        @click="myRecPlay"
      >
        <v-icon>mdi-arrow-right-drop-circle</v-icon>
      </v-btn>
      녹음재생
    </div>

    <div
      v-else
      class="relative-right"
    >
      <br />
    </div>

    <v-card-text
      v-if="!quiz"
    >
      <div class="text-center">
        <p>* 새로 녹음하려면 마이크 버튼을 다시 눌러주세요.</p>
      </div>
    </v-card-text>

    <div
      v-if="!quiz"
      class="text-center"
    >
      <p>{{ getStepString() }}</p>
    </div>

    <div
      v-if="quiz && preEx"
      class="text-center"
    >
      <p>{{ getSubstepString() }}</p>
    </div>

    <v-card-actions
      v-if="!quiz || preEx"
    >
      <v-btn
        block
        color="primary"
        :disabled="!next"
        @click="nextBtn"
      >
        다음
      </v-btn>
    </v-card-actions>

    <v-card-actions
      v-else
    >
      <v-btn
        block
        color="primary"
        :disabled="!next"
        @click="nextBtn2"
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

    <div
      v-if="condition === '내목소리'"
    >
      <audio
        v-for="(url, key) in urls[0]"
        :id="url"
        :key="key"
        :src="url"
        preload="auto"
      >
        <p>Your browser does not support the <code>audio</code> element.</p>
      </audio>
    </div>
    <div
      v-else-if="condition === '다른사람'"
    >
      <audio
        v-for="(file, key) in files"
        :id="'https://api.l2-learning.site' + file.url"
        :key="key"
        :src="'https://api.l2-learning.site' + file.url"
        preload="auto"
      >
        <p>Your browser does not support the <code>audio</code> element.</p>
      </audio>
    </div>
  </v-card>
</template>

<script>
import { mapMutations } from 'vuex';
import axios from 'axios';
import AudioDisplay from './components/AudioDisplay.vue';

export default {
  name: 'Experiment',

  components: {
    AudioDisplay,
  },

  data: () => ({
    file: '',
    recfile: '',
    step: 0,
    substep: 0,
    quiz: 0,
    countDown: 3,
    isReceiving: false,
    isPlaying: false,
    isSending: false,
    isAutorec: false,
    speaking: false,
    next: false,
    preEx: false,
    alertNum: false,
    url: '',
    urls: [[], []],
    filesStructure: [],
    temp: {},
    files: [],
    nums: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'],
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

    username() {
      return this.$store.state.data.participantID;
    },

    userbirth() {
      return this.$store.state.data.participantBirth;
    },
  },

  mounted() {
    this.setFilesStructure();
    if (this.condition === '다른사람') {
      this.getAudio();
    }
    this.playAudio('4-2.실전녹음 시작');
  },

  methods: {
    ...mapMutations([
      'updateFields',
    ]),

    setFilesStructure() {
      if (this.sex === '남') {
        this.filesStructure = [
          '01_남_사과',
          '02_남_손',
          '03_남_귀',
          '04_남_창문',
          '05_남_날씨',
          '06_남_가방',
          '07_남_가을',
          '08_남_당근',
          '09_남_건포도',
          '10_남_노래',
        ];
      } else if (this.sex === '여') {
        this.filesStructure = [
          '01_여_사과',
          '02_여_손',
          '03_여_귀',
          '04_여_창문',
          '05_여_날씨',
          '06_여_가방',
          '07_여_가을',
          '08_여_당근',
          '09_여_건포도',
          '10_여_노래',
        ];
      }
    },

    playAudio(file) {
      this.file = file;

      const audio = document.getElementById(this.file);

      this.isPlaying = true;
      audio.play();
      audio.onended = () => {
        this.isPlaying = false;
        if (file === '4-2.실전녹음 시작') {
          this.handleNextStep();
        } else if (file === '4-3-1.원어민' || file === '4-3-2.내목소리' || file === '4-3-3.다른사람') {
          this.next = true;
          console.log('시작!');
        } else if (this.nums.includes(file)) {
          this.alertNum = true;
          this.handleNextStep();
        } else if (this.quiz && this.preEx && this.alertNum) {
          this.autoRec();
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
      };
    },

    myRecPlay() {
      console.log(this.url);
      this.playMyAudio(this.url);
    },

    reset() {
      this.playAudio(this.file);
    },

    async onResult(data) {
      if (this.quiz === 0 && !this.urls[0][this.step]) {
        this.temp = data;
        this.url = URL.createObjectURL(data);
        this.next = true;
      } else if (!this.urls[1][this.step]) {
        this.temp = data;
        this.url = URL.createObjectURL(data);
        this.substep += 1;
        this.handleNextStep();
      }
    },

    nextBtn() {
      if (this.next) {
        if (this.isPlaying) {
          this.isPlaying = false;
          const audio = document.getElementById(this.file);
          audio.pause();
        }
        this.substep = 0;
        this.next = false;
        this.pushUrl(this.url);
        this.submitRecordFile(this.temp);
        this.recfile = '';
        this.url = '';
        this.temp = {};
        this.step += 1;
        if (this.quiz && this.step === 10) {
          this.$router.push({ name: 'test' });
        } else {
          this.handleNextStep();
        }
      }
    },

    nextBtn2() {
      if (this.next) {
        if (this.isPlaying) {
          this.isPlaying = false;
          const audio = document.getElementById(this.file);
          audio.pause();
        }
        this.next = false;
        this.preEx = true;
        this.handleNextStep();
      }
    },

    pushUrl(url) {
      if (this.quiz === 0) {
        this.urls[0].push(url);
      } else if (this.quiz === 1) {
        this.urls[1].push(url);
      }
    },

    handleNextStep() {
      switch (this.quiz) {
        case 0:
          console.log('preRecord');
          this.handlePreRecord();
          break;
        case 1:
          console.log('원어민');
          this.handleNativeExperiment();
          break;
        case 2:
          console.log('내목소리');
          this.handleMineExperiment();
          break;
        case 3:
          console.log('다른사람');
          this.handleOthersExperiment();
          break;
        default:
          console.log('Error');
          break;
      }
    },

    handlePreRecord() {
      if (this.filesStructure[this.step]) {
        this.playAudio(this.filesStructure[this.step]);
      } else {
        this.step = 0;
        if (this.condition === '원어민') {
          this.quiz = 1;
          this.playAudio('4-3-1.원어민');
        } else if (this.condition === '내목소리') {
          this.quiz = 2;
          console.log(this.urls[0]);
          this.playAudio('4-3-2.내목소리');
        } else if (this.condition === '다른사람') {
          this.quiz = 3;
          this.playAudio('4-3-3.다른사람');
        }
      }
    },

    handleNativeExperiment() {
      if (this.filesStructure[this.step] && !this.alertNum && this.substep === 0) {
        this.alertNum = true;
        this.playAudio(this.nums[this.step]);
      } else if (this.filesStructure[this.step] && this.substep < 6) {
        this.playAudio(this.filesStructure[this.step]);
      } else if (this.substep === 6) {
        this.alertNum = false;
        this.next = true;
      }
    },

    handleMineExperiment() {
      if (this.urls[0][this.step] && !this.alertNum && this.substep === 0) {
        this.alertNum = true;
        this.playAudio(this.nums[this.step]);
      } else if (this.urls[0][this.step] && this.substep % 2 === 0 && this.substep < 6) {
        this.playAudio(this.filesStructure[this.step]);
      } else if (this.urls[0][this.step] && this.substep % 2 === 1 && this.substep < 6) {
        this.playAudio(this.urls[0][this.step]);
      } else if (this.substep === 6) {
        this.alertNum = false;
        this.next = true;
      }
    },

    handleOthersExperiment() {
      if (this.files[this.step] && !this.alertNum && this.substep === 0) {
        this.alertNum = true;
        this.playAudio(this.nums[this.step]);
      } else if (this.files[this.step] && this.substep % 2 === 0 && this.substep < 6) {
        this.playAudio(this.filesStructure[this.step]);
      } else if (this.files[this.step] && this.substep % 2 === 1 && this.substep < 6) {
        this.playAudio(`https://api.l2-learning.site${this.files[this.step].url}`);
      } else if (this.substep === 6) {
        this.alertNum = false;
        this.next = true;
      }
    },

    autoRec() {
      this.isAutorec = true;
      this.$refs.mic.startRecording();
      setTimeout(() => {
        this.isAutorec = false;
        this.$refs.mic.startRecording();
      }, 3000);
    },

    async submitRecordFile(file) {
      this.isSending = true;

      const fdata = new FormData();
      if (!this.quiz) {
        fdata.append('files', this.blobToFile(file), `${this.username}_${this.userbirth}_${this.getWordString(this.filesStructure[this.step])}.mp3`);
      } else {
        fdata.append('files', this.blobToFile(file), `s${this.username}_${this.userbirth}_${this.getWordString(this.filesStructure[this.step])}.mp3`);
      }

      try {
        const url = 'https://api.l2-learning.site/upload';
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

    async getAudio() {
      this.isReceiving = true;
      // const str = `${name}_${birth}`;
      try {
        const url = 'https://api.l2-learning.site/upload/files';
        const response = await axios.get(url);
        while (this.files.length !== 10) {
          this.files = this.getFiles(response.data);
        }
        console.log(this.files.length);
      } catch (err) {
        console.log(err);
      } finally {
        this.isReceiving = false;
      }
    },

    getFiles(data) {
      let j = 0;
      let str = '';
      if (this.condition === '내목소리') {
        str = `${this.username}_${this.userbirth}`;
      } else if (this.condition === '다른사람') {
        while (str === '') {
          j = Math.floor(Math.random() * data.length);
          if (this.username !== this.getNameString(data[j].name)
          && this.userbirth !== this.getBirthString(data[j].name)) {
            str = `${this.getNameString(data[j].name)}_${this.getBirthString(data[j].name)}`;
          }
        }
      }
      const files = [];
      switch (this.condition) {
        case '원어민':
          break;
        case '내목소리':
          console.log(str);
          for (let i = 0; i < data.length; i += 1) {
            const file = data[i];
            if (file.name.startsWith(str)) {
              files.push(file);
            }
          }
          break;
        case '다른사람':
          console.log(str);
          for (let i = 0; i < data.length; i += 1) {
            const file = data[i];
            if (file.name.startsWith(str)) {
              files.push(file);
            }
          }
          break;
        default:
          console.log('Error');
      }
      return files;
    },

    getSubstepString() {
      if (this.substep === 6) return '(6/6)';
      return `(${this.substep + 1}/6)`;
    },

    getStepString() {
      return `[${this.step + 1}/${this.filesStructure.length}]`;
    },

    getWordString(str) {
      const arr = str.split('.')[0].split('_');
      return arr[arr.length - 1];
    },

    getNameString(str) {
      const arr = str.split('.')[0].split('_');
      return arr[0];
    },

    getBirthString(str) {
      const arr = str.split('.')[0].split('_');
      return arr[1];
    },

    getNowWord() {
      let str = '';
      if (this.condition === '원어민') {
        str = this.getWordString(this.filesStructure[this.step]);
      } else if (this.condition === '내목소리') {
        if (this.urls[0][this.step]) {
          str = this.getWordString(this.filesStructure[this.step]);
        }
      } else if (this.condition === '다른사람') {
        if (this.files[this.step]) {
          str = this.getWordString(this.files[this.step].name);
        }
      }
      return str;
    },

    blobToFile(blob) {
      const file = new File([blob], 'test.mp3', { type: 'audio/mpeg' });
      return file;
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
    margin: 0px;
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

  .auto-audio-recorder-inactive {
    position: relative;
    border-radius: 50%;
    width: 64px;
    height: 64px;
    display: inline-block;
    background-image: url('~@/assets/img/inactive.png');
    background-size: contain;
  }

  .auto-audio-recorder-active {
    position: relative;
    border-radius: 50%;
    width: 64px;
    height: 64px;
    display: inline-block;
    background-image: url('~@/assets/img/active.png');
    background-size: contain;
    -webkit-animation: pulse 1.25s infinite cubic-bezier(0.66, 0, 0, 1);
    -moz-animation: pulse 1.25s infinite cubic-bezier(0.66, 0, 0, 1);
    animation: pulse 1.25s infinite cubic-bezier(0.66, 0, 0, 1);
  }

  .transparent {
    background-color: transparent;
    background-image: none;
    border-color: transparent;
    border: none;
  }

  .active {
    background-color: red;
    -webkit-animation: pulse 1.25s infinite cubic-bezier(0.66, 0, 0, 1);
    -moz-animation: pulse 1.25s infinite cubic-bezier(0.66, 0, 0, 1);
    animation: pulse 1.25s infinite cubic-bezier(0.66, 0, 0, 1);
  }
</style>
