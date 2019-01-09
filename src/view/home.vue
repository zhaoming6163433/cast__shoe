<template>
  <div class="home">
        <div class="roomlist">
            <div v-for="(item,index) in roomlist" :key="index" class="roomitem" @click="gotodetail(item)">
                <span>{{item.roominfo.roomname}}</span>
                <span>{{item.roominfo.thingdesc}}</span>
            </div>
        </div>
        <div class="addroom" @click="createroom"><img src="../../static/img/icon_jia.png"/></div>
        <createroom  ref="createroom"></createroom>
  </div>
</template>

<script>
import util from 'src/util/util.js'
import { get_healthInformationCategoryList } from 'src/model/api.js'
import createroom from 'components/createroom'

export default {
    name: 'home',
    props: [],
    data() {
        return {
            infomation: "",
            socket: "",
            roomlist:[]//房间列表
        }
    },
    components: {
        createroom
    },
    created() {

    },
    methods: {
        //获取房间列表
        get_info() {
            this.socket.emit('getroomlist');
            this.socket.on('roomlist',  (data)=> {
                this.roomlist = data;
            });
        },
        //创建房间
        createroom(){
            this.$refs["createroom"].showcreateroom();
        },
        //房间详情
        gotodetail(item){

        }
    },
    mounted() {
        this.socket = util.vueSocket;
        this.get_info();
        //告诉服务器端有用户进入
        // this.socket.emit('joinroom', {roomid:"1"});
        // this.socket.emit('joinroom', {roomid:"2"});
        // this.socket.emit('joinroom', {roomid:"1"});
        // this.socket.on('news', function (data) {
        //     console.log(data);
        // });
        // setTimeout(()=>{
        //     this.socket.emit('logout', {roomid:"1"});
        // },1000)
    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    .home{
        .roomlist{
            display: flex;
            flex-direction:row;
            flex-wrap:wrap;
            justify-content:space-between;
            padding:1rem;
            .roomitem{
                width:28%;
                height:6rem;
                margin-top:1rem;
                padding: 0.5rem;
                box-shadow: 0px 1px 3px rgb(190, 190, 190);
                background-color: #FFFFFF;
                border: 1px solid #CCC;
                border-radius: 1rem;
                span:nth-child(1){
                    font-size:1.4rem;
                }
                span:nth-child(2){
                    margin-top:.5rem;
                    font-size:1.2rem;
                    word-break:break-all;
                    display:-webkit-box;
                    -webkit-box-orient:vertical;
                    text-overflow:ellipsis;
                    overflow:hidden;
                    -webkit-line-clamp:2;
                }
            }
        }
        .addroom{
            position: absolute;
            width:2.5rem;
            height:2.5rem;
            border-radius: 100%;
            background-color:$blue_c;
            bottom:2rem;
            right:2rem;
            img{
                width:100%;
            }
        }
    }
</style>
