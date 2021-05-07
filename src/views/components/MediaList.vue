<template>
  <div class="mediaList">
    <!-- COMMON -->
    <div>
      <audio
        v-for="(file, key) in common"
        :id="file"
        :key="key"
        :src="require(`@/assets/voices/${file}.mp3`)"
        preload="auto"
      >
        <p>Your browser does not support the <code>audio</code> element.</p>
      </audio>
    </div>

    <!-- start with 남 -->
    <div v-if="sex.startsWith('남')">
      <audio
        v-for="(file, key) in man"
        :id="file"
        :key="key"
        :src="require(`@/assets/voices/${file}.mp3`)"
        preload="auto"
      >
        <p>Your browser does not support the <code>audio</code> element.</p>
      </audio>
    </div>

    <!-- start with 여 -->
    <div v-if="sex.startsWith('여')">
      <audio
        v-for="(file, key) in woman"
        :id="file"
        :key="key"
        :src="require(`@/assets/voices/${file}.mp3`)"
        preload="auto"
      >
        <p>Your browser does not support the <code>audio</code> element.</p>
      </audio>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    common: [
      '3-1.에이전트 소개',
      '4-1-1.녹음절차 설명',
      '4-1-2.녹음재생 설명',
      '4-2.실전녹음 시작',
      '4-3-1.원어민',
      '4-3-2.내목소리',
      '4-3-3.다른사람',
      '4-5.테스트 세트',
      '5.설문',
      '01',
      '02',
      '03',
      '04',
      '05',
      '06',
      '07',
      '08',
      '09',
      '10',
      '연습용_남_자동차',
      '연습용_여_자동차',
    ],
    man: [
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
    ],
    woman: [
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
    ],
  }),

  computed: {
    condition() {
      return this.$store.state.data.experimentType;
    },

    sex() {
      return this.$store.state.data.participantSex;
    },
  },
};
</script>
