<template>
    <div>
        <el-page-header @back="$router.go(-1)" :content="itemName" style="height: 50px; line-height: 50px; border-bottom: #1989fa solid 1px; padding-left: 20px">
        </el-page-header>
        <div style="height: calc(100vh - 52px)" v-loading="pageLoading">
            <div class="page-list"><page-list :item-id="$route.params.itemId" :on-select="selectItem"></page-list></div>
            <!-- 页面详情 -->
            <div class="page-info" v-if="apiData.info">
                <div class="head">
                    <el-input placeholder="文档连接" :value="thisPageId != 0 ? 'https://www.showdoc.com.cn/' + $route.params.itemId + '?page_id=' + thisPageId : ''"></el-input>
                    <el-input placeholder="接口名称" v-model="pageData.page_title" style="width: calc(50% - 5px); margin-right: 10px"></el-input>
                    <el-input placeholder="接口描述" v-model="apiData.info.description" style="width: calc(50% - 5px)"></el-input>
                    <div class="request-url">
                        <el-select v-model="apiData.info.method" placeholder="请求方式">
                            <el-option key="get" label="GET" value="get"></el-option>
                            <el-option key="post" label="POST" value="post"></el-option>
                            <el-option key="put" label="PUT" value="put"></el-option>
                            <el-option key="delete" label="DELETE" value="delete"></el-option>
                        </el-select>
                        <el-input placeholder="请求地址" v-model="apiData.info.url"></el-input>
                        <el-button type="primary" @click="doRequest">发送</el-button>
                        <el-button @click="save">保存</el-button>
                    </div>
                </div>
                <div class="request-param">
                    <el-tabs v-model="this.reqParamTab" @tab-click="">
                        <el-tab-pane label="Header" name="header">
                            <div class="headers">
                                <div class="header-item" v-for="headerItem in requestHeaders">
                                    <el-input placeholder="请求地址" class="head-name" v-model="headerItem.name"></el-input>
                                    <el-input placeholder="请求地址" class="head-value" v-model="headerItem.value"></el-input>
                                    <el-button icon="el-icon-close" circle @click="requestHeaders.remove(headerItem)"></el-button>
                                </div>
                                <el-button type="text" @click="requestHeaders.push({name: '', value: ''})">新增Header</el-button>
                            </div>
                        </el-tab-pane>
                    </el-tabs>

                    <el-tabs v-model="apiData.request.params.mode" @tab-click="">

                        <el-tab-pane label="JSON" name="json">
                            <el-tabs v-model="jsonParamTab" @tab-click="">
                                <el-tab-pane label="Body" name="json-body">
                                    <div class="req">
                                        <codemirror v-model="apiData.request.params.json" :options="cmOptions"/>
                                    </div>
                                </el-tab-pane>
                                <el-tab-pane label="字段说明" name="json-fields">
                                    <el-button type="text" @click="ansyRequestBody">→解析请求体到此处列表</el-button>
                                    <div class="result-item" v-for="requestJsonField in apiData.request.params.jsonDesc">
                                        <el-input placeholder="字段名" class="item result-name" v-model="requestJsonField.name"></el-input>
                                        <el-select class="item result-value" v-model="requestJsonField.type" placeholder="字段类型">
                                            <el-option key="string" label="String" value="string"></el-option>
                                            <el-option key="number" label="Number" value="number"></el-option>
                                            <el-option key="boolean" label="Boolean" value="boolean"></el-option>
                                            <el-option key="date" label="Date" value="date"></el-option>
                                            <el-option key="object" label="Object" value="object"></el-option>
                                            <el-option key="array" label="Array" value="array"></el-option>
                                        </el-select>
                                        <el-input placeholder="字段说明" class="item result-dscp" v-model="requestJsonField.remark"></el-input>
                                        <el-button icon="el-icon-close" circle @click="apiData.request.params.jsonDesc.remove(requestJsonField)"></el-button>
                                    </div>
                                </el-tab-pane>
                            </el-tabs>
                        </el-tab-pane>

                        <el-tab-pane label="x-www-form-urlencoded" name="urlencoded">
                            <div class="result-item" v-for="requestField in apiData.request.params.urlencoded">
                                <el-input placeholder="字段名" class="item result-name" v-model="requestField.name"></el-input>
                                <el-select class="item result-value" v-model="requestField.type" placeholder="字段类型">
                                    <el-option key="string" label="String" value="string"></el-option>
                                    <el-option key="number" label="Number" value="number"></el-option>
                                    <el-option key="boolean" label="Boolean" value="boolean"></el-option>
                                    <el-option key="date" label="Date" value="date"></el-option>
                                    <el-option key="object" label="Object" value="object"></el-option>
                                    <el-option key="array" label="Array" value="array"></el-option>
                                </el-select>
                                <el-input placeholder="字段说明" class="item result-dscp" v-model="requestField.remark"></el-input>
                                <el-button icon="el-icon-close" circle @click="apiData.request.params.urlencoded.remove(requestField)"></el-button>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
                <div class="response-box">
                    <el-button type="text">Status: <span class="response-status" :class="{'err': responseStatus !== 200}" v-text="responseStatus">400</span></el-button>
                    <el-tabs v-model="resultTab" @tab-click="">
                        <el-tab-pane label="Body" name="body">
                            <codemirror v-model="apiData.response.responseExample" :options="cmOptions" />
                        </el-tab-pane>
                        <el-tab-pane label="返回参数说明" name="params">
                            <el-button type="text" @click="ansyResponseBody">→解析响应体到此处列表</el-button>
                            <div class="result-item" v-for="resultItem in apiData.response.responseParamsDesc">
                                <el-input placeholder="字段名" class="item result-name" v-model="resultItem.name"></el-input>
                                <el-select class="item result-value" v-model="resultItem.type" placeholder="字段类型">
                                    <el-option key="String" label="String" value="String"></el-option>
                                    <el-option key="Number" label="Number" value="Number"></el-option>
                                    <el-option key="Boolean" label="Boolean" value="Boolean"></el-option>
                                    <el-option key="Date" label="Date" value="Date"></el-option>
                                    <el-option key="Object" label="Object" value="Object"></el-option>
                                    <el-option key="Array" label="Array" value="Array"></el-option>
                                </el-select>
                                <el-input placeholder="字段说明" class="item result-dscp" v-model="resultItem.remark"></el-input>
                                <el-button icon="el-icon-close" circle @click="apiData.response.responseParamsDesc.remove(resultItem)"></el-button>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import PageList from "../components/page-list";
    import 'codemirror/theme/monokai.css'
    import 'codemirror/mode/javascript/javascript.js'
    export default {
        name: "project",
        components: {PageList},
        data(){
            return {
                itemName: '',
                pageLoading: false,
                thisPageId: 0,
                thisCatId: 0,
                reqParamTab: 'header',
                resultTab: 'body',
                jsonParamTab: 'json-body',
                requestHeaders: [
                    {
                        name: 'Content-Type',value: 'application/json'
                    },{
                        name: 'Authorization',value: ''
                    }
                ],
                requestUrl: '',
                responseStatus: 0,
                cmOptions: {
                    tabSize: 2,
                    mode: 'application/json',
                    theme: 'monokai',
                    lineNumbers: true,
                    line: true,
                },
                pageData: {
                    page_title: '',
                    page_comments: '',
                    page_content: '',
                    pageContent: {}
                },
                apiData: {}

            }
        },
        methods:{
            doRequest(){
                this.pageLoading = true
                let xhr = new XMLHttpRequest();
                let data = null;
                if (this.apiData.info.method === 'get' || this.apiData.request.params.mode === 'urlencoded'){
                    data = '';
                    for (let key in this.apiData.request.params.urlencoded){
                        if (this.apiData.request.params.urlencoded[key].value){
                            data += '&' + this.apiData.request.params.urlencoded[key].name + "=" + encodeURIComponent(this.apiData.request.params.urlencoded[key].value);
                        }
                    }
                    data = data.substr(1);
                }else{
                    // JSON 格式
                    data = JSON.parse(this.apiData.request.params.json);
                }

                // 响应信息
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4){
                        this.pageLoading = false
                        this.responseStatus = xhr.status
                        this.resultJson = JSON.stringify(JSON.parse(xhr.responseText), null, 2);
                    }
                }

                // 请求与请求体
                if (this.apiData.info.method === 'get'){
                    let req = this.requestUrl;
                    if (!req.startsWith("http")){
                        req = "http://" + req
                    }
                    if (this.requestUrl.indexOf('?') !== -1){
                        req += '&' + data;
                    }else{
                        req += '?' + data;
                    }
                    xhr.open(this.apiData.info.method, req, false);
                }else{
                    let req = this.requestUrl;
                    if (!req.startsWith("http")){
                        req = "http://" + req
                    }
                    xhr.open(this.apiData.info.method, req, false);
                }

                // 请求头
                for (let i in this.requestHeaders){
                    let head = this.requestHeaders[i];
                    if (head && head.value){
                        xhr.setRequestHeader(head.name, head.value);
                    }
                }
                if (this.requestMethod === 'GET'){
                    xhr.send()
                }else{
                    xhr.send(data)
                }
            },
            ansyResponseBody(){
                let resJson = JSON.parse(this.apiData.response.responseExample);
                this.apiData.response.responseParamsDesc = [];
                this.putJsonFieldForm(resJson, this.apiData.response.responseParamsDesc)
            },
            putJsonFieldForm(resJson, target){
                for(let i in resJson){
                    let item = {
                        name: i
                    }
                    if (resJson[i]){
                        if (resJson[i].constructor === String){
                            item['type'] = 'string'
                        }else if (resJson[i].constructor === Number){
                            item['type'] = 'number'
                        }else if (resJson[i].constructor === Boolean){
                            item['type'] = 'boolean'
                        }else if (resJson[i].constructor === Array){
                            item['type'] = 'array'
                        }else if (resJson[i].constructor === Date){
                            item['type'] = 'date'
                        }else{
                            item['type'] = 'object'
                        }
                    }else{
                        item['type'] = 'object'
                    }

                    item['remark'] = ''
                    target.push(item);
                    if (null != resJson[i] && (item['type'] === 'object' || item['type'] === 'array')){
                        if (item['type'] === 'array'){
                            this.putJsonFieldForm([resJson[i][0]], target);
                        }else{
                            this.putJsonFieldForm(resJson[i], target);
                        }

                    }
                }
            },
            ansyRequestBody(){
                let resJson = JSON.parse(this.apiData.request.params.json);
                this.apiData.request.params.jsonDesc = [];
                this.putJsonFieldForm(resJson, this.apiData.request.params.jsonDesc)
            },
            selectItem: function (pageId) {
                this.pageLoading = true
                this.ser.post("api/page/info", {
                    page_id: pageId
                }).then(res => {
                    this.thisPageId = pageId
                    this.thisCatId = res.data.cat_id
                    this.jsonParamTab = 'json-body'
                    this.resultTab = 'body'
                    this.pageData.page_title = res.data.page_title
                    this.pageData.page_comments = res.data.page_comments
                    this.pageData.page_content = res.data.page_content
                    this.pageData.pageContent = JSON.parse(this.htmlDecode(res.data.page_content))
                    console.log(this.pageData.pageContent)
                    this.apiData = this.pageData.pageContent
                }).finally(() => {
                    this.pageLoading = false
                })


            },
            save(){
                this.ser.post("api/page/save", {
                    page_id: this.thisPageId,
                    item_id: this.$route.params.itemId,
                    page_title: this.pageData.page_title,
                    page_content: JSON.stringify(this.apiData),
                    is_urlencode: 1,
                    cat_id: this.thisCatId
                }).then(res => {
                    console.log(res)

                    let xhr = new XMLHttpRequest();
                    let data = {
                        "msg_type": "interactive",
                        "card": {
                            "config": {
                                "wide_screen_mode": true,
                                "enable_forward": true
                            },
                            "elements": [{
                                "tag": "div",
                                "text": {
                                    "content": "接口名称: " + this.pageData.page_title,
                                    "tag": "lark_md"
                                }
                            }, {
                                "tag": "div",
                                "text": {
                                    "content": "接口URI: " + this.apiData.info.url,
                                    "tag": "lark_md"
                                }
                            }, {
                                "tag": "div",
                                "text": {
                                    "content": "请求方式: " + this.apiData.info.method.toUpperCase(),
                                    "tag": "lark_md"
                                }
                            },  {
                                "actions": [

                                    {
                                        "tag": "button",
                                        "text": {
                                            "content": "查看详情",
                                            "tag": "lark_md"
                                        },
                                        "url": 'https://www.showdoc.com.cn/' + this.$route.params.itemId + '?page_id=' + this.thisPageId,
                                        "type": "default",
                                        "value": {}
                                    }],
                                "tag": "action"
                            }],
                            "header": {
                                "title": {
                                    "content": "新接口发布通知",
                                    "tag": "plain_text"
                                }
                            }
                        }
                    };

                    // 响应信息
                    xhr.onreadystatechange = () => {
                        if (xhr.readyState === 4){
                            if (xhr.status === 200){
                                this.$notify({
                                    title: '接口发布成功',
                                    message: '已同通过飞书机器人通知给所有开发人员'
                                });
                            }else{
                                this.$notify({
                                    title: '接口以保存但未通知',
                                    message: '未能连接到飞书机器人, 请手动通知所有开发人员'
                                });
                            }
                        }
                    }

                    // 请求与请求体
                    xhr.open(this.apiData.info.method, "https://open.feishu.cn/open-apis/bot/v2/hook/4be21371-ffb2-4566-8b24-392565f60755", false);
                    // 请求头
                    xhr.setRequestHeader("Content-Type", 'application/json;charset=utf-8');
                    xhr.send(JSON.stringify(data))
                })

            }
        },
        created() {
            this.ser.post("api/item/info", {
                item_id: this.$route.params.itemId,
                default_page_id: 0
            }).then(res => {
                this.itemName = res.data.item_name
            })
        }
    }
</script>

<style scoped>
    .page-list{
        /*position: fixed;*/
        /*top: 0;*/
        /*bottom: 0;*/
        /*left: 0;*/
        width: 300px;
        float: left;
        height: calc(100% - 20px);
        overflow-y: auto;
    }
    .page-info{
        float: right;
        top: 0;
        width: calc(100% - 320px);
        margin-right: 10px;
        margin-top: 10px;
        height: calc(100% - 20px);
        overflow-y: auto;
    }
    .head .el-input{
        margin-bottom: 10px;
    }
    .request-url{
        text-align: left;
    }
    .request-url .el-select{
        width: 100px;
    }
    .request-url .el-input{
        width: calc(100% - 265px);
        margin-left: 5px;
    }
    .request-url .el-button{
        width: 75px;
        margin-left: 5px;
    }
    .header-item .head-name{
        width: 200px;
    }
    .header-item .head-value{
        width: calc(100% - 260px);
        margin-left: 10px;
        margin-right: 10px;
    }
    .result-item{
        margin-bottom: 10px;
    }
    .result-item .item{
        width: calc(calc(100% - 80px) / 3);
        margin-right: 10px;
    }
    .response-box{
        border-top: solid #c0d4fa 1px;
        margin-top: 10px;
    }
    .response-box .response-status{
        color: green;
    }
    .response-box .response-status.err{
        color: red;
    }

</style>
<style>
    .req .CodeMirror.cm-s-monokai{
        height: 200px;
    }
</style>