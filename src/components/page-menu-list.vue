<template>
    <div>
        <el-submenu v-for="catalog in menu.catalogs" :key="catalog.cat_id" :index="catalog.cat_id">
            <template slot="title">
                <i class="el-icon-folder"></i>
                <span v-text="catalog.cat_name"></span>
            </template>
            <page-menu-list :menu="catalog" :on-select="onSelect" :item-id="itemId" :parent-cat-id="catalog.cat_id"></page-menu-list>
        </el-submenu>
        <el-menu-item v-for="page in menu.pages" @click="onSelect(page.page_id)"
                      :key="page.cat_id + '-' + page.page_id"
                      :index="page.cat_id + '-' + page.page_id">
            <i class="el-icon-document"></i>
            <span slot="title" v-text="page.page_title"></span>
        </el-menu-item>
        <div style="text-align: center;" class="new-btn" @click="openCreate(itemId, parentCatId)">
            <div><i class="el-icon-document-add"></i></div>
        </div>

        <el-dialog
                title="新增"
                :visible.sync="dialogVisible"
                width="400px">

            <div style="margin-bottom: 20px">
                <el-radio v-model="createType" label="folder">新建目录</el-radio>
                <el-radio v-model="createType" label="api">新建接口</el-radio>
                <el-radio v-model="createType" label="doc">新建文档</el-radio>
            </div>
            <el-input v-model="createName" placeholder="请输入名称"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="createItem">确 定</el-button>
              </span>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        name: "page-menu-list",
        props: {
            menu: Object,
            onSelect: Function,
            itemId: String,
            parentCatId: String
        },
        data(){
            return {
                form: {},
                dialogVisible: false,
                createType: 'folder',
                createName: ''
            }
        },
        methods: {
            openCreate(item_id, parent_cat_id){
                console.log(item_id + "---" + parent_cat_id);
                this.dialogVisible = true
            },
            createItem(){
                if (!this.createName){
                    this.$message.error('名称不能为空');
                    return;
                }
                if (this.createType === 'folder'){
                    this.ser.post("api/catalog/save", {
                        item_id: this.itemId,
                        cat_id: '',
                        parent_cat_id: this.parentCatId,
                        cat_name: this.createName
                    }).then(res => {
                        this.menu.catalogs.push({
                            item_id: this.itemId,
                            cat_id: res.data,
                            parent_cat_id: this.parentCatId,
                            cat_name: this.createName
                        })
                    }).finally(() => {
                        this.dialogVisible = false
                    })
                }else if (this.createType === 'api'){
                    let data = {
                        extend: {},
                        info: {
                            description: this.createName,
                            from: 'runapi',
                            method: 'get',
                            remark: '',
                            title: '',
                            type: 'api',
                            url: ''
                        },
                        request: {
                            auth: [],
                            cookies: [],
                            headers: [
                                {
                                    name: "Content-Type",
                                    value: 'application/json'
                                },
                                {
                                    name: "Authorization",
                                    value: ''
                                }
                            ],
                            params: {
                                formdata: [],
                                json: '{}',
                                jsonDesc: [],
                                mode: 'json',
                                urlencoded: []
                            }
                        },
                        response: {
                            remark: '',
                            responseExample: '{}',
                            responseHeader: {},
                            responseOriginal: '{}',
                            responseParamsDesc: [],
                            responseText: '{}'
                        }
                    }
                    this.ser.post("api/page/save", {
                        page_id: 0,
                        item_id: this.itemId,
                        page_title: this.createName,
                        page_content: JSON.stringify(data),
                        is_urlencode: 1,
                        cat_id: this.parentCatId
                    }).then(res => {
                        this.menu.pages.push({
                            item_id: this.itemId,
                            page_id: res.data.page_id,
                            cat_id: this.parentCatId,
                            page_title: this.createName
                        })
                        this.onSelect(res.data.page_id)
                    }).finally(() => {
                        this.dialogVisible = false
                    })
                }else{
                    this.ser.post("api/page/save", {
                        page_id: 0,
                        item_id: this.itemId,
                        page_title: this.createName,
                        page_content: '# hello world!',
                        is_urlencode: 1,
                        cat_id: this.parentCatId
                    }).then(res => {
                        this.menu.pages.push({
                            item_id: this.itemId,
                            page_id: res.data.page_id,
                            cat_id: this.parentCatId,
                            page_title: this.createName
                        })
                        this.onSelect(res.data.page_id)
                    }).finally(() => {
                        this.dialogVisible = false
                    })
                }

            }
        },
        created() {
            console.log(this.menu)
        }
    }
</script>

<style scoped>
    .new-btns{
        display: inline-block;
        width: 50%;
        height: 40px;
        line-height: 40px;
        background-color: rgba(0,0,0,.03);
        cursor: pointer;
    }
    .new-btns:hover{
        background-color: rgba(0,0,0,.08);
    }
    .new-btn{
        background-color: rgba(0,0,0,.03);
        height: 40px;
        line-height: 40px;
        cursor: pointer;
    }
    .new-btn:hover{
        background-color: rgba(0,0,0,.08);
    }
</style>