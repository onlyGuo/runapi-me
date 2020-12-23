<template>
    <div>
        Hello
    </div>
</template>

<script>
    export default {
        name: "test",
        created() {
            this.ser.post("api/user/info").then(res => {
                console.log(res)
            })
        }
    }
</script>

<style scoped>

</style>