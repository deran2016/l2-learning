<template>
  <div id="audioDisplay">
    <div
      v-show="show"
      class="container"
    >
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
    </div>
    <div
      v-show="!show"
      class="container"
    >
      <div class="idle"></div>
      <div class="idle"></div>
      <div class="idle"></div>
      <div class="idle"></div>
      <div class="idle"></div>
      <div class="idle"></div>
      <div class="idle"></div>
      <div class="idle"></div>
      <div class="idle"></div>
      <div class="idle"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AudioDisplay',

  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
  }),
};
</script>

<style lang="scss" scoped>

#audioDisplay {
  // height: 100px;

  .container {
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    // background: black;
  }
}

.bar {
  background: #52467b;
  bottom: 1px;
  height: 3px;
  width: 10px;
  margin: 0px 4px;
  border-radius: 5px;
  animation: sound 0ms -600ms linear infinite alternate;
}

.idle {
  background: #52467b;
  bottom: 1px;
  height: 0px;
  width: 10px;
  margin: 0px 4px;
  border-radius: 5px;
}

@keyframes sound {
  0% {
    opacity: .35;
    height: 3px;
  }
  100% {
    opacity: 1;
    height: 70px;
  }
}

.bar:nth-child(1)  { left: 1px; animation-duration: 474ms; }
.bar:nth-child(2)  { left: 15px; animation-duration: 433ms; }
.bar:nth-child(3)  { left: 29px; animation-duration: 407ms; }
.bar:nth-child(4)  { left: 43px; animation-duration: 458ms; }
.bar:nth-child(5)  { left: 57px; animation-duration: 400ms; }
.bar:nth-child(6)  { left: 71px; animation-duration: 427ms; }
.bar:nth-child(7)  { left: 85px; animation-duration: 441ms; }
.bar:nth-child(8)  { left: 99px; animation-duration: 419ms; }
.bar:nth-child(9)  { left: 113px; animation-duration: 487ms; }
.bar:nth-child(10) { left: 127px; animation-duration: 442ms; }
</style>
