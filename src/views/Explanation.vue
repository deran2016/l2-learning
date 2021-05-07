<template>
  <v-card
    id="intro"
    class="elevation-12"
  >
    <div
      class="my-5"
    >
      <AudioDisplay
        :show="isPlaying"
      />
    </div>
    <div
      v-if="next"
      class="text-center"
    >
      다시 듣고싶으시면 오른쪽 버튼을 눌러주세요
      <v-btn
        icon
        @click="reset"
      >
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </div>
    <v-card-actions
      v-if="next"
    >
      <v-btn
        block
        color="primary"
        @click="goNextPage"
      >
        다음
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapMutations } from 'vuex';
import AudioDisplay from './components/AudioDisplay2.vue';

export default {
  name: 'Explanation',

  components: {
    AudioDisplay,
  },

  data: () => ({
    file: '',
    isPlaying: false,
    next: false,
  }),

  computed: {
    devMode() {
      return process.env.NODE_ENV === 'development';
    },

    condition() {
      return this.$store.state.data.experimentType;
    },
  },

  mounted() {
    setTimeout(() => {
      this.playAudio('3-1.에이전트 소개');
    }, 2000);
  },

  methods: {
    ...mapMutations([
      'updateFields',
    ]),

    playAudio(file) {
      this.file = file;

      const audio = document.getElementById(this.file);

      this.isPlaying = true;
      this.next = false;
      audio.play();
      audio.onended = () => {
        this.isPlaying = false;
        this.next = true;
      };
    },

    reset() {
      this.playAudio(this.file);
    },

    goNextPage() {
      this.$router.push({ name: 'pre' });
    },
  },
};
</script>
