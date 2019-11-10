<template>
  <div class="room">
      <div class="title">{{info.roominfo&&info.roominfo.thingdesc}}</div>
      <div v-show="selinfo1">
        <div class="selanswer">
                <mt-radio
                v-model="thingval"
                :options="options">
                </mt-radio>
        </div>
        <div class="submit" v-show="showsubmit">
                <mt-button type="default" size="small" @click="submit">提交</mt-button>
                <mt-button type="default" size="small" @click="goback()">返回</mt-button>
        </div>
      </div>
      <div v-show="selinfo2" class="selinfo2">
          <div class="activend" v-if="info.roomflag==1"><img src="../../static/img/activend.png" ></div>
          <ul>
              <li v-for="(item,index) in addthinglist" :key="index">
                  <div class="title2">{{item.addthingsel}}</div>
                  <div class="selnum">
                      <div class="selin" v-bind:style="{ width: item.width}"></div>
                      <span class="rightspan" >{{item.num}}票</span><img v-if="item.width!='0%'" v-bind:style="{ left: item.width}" src="../../static/img/viplinght.png"/>
                  </div>
              </li>
          </ul>
      </div>
      <div class="result animated flash" v-if="info.roomresultflag"><div>最终结果</div><div>{{info.roomresult&&info.roomresult.addthingsel}}</div></div>
      <div v-if="info.createrip==ip&&info.roomflag==1&&info.roomresultflag!=true" class="resultyes">
          <mt-button type="default" size="small" @click="zhijieresult">直接产生结果</mt-button>
          <mt-button type="default" size="small" @click="suijiresult">随机产生结果</mt-button>
      </div>
  </div>
</template>

<script>
import util from 'src/util/util.js'
import appConfigs from 'src/configs'

export default {
    name: 'room',
    props: [],
    data() {
        return {
            ip: "",
            selinfo1: false,
            selinfo2: false,
            showsubmit: false,
            thingval: "",
            roomid: "",
            addthinglist: [],
            info: {},
            options: []
        }
    },
    components: {

    },
    created() {

    },
    methods: {
        submit() {
            //提交后修改房间信息然后分发各个用户roominfo
            util.vueSocket.emit('submitroom', { roomid: this.roomid, thingval: this.thingval });
        },
        //直接产生结果
        zhijieresult(){
            this.$messagebox.confirm('确定要根据投票结果选出最多票数并在最多票数中产生结果？','').then(() => {
                util.vueSocket.emit('zhijieresult', { roomid: this.roomid});
            },() => {

            });
        },
        //随机产生结果
        suijiresult(){
            this.$messagebox.confirm('确定跳转到随机游戏来根据权重值随机生成结果吗','').then(() => {
                this.$router.replace({"name":"castshoe",query:{roomid: this.roomid}});
            },() => {

            });
        }
    },
    mounted() {
        let thisview = this;
        this.roomid = this.$route.query.roomid;
        if(util.vueSocket) util.vueSocket.disconnect();
        //加入房间
        util.vueSocket = io.connect(appConfigs.urlWebHttp);
        util.vueSocket.emit('joinroom', { roomid: this.roomid });
        //加入后展示房间信息
        util.vueSocket.on('roominfo', (data, ip) => {
            console.log(data)
            this.ip = ip;
            document.title = data.roominfo.roomname;
            this.info = data;
            let arr = [];
            let totalnum = 0;
            data.roominfo.addthinglist.forEach(item => {
                arr.push({ label: item.addthingsel, value: item.id });
                totalnum = totalnum + item.num;
                item.width = "0";
            });
            this.options = arr;
            this.showsubmit = true;
            //如果包含ip说明已经选择过了
            if (data.selectediparr.indexOf(ip) > -1||data.roomflag==1) {
                this.selinfo2 = true;
                this.selinfo1 = false;
            } else {
                this.selinfo1 = true;
                this.selinfo2 = false;
            }
            thisview.addthinglist = data.roominfo.addthinglist;
            let _arrlist = data.roominfo.addthinglist;
            setTimeout(() => {
                _arrlist.forEach(item => {
                    if(totalnum==0){
                        item.width = '0%';
                    }else{
                        item.width = (item.num / totalnum) * 100 + "%";
                    }
                });
                thisview.addthinglist = [];
                thisview.addthinglist = _arrlist;
            }, 10);
        });
    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.mint-radiolist .mint-cell{
    background: rgba(255,255,255,0.3);
}
.mint-cell-wrapper{
    background-image:none;
}
</style>
<style lang="scss" scoped>
.room {
    background: url("../../static/img/vipback.png") repeat;
    background-size: 100%;
    width: 100%;
    height: 100%;
    .title {
        font-size: 2rem;
        padding: 2rem 1rem;
        text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #30020e,
            0 0 40px #ff0000, 0 0 70px #ff0000, 0 0 80px #ff0000,
            0 0 100px #ff0000, 0 0 150px #ff0000;
        color: #fff;
    }
    .selanswer {
        color:#fff;
        text-align: left;
    }
    .submit {
        > button {
            margin: 2rem 1rem;
        }
    }
    .selinfo2 {
        text-align: left;
        .activend{
            position: absolute;
            top:10rem;
            left:11rem;
            width:15rem;
            img{
                width:100%;
                opacity:0.5;
            }
        }
        .title2 {
            text-align:right;
            margin-top: 1rem;
            margin-bottom: 2rem;
            margin-left: 1rem;
            display: inline-block;
            text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #30020e,
                0 0 40px #ff0000, 0 0 70px #ff0000, 0 0 80px #ff0000,
                0 0 100px #ff0000, 0 0 150px #ff0000;
            color: #fff;
            width: 8rem;
        }
        .selnum {
            width: 50%;
            height: 0.5rem;
            display: inline-block;
            position: relative;
            img {
                position: absolute;
                top: -0.4rem;
                left: 0;
                margin-left: -2rem;
                width: 2.5rem;
                transition: left 1s;
            }
            .selin {
                width: 0%;
                background-color: #fff;
                height: 0.3rem;
                border-radius: 3rem 3rem 3rem 3rem;
                transition: width 1s;
            }
            .rightspan {
                display: inline-block;
                float: right;
                position: relative;
                top: -0.8rem;
                left: 3rem;
                color: #fff;
                font-size: 1.2rem;
            }
        }
    }
    .resultyes{
        position: absolute;
        bottom:1rem;
        width: 100%;
        text-algin:center;
        button{
            background-color: rgba(255,255,255,0.8);
        }
    }
    .result{
            top:40%;
            width: 15rem;
            position: absolute;
            background-color: rgba(255,255,255,0.3);
            border-radius: 1rem;
            font-size: 3rem;
            color: #fff;
            text-align: center;
            left: 50%;
            margin-left: -7.5rem;
            >div{
                word-wrap:break-word;
            }
            animation-duration:4s;
            animation-iteration-count: infinite;
    }
}
</style>
