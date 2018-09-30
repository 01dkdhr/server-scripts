<template>  
<div class="model">
    <div class="loader">
        <div class="loader-inner ball-spin-fade-loader">
            <div v-for="i in 8" :key="i"></div>
        </div>
    </div>
</div>
</template>
<script>
export default {
    name: 'loading'
}

</script>
<style lang="scss" scoped>
    .model{
        position: fixed;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.3);
        width: 100%;
        height: 100%;
    }
    .loader {
        display: flex;
        width: 200px;
        height: 200px;
        align-items: center;
        justify-content: center;
        position: relative;
        top: 50%;
        margin-top: -100px;
        left: 50%;
        margin-left: -100px;
        -webkit-transform:scale(-1,1);  
        -moz-transform:scale(-1,1);  
        transform:scale(-1,1);  

    }
    @-webkit-keyframes ball-spin-fade-loader {
        50% {
            opacity: 0.3;
            -webkit-transform: scale(0.4);
                transform: scale(0.4); }

        100% {
            opacity: 1;
            -webkit-transform: scale(1);
            transform: scale(1); } 
    }

    @keyframes ball-spin-fade-loader {
        50% {
            opacity: 0.3;
            -webkit-transform: scale(0.4);
            transform: scale(0.4); 
        }

        100% {
            opacity: 1;
            -webkit-transform: scale(1);
            transform: scale(1); 
        }
    }

    .ball-spin-fade-loader {
        position: relative; 
        width: 20px;
        height: 30px;
    }
  .ball-spin-fade-loader > div:nth-child(1) {
    top: 25px;
    left: 0;
    -webkit-animation: ball-spin-fade-loader 1s 0s infinite linear;
            animation: ball-spin-fade-loader 1s 0s infinite linear; }
  .ball-spin-fade-loader > div:nth-child(2) {
    top: 17.04545px;
    left: 17.04545px;
    -webkit-animation: ball-spin-fade-loader 1s 0.12s infinite linear;
            animation: ball-spin-fade-loader 1s 0.12s infinite linear; }
  .ball-spin-fade-loader > div:nth-child(3) {
    top: 0;
    left: 25px;
    -webkit-animation: ball-spin-fade-loader 1s 0.24s infinite linear;
            animation: ball-spin-fade-loader 1s 0.24s infinite linear; }
  .ball-spin-fade-loader > div:nth-child(4) {
    top: -17.04545px;
    left: 17.04545px;
    -webkit-animation: ball-spin-fade-loader 1s 0.36s infinite linear;
            animation: ball-spin-fade-loader 1s 0.36s infinite linear; }
  .ball-spin-fade-loader > div:nth-child(5) {
    top: -25px;
    left: 0;
    -webkit-animation: ball-spin-fade-loader 1s 0.48s infinite linear;
            animation: ball-spin-fade-loader 1s 0.48s infinite linear; }
  .ball-spin-fade-loader > div:nth-child(6) {
    top: -17.04545px;
    left: -17.04545px;
    -webkit-animation: ball-spin-fade-loader 1s 0.6s infinite linear;
            animation: ball-spin-fade-loader 1s 0.6s infinite linear; }
  .ball-spin-fade-loader > div:nth-child(7) {
    top: 0;
    left: -25px;
    -webkit-animation: ball-spin-fade-loader 1s 0.72s infinite linear;
            animation: ball-spin-fade-loader 1s 0.72s infinite linear; }
  .ball-spin-fade-loader > div:nth-child(8) {
    top: 17.04545px;
    left: -17.04545px;
    -webkit-animation: ball-spin-fade-loader 1s 0.84s infinite linear;
            animation: ball-spin-fade-loader 1s 0.84s infinite linear; }
  .ball-spin-fade-loader > div {
    background-color: #fff;
    width: 15px;
    height: 15px;
    border-radius: 100%;
    margin: 2px;
    -webkit-animation-fill-mode: both;
            animation-fill-mode: both;
    position: absolute; }

</style>