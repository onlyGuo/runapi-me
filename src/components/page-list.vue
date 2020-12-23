<template>
    <div>
        <div v-if="menu" style="overflow-y: auto;height: 100%">
            <el-menu style="height: 100%">
                <page-menu-list :menu="menu" :on-select="onSelect" :item-id="itemId" :parent-cat-id="'0'"></page-menu-list>
            </el-menu>
        </div>
    </div>
</template>

<script>
    import PageMenuList from "./page-menu-list";
    export default {
        name: "page-list",
        components: {PageMenuList},
        props: {
            itemId: String,
            onSelect: Function
        },
        data(){
            return {
                menu: null
            }
        },
        created() {
            this.ser.post("api/item/info", {
                item_id: this.itemId,
                default_page_id: 0
            }).then(res => {
                this.menu = res.data.menu
                console.log(res)
            })
        }
    }
</script>

<style scoped>
    .el-menu{
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
        text-align: left;
    }
</style>