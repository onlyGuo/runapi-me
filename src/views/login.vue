<template>
    <div>
        <el-card class="box-card">
            <el-form ref="form" :model="param" label-width="80px">
                <el-form-item label="用户名">
                    <el-input v-model="param.username"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="param.password" type="password"></el-input>
                </el-form-item>
                <el-form-item label="验证码">
                    <el-input v-model="param.v_code" style="width: calc(100% - 160px);"></el-input>
                    <img :src="valiCodeUrl" @click="refushValiCode" style="vertical-align: middle; width: 150px; height: 41px; float: right">
                </el-form-item>
                <div style="text-align: center">
                    <el-button type="primary" @click="login" style="width: 200px;">登录</el-button>
                </div>

            </el-form>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "login",
        data(){
            return {
                param: {
                    username: '',
                    password: '',
                    v_code: ''
                },
                valiCodeUrl: this.ser.ctx + "api/common/verify?t="
            }
        },
        created() {
            this.valiCodeUrl = this.ser.ctx + 'api/common/verify&rand=' + this.uuid()
        },
        methods: {
            login(){
                this.ser.post("api/user/login", this.param).then(res => {
                    if (res.error_code === 0){
                        localStorage.setItem("login_user", JSON.stringify(res.data))
                        this.$router.replace({
                            path: '/home'
                        })
                    }
                })
            },
            refushValiCode(){
                this.valiCodeUrl = this.ser.ctx + 'api/common/verify&rand=' + this.uuid()
            }
        }
    }
</script>

<style scoped>
    .box-card{
        width: 450px;
        height: 280px;
        margin: calc(calc(100vh - 290px) / 2) auto;
    }
</style>