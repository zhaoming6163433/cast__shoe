<template>
  <div class="createroom">
      <mt-popup
        id="popcreateroom"
        v-model="popupVisible"
        :closeOnClickModal="closeOnClickModal"
        position="top"
        popup-transition="popup-fade">
            <div class="roomtitle">创建房间</div>
            <div class="mycontent">
                <mt-field label="房间名称" placeholder="请输入房间名称" v-model="roomname"></mt-field>
                <mt-field label="事情描述" placeholder="请输入事情描述" v-model="thingdesc"></mt-field>
                <mt-field v-for="(item,index) in addthinglist" :key="index" class="thingsel" :label="`事情选项${index+1}`" placeholder="请输入事情选项"  v-model="addthinglist[index].addthingsel">
                    <div class="addthing" v-if="index==addthinglist.length-1" @click="addthing"><img src="../../static/img/icon_jia.png"/></div>
                    <div class="addthing" v-if="(index==addthinglist.length-1)&&index>0" @click="minusthing"><img src="../../static/img/icon_jian.png"/></div>
                </mt-field>
                <mt-button class="mybtn" type="primary" size="small" @click="submit">确定</mt-button>
                <mt-button class="mybtn" type="default" size="small" @click="cancel">取消</mt-button>
            </div>
        </mt-popup>
  </div>
</template>

<script>
import util from 'src/util/util.js'
export default {
    name: 'createroom',
    props: [],
    data() {
        return {
            closeOnClickModal:false,
            popupVisible:false,
            roomname:"",
            thingdesc:"",
            addthinglist:[{}]
        }
    },
    components: {

    },
    created() {

    },
    methods: {
        //展示创建房间
        showcreateroom(){
            this.popupVisible = true;
        },
        //添加事情选项
        addthing(){
            this.addthinglist.push({});
            this.$nextTick(function(){
            var div = document.getElementById('popcreateroom');
                div.scrollTop = div.scrollHeight;
            })
        },
        //删除事件选项
        minusthing(){
            this.addthinglist.pop();
        },
        //提交创建房间
        submit(){
            var params={roomname:this.roomname,thingdesc:this.thingdesc,addthinglist:this.addthinglist};
            util.vueSocket.emit('createroom',params);
            Object.assign(this.$data, this.$options.data());
            this.popupVisible = false;
        },
        //取消
        cancel(){
            Object.assign(this.$data, this.$options.data());
            this.popupVisible = false;
        }
    },
    mounted() {

    }
}

</script>
<style lang="scss">
    .mint-popup,.mint-popup-top{
        width: 94%;
        max-height: 96%;
        border-radius:1rem;
        margin-top:1rem;
        border-radius:1rem;
        overflow-x: hidden;
    }
</style>
<style lang="scss" scoped>
    .createroom{
        .roomtitle{
            font-size:1.6rem;
            font-weight:bold;
            margin:1rem 0;
            color:$deep_c;
        }
        .mycontent{
            .thingsel{
                width:90%
            }
            .addthing{
                display: inline-block;
                margin-left:10px;
                background-color:$blue_c;
                height: 24px;
                border-radius:1rem;
            }
            .mybtn{
                box-sizing:inherit;
                margin:1rem;
            }
        }
    }
</style>
