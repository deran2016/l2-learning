<template>
  <v-app id="testApp">
    <v-main>
      <v-container
        class="fill-height"
        fluid
      >
        <!-- <div
          v-if="devMode"
          class="debug pa-3"
        >
          <div>
            Experiment type: {{ experimentType }}
          </div>
          <div>
            Items order: {{ items }}
          </div>
          <div>
            Step: {{ step }}
          </div>
          <div>
            Item number: {{ itemNumber }}
          </div>
        </div> -->

        <MediaList />

        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            sm="10"
            md="8"
            lg="6"
            style="max-width: 800px;"
          >
            <v-fade-transition mode="out-in">
              <router-view />
            </v-fade-transition>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapState } from 'vuex';
import MediaList from './views/components/MediaList.vue';

export default {
  name: 'TestApp',

  components: {
    MediaList,
  },

  computed: {
    ...mapState({
      experimentType: (state) => state.experiment.type,
      items: (state) => state.experiment.items,
      step: (state) => state.experiment.step,
      itemNumber: (state) => state.experiment.itemNumber,
    }),

    devMode() {
      // console.log(process.env);
      return process.env.NODE_ENV === 'development';
    },
  },
};
</script>

<style lang="scss" scoped>
#moriApp {
  .debug {
    background-color: #ff00005e;
    position: absolute;
    top: 25px;
    left: 25px;
  }
}
</style>
