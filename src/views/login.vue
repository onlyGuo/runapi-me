<template>
    <div>
        <div>
            username<input type="text" v-model="param.username">
        </div>
        <div>
            password<input type="password" v-model="param.password">
        </div>
        <div>
            valicode <input type="text" v-model="param.v_code">
        </div>
        <img :src="valiCodeUrl" @click="refushValiCode">
        <button @click="login">login</button>
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

</style>