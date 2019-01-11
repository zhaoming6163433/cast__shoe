<template>
  <div class="home">
        <div class="roomlist">
            <div v-for="(item,index) in roomlist" :key="index" class="roomitem" @click="gotodetail(item)">
                <span>{{item.roominfo.roomname}}</span>
                <span>{{item.roominfo.thingdesc}}</span>
                <div class="roomflag">状态：{{item.roomflag|roomstate}}</div>
                <mt-button v-if="item.createrip==userip&&item.roomflag==0" class="jiezhibtn" type="default" size="small" @click="stoproom(item,$event)">终止投票</mt-button>
                <div v-if="item.createrip==userip" class="delroom" @click="delroom(item,$event)"><img src="../../static/img/delete.png"/></div>
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
            userip:"",
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
            this.socket.on('roomlist',  (data,ip)=> {
                if(ip!=undefined){
                    this.userip = ip;
                }
                this.roomlist = data;

            });
        },
        //创建房间
        createroom(){
            this.$refs["createroom"].showcreateroom();
        },
        //房间详情
        gotodetail(item){
            this.$router.push({"name":"room",query:{roomid:item.roomid}});
        },
        //删除房间
        delroom(item,e){
            e.stopPropagation();
            this.$messagebox.confirm('删除后不可恢复，确认删除此房间？','').then(() => {
                this.socket.emit('delroom',item);
            },() => {

            });
        },
        //终止投票
        stoproom(item,e){
            e.stopPropagation();
            this.$messagebox.confirm('终止后不可恢复且进入房间后方可选择生成结果，确定终止吗？','').then(() => {
                this.socket.emit('stoproom',item);
            },() => {

            });
        }
    },
    mounted() {
        this.socket = util.vueSocket;
        this.get_info();
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
            justify-content:space-around;
            padding:1rem;
            margin-bottom:5rem;
            .roomitem{
                width:100%;
                height:7.5rem;
                margin-top:1rem;
                padding: 0.5rem;
                box-shadow: 0px 1px 3px rgb(190, 190, 190);
                background: rgba(255,255,255,0.8);
                border: 1px solid #CCC;
                border-radius: 1rem;
                position: relative;
                .jiezhibtn{
                    height: 2rem;
                    font-size: 1.2rem;
                    width: 7rem;
                    position: absolute;
                    right:4rem;
                    bottom:0.5rem;
                }
                .roomflag{
                    position:absolute;
                    bottom:0.5rem;
                    font-size:1.2rem;
                    color:$grey_c;
                }
                span:nth-child(1){
                    font-size:1.6rem;
                    width: 100%;
                    display:-webkit-box;
                    -webkit-box-orient:vertical;
                    text-overflow:ellipsis;
                    overflow:hidden;
                    -webkit-line-clamp:1;
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
                .delroom{
                    position: absolute;
                    width: 2rem;
                    bottom:0;
                    right:1rem;
                    img{
                        width:100%;
                    }
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
