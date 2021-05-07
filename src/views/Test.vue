<template>
  <v-card
    id="test"
    class="elevation-12"
  >
    <v-card-text>
      <div class="text-center">
        <h2>다음을 듣고 해당 단어의 뜻을 골라주세요.</h2>
      </div>
    </v-card-text>

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

    <br />

    <div
      v-for="(text, key) in choice"
      :id="text"
      :key="key"
      class="text-center"
    >
      <v-btn
        outlined
        color="secondary"
        class="choice"
        :disabled="isPlaying"
        @click="pushAnswer(text)"
      >
        {{ text }}
      </v-btn>
    </div>

    <div class="text-center">
      <p>{{ getStepString() }}</p>
    </div>
    <!--
    <div
      v-if="condition === '내목소리' || condition === '다른사람'"
    >
      <audio
        v-for="(file, key) in files"
        :id="file.name"
        :key="key"
        :src="'https://api.l2-learning.site' + file.url"
        preload="auto"
      >
        <p>Your browser does not support the <code>audio</code> element.</p>
      </audio>
    </div>
    -->
  </v-card>
</template>

<script>
import { mapMutations } from 'vuex';
// import axios from 'axios';
import AudioDisplay from './components/AudioDisplay.vue';

export default {
  name: 'Test',

  components: {
    AudioDisplay,
  },

  data: () => ({
    file: '',
    isPlaying: false,
    isReceiving: false,
    choice: ['', '', ''],
    answer: {},
    step: 0,
    filesStructure: [],
    files: [],
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

  async mounted() {
    this.initChoice();
    this.playAudio('4-5.테스트 세트');
    /*
    if (this.condition === '내목소리' || this.condition === '다른사람') {
      this.getAudio();
      this.files = this.shuffleArr(this.files);
      console.log(this.files);
    } else if (this.condition === '원어민') {
      this.setFilesStructure();
    }
    */
    this.setFilesStructure();
  },

  methods: {
    ...mapMutations([
      'updateFields',
    ]),

    setFilesStructure() {
      this.filesStructure = this.shuffleArr([
        `01_${this.sex}_사과`,
        `02_${this.sex}_손`,
        `03_${this.sex}_귀`,
        `04_${this.sex}_창문`,
        `05_${this.sex}_날씨`,
        `06_${this.sex}_가방`,
        `07_${this.sex}_가을`,
        `08_${this.sex}_당근`,
        `09_${this.sex}_건포도`,
        `10_${this.sex}_노래`,
      ]);
    },

    initChoice() {
      const arr = this.shuffleArr(['사과', '손', '귀', '창문', '날씨', '가방', '가을', '당근', '건포도', '노래']);
      for (let i = 0; i < 3; i += 1) this.choice[i] = arr[i];
    },

    handler() {
      if (this.step < this.filesStructure.length) {
        this.playAudio(this.filesStructure[this.step]);
        this.choice = this.makeChoice(this.file).map((item) => this.getWordString(item));
      } else {
        this.updateFields(this.answer);
        this.$router.push({ name: 'submit' });
      }
    },
    /*
    async getAudio() {
      this.isReceiving = true;
      // const str = `${name}_${birth}`;
      try {
        const url = 'https://api.l2-learning.site/upload/files';
        const response = await axios.get(url);
        this.files = this.shuffleArr(this.getFiles(response.data));
        console.log(this.files);
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
    */
    shuffleArr(arr) {
      const newArr = arr;
      for (let i = 0; i < newArr.length; i += 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
      }
      return newArr;
    },

    makeChoice(file) {
      const newArr = [];
      let newArr2 = [];
      newArr.push(file);
      while (newArr.length !== 3) {
        const j = Math.floor(Math.random() * this.filesStructure.length);
        if (this.filesStructure[j] !== file
        && this.filesStructure[j] !== newArr[newArr.length - 1]) {
          newArr.push(this.filesStructure[j]);
        }
      }
      newArr2 = this.shuffleArr(newArr);
      return newArr2;
    },

    makeChoice2(file) {
      const newArr = [];
      let newArr2 = [];
      newArr.push(file);
      while (newArr.length !== 3) {
        const j = Math.floor(Math.random() * this.files.length);
        if (this.files[j].name !== file
        && this.files[j].name !== newArr[newArr.length - 1]) {
          newArr.push(this.files[j].name);
        }
      }
      newArr2 = this.shuffleArr(newArr);
      return newArr2;
    },

    playAudio(file) {
      this.file = file;

      const audio = document.getElementById(this.file);

      this.isPlaying = true;
      audio.play();
      audio.onended = () => {
        this.isPlaying = false;
        if (this.file === '4-5.테스트 세트') {
          this.handler();
        }
      };
    },

    reset() {
      this.playAudio(this.file);
    },

    getStepString() {
      const str = `[${this.step + 1}/${this.filesStructure.length}]`;
      return str;
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

    pushAnswer(text) {
      this.answer[`Ans_${this.changeKortoEng(this.getWordString(this.file))}`] = text;
      this.step += 1;
      this.handler();
      console.log(this.answer);
    },

    changeKortoEng(text) {
      let str = '';
      if (text === '사과') {
        str = 'apple';
      } else if (text === '손') {
        str = 'hand';
      } else if (text === '귀') {
        str = 'ear';
      } else if (text === '창문') {
        str = 'window';
      } else if (text === '날씨') {
        str = 'weather';
      } else if (text === '가방') {
        str = 'bag';
      } else if (text === '가을') {
        str = 'autumn';
      } else if (text === '당근') {
        str = 'carrot';
      } else if (text === '건포도') {
        str = 'raisin';
      } else if (text === '노래') {
        str = 'song';
      }
      return str;
    },
  },
};
</script>

<style lang="scss">
  .choice {
      margin: 5px;
      width: 300px;
      height: 200px;
  }

  .relative-right {
    position: relative;
    left: 480px;
    bottom: 70px;
  }
</style>
