<template>
    <div>
        <div class="item" v-for="item in list" @click="goto('/project/' + item.item_id)">
            <div class="item-title" v-text="item.item_name"></div>
            <div v-text="item.item_description"></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "home",
        data(){
            return {
                list: []
            }
        },
        methods: {
            goto(path){
                this.$router.push({
                    path: path
                })
            }
        },
        created() {
            this.ser.post("/api/item/myList").then(res => {
                this.list = res.data
                console.log(this.list)
            })
        }
    }
</script>

<style scoped>
    .item{
        display: inline-block;
        height: 100px;
        width: 250px;
        margin: 10px;
        overflow: hidden;
        border: solid cornflowerblue 1px;
        text-align: left;
    }
    .item-title{
        text-align: center;
        border-bottom: solid cornflowerblue 1px;
    }
</style>