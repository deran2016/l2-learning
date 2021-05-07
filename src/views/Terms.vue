<template>
  <v-card
    id="intro"
    class="elevation-12"
    style="min-width: 650px;"
  >
    <v-card-text>
      <div class="body-1">
        연구 배경 및 방법
      </div>
      <div class="terms pa-2">
        본 실험에서는 음성 웹페이지를 활용한 제2 외국어 교육 프로그램의 효과를 연구합니다.
        실험에 사용되는 웹페이지는 외국어 학습을 위해 자체 개발되었으며,
        간단한 녹음기능과 러시아어 단어 학습 프로그램을 지원합니다.
        실험 참여에 동의하는 피험자들은 러시아 단어를 반복적으로 따라 읽으며 암기한 후, 테스트를 수행합니다.
        음성으로 진행되는 학습을 수행하기 위해, 소음이 없고 크게 말할 수 있는 장소에서 실험을 진행해야 하며,
        실험 참여 의지가 있음에도 중도에 웹페이지를 종료하거나 지시사항을 무시하는 등의 행동을 할 수 없습니다.
        실험종료 후 설문에 응답을 제출하여야 모든 실험 절차가 종료됩니다.
      </div>
      <div class="body-1 d-flex justify-end mb-5">
        <v-checkbox
          v-model="agreedTerm1"
          label="동의합니다"
        />
      </div>

      <div class="body-1">
        개인정보에 대한 비밀보장
      </div>
      <div class="terms pa-2">
        실험참여에 동의할 경우, 참가비 지급 및 연구사항 관리를 위하여 이름, 성별, 주민등록번호, 연락처, 생년월일,
        주소 및 계좌정보에 대한 개인정보를 수집합니다. 해당 개인정보 중 나이와 성별은 연구에 활용될 예정이며,
        그 외 개인 정보는 본교 관할 세무서에 통보하는 목적 이외에 그 어떠한 목적으로 활용되지 않습니다.
        제공된 개인정보는 연구 종료 이후 영구 삭제됩니다.
      </div>
      <div class="body-1 d-flex justify-end mb-5">
        <v-checkbox
          v-model="agreedTerm2"
          label="동의합니다"
        />
      </div>

      <div>
        본 실험을 통해 얻어진 귀하의 자료는 향후의 다른 연구에서도 사용되어 더 가치 있는 연구의 결과로 사용 될 수
        있습니다. 귀하의 자료를 미래의 다른 연구에 사용하는 것에 대해 다음 중 하나에 선택해 주시기 바랍니다.
      </div>

      <v-radio-group v-model="selectedOption">
        <v-radio
          label="향후의 모든 다른 연구에 제 자료를 제공하여 연구하는 것에 동의합니다."
          value="향후의 모든 다른 연구에 제 자료를 제공하여 연구하는 것에 동의합니다."
        />
        <v-radio
          label="성균관대학교의 연구자에게만 동의합니다."
          value="성균관대학교의 연구자에게만 동의합니다."
        />
        <v-radio
          label="본 연구의 연구자에게만 동의합니다."
          value="본 연구의 연구자에게만 동의합니다."
        />
        <v-radio
          label="동의하지 않습니다."
          value="동의하지 않습니다."
        />
      </v-radio-group>

      <v-text-field
        v-model="participantID"
        label="참여자 성명 (ex: 홍길동)"
      />
      <v-text-field
        v-model="participantBirth"
        label="생년월일 (ex: 210102)"
      />
      <v-alert
        v-if="showAlert"
        type="warning"
      >
        이미 본 실험에 참여한 이력이 있는 참가자입니다.
      </v-alert>
      <v-alert
        v-if="!agreedTerm1 || !agreedTerm2"
        type="error"
      >
        참여약관에 동의해야 실험참여가 가능합니다.
      </v-alert>
      <v-alert
        v-else-if="!selectedOption || selectedOption === '동의하지 않습니다.'"
        type="error"
      >
        연구자료 제공에 동의해야 실험참여가 가능합니다.
      </v-alert>
      <v-alert
        v-else-if="!participantID || participantID.length === 1"
        type="error"
      >
        성함을 올바르게 입력해주세요.
      </v-alert>
      <v-alert
        v-else-if="!participantBirth || participantBirth.length !== 6"
        type="error"
      >
        생년월일을 올바르게 입력해주세요.
      </v-alert>
    </v-card-text>

    <v-card-actions>
      <v-btn
        block
        color="primary"
        :disabled="!agreedAll"
        @click="submit"
      >
        다음
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapMutations } from 'vuex';
import axios from 'axios';

export default {
  data: () => ({
    agreedTerm1: false,
    agreedTerm2: false,
    selectedOption: null,
    participantID: '',
    participantBirth: '',
    resData: '',
    showAlert: false,
  }),

  computed: {
    agreedAll() {
      return this.agreedTerm1
        && this.agreedTerm2
        && (this.selectedOption && this.selectedOption !== '동의하지 않습니다.')
        && (this.participantID && this.participantID.length >= 2)
        && (this.participantBirth && this.participantBirth.length === 6);
    },
  },

  watch: {
    agreedAll2() {
      return this.agreedTerm1
        && this.agreedTerm2
        && (this.selectedOption && this.selectedOption !== '동의하지 않습니다.')
        && (this.participantID && this.participantID.length >= 2)
        && (this.participantBirth && this.participantBirth.length === 6);
    },
  },

  mounted() {
    this.getAudio();
  },

  methods: {
    ...mapMutations([
      'updateFields',
    ]),

    submit() {
      const str = `${this.participantID}_${this.participantBirth}`;

      if (!this.isFile(str, this.resData)) {
        this.showAlert = false;
        this.updateFields(this.$data);
        this.$router.push({ name: 'explanation' });
      } else {
        this.showAlert = true;
      }
    },

    async getAudio() {
      this.isReceiving = true;
      try {
        const url = 'https://api.l2-learning.site/upload/files';
        const response = await axios.get(url);
        this.resData = response.data;
      } catch (err) {
        console.log(err);
      } finally {
        this.isReceiving = false;
      }
    },

    isFile(name, data) {
      for (let i = 0; i < data.length; i += 1) {
        if (data[i].name.startsWith(name)) {
          return true;
        }
      }
      return false;
    },
  },
};
</script>

<style lang="scss">
.terms {
  height: 150px;
  overflow-y: auto;
  border: 1px solid grey;
}
</style>
