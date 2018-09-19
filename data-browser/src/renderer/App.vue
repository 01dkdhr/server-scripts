<template>
<div id="app">
    <keep-alive>
        <router-view></router-view>
    </keep-alive>
</div>
</template>

<script>
  export default {
    name: 'data-browser'
  }
</script>

<style>
* {
    margin: 0;
    padding: 0;
}
</style>
