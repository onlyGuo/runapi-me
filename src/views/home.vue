<template>
    <div>
        <div class="top-bar">
            智慧终端机事业部接口文档发布系统
            <div class="right">
                <el-button type="text" size="small" style="color: white" @click="logout">重新登录</el-button>
            </div>
        </div>
        <div class="page-content">
            <el-table
                    :data="list"
                    style="width: 100%">
                <el-table-column
                        prop="item_name"
                        label="项目名称">
                </el-table-column>
                <el-table-column
                        prop="item_description"
                        label="项目描述">
                    <template slot-scope="scope">
                        <span v-if="scope.row.item_description" v-text="scope.row.item_description"></span>
                        <span v-if="!scope.row.item_description">--</span>
                    </template>
                </el-table-column>
                <el-table-column
                        fixed="right"
                        width="100px"
                        label="操作">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text" size="small">进入</el-button>
                        <el-button type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
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
            },
            handleClick(row){
                this.$router.push({
                    path: '/project/' + row.item_id
                })
            },
            logout(){
                localStorage.removeItem("login_user");
                this.$router.replace({
                    path: '/login'
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
    .top-bar{
        height: 50px;
        line-height: 50px;
        font-size: 20px;
        background-color: cornflowerblue;
        color: white;
        padding-left: 20px;
        box-shadow: rgba(0,0,0,.2) 0 1px 5px 2px;
        position: fixed;
        right: 0;
        left: 0;
        top: 0;
        z-index: 4;
    }
    .top-bar .right{
        float: right;
        margin-right: 20px;
    }
    .page-content{
        margin-top: 50px;
    }
</style>