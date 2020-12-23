module.exports = {
    devServer: {
        proxy: {
            '/server': {
                target: 'https://www.showdoc.com.cn',
                changeOrigin: true,
            },
            '/en-student': {
                target: 'https://mgr.student.english.englishts.cn',
                changeOrigin: true,
            },
        },
    },
}