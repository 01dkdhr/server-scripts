<template>
<div id="home-page">
    <header>
        <h3>请选择项目</h3>
    </header>
    <div class="project-list">
        <router-link 
            v-for="(item, index) in stateData.projectList"
            v-bind:key="index"
            :to="'/' + item.name" class="project">
            {{item.description}}
        </router-link>
    </div>
</div>
</template>

<script>
export default {
    name: 'home-page',
    data() {
        return {
            stateData: this.$store.state.HomePage
        }
    }
}
</script>

<style lang="scss" scoped>
#home-page {
    header {
        height: 40px;
        text-align: center;
        user-select: none;
        cursor: default;
        background-color: #D2E9FF;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .project-list {
        margin: 20px 80px;
        .project {
            display: inline-block;
            width: 130px;
            height: 30px;
            border: 1px solid #46A3FF;
            text-align: center;
            font-size: 18px;
            line-height: 18px;
            user-select: none;
            cursor: default;
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;

            &:hover {
                background-color: #D2E9FF;
            }
        }
    }
}
</style>
