<template>
  <div class="castshoe">
    <canvas id="castshoe"><span>不支持canvas浏览器</span></canvas>
    <div class="progress" v-show="proflag">
        <div class="loadtext">加载中...</div>
        <mt-progress :value="progress" :bar-height="20"></mt-progress></div>
  </div>
</template>

<script>
import castimg from 'static/img/castimg.png'
import topFlare from 'static/img/topFlare.png'
import btn2 from 'static/img/btn2.png'
import btn from 'static/img/btn.png'
import back from 'static/img/back.png'
import sound from 'static/audio/sound.mp3'
import util from 'src/util/util.js'


export default {
    name: 'castshoe',
    props: [],
    data() {
        return {
            roomid:"",
            proflag:true,
            progress:0,
            oGC: {},
            hoptext:"开始!",
            innerw:"",
            innerh:"",
            canvasw:"",
            canvash:"",
            flagdrawrenwu:false,//是否展示人物
            flagdrawstart:true,//是否展示开始按钮
            playbackmusic:"",
            startbtninfo:{//开始按钮的信息
                positionx:"",
                positiony:"",
                imgw:"",
                imgh:""
            },
            gamesetdefault: {//游戏默认设置
                gamespeed: 1.2 //总体速度
            }
        }
    },
    components: {

    },
    created() {

    },
    methods: {
        setcanvas() {
            var oC = document.getElementById('castshoe');
            //绑定touch事件
            oC.addEventListener('touchstart', this.touchstartfn, false);
            //图片缩放比例
            oC.scaleratio = 1;
            //屏幕比例系数
            var scaleserise = 375 / 667;
            //屏幕宽度
            this.innerw = document.documentElement.clientWidth>1024?1024:document.documentElement.clientWidth;
            //屏幕高度
            this.innerh = document.documentElement.clientHeight;

            oC.height = this.innerh;
            oC.width = this.innerw;
            var margintop = (this.innerh - oC.height) / 2;
            oC.scaleratio = oC.width / 375 * 1;
            oC.setAttribute('style', 'margin-top: ' + margintop + 'px');

            this.canvasw = oC.width;
            this.canvash = oC.height;
        },
        draw(showrenwu,lightbtn,showback) {
            //屏幕宽度
            this.innerw = document.documentElement.clientWidth;
            //屏幕高度
            this.innerh = document.documentElement.clientHeight;
            //清屏
            this.oGC.clearRect(0, 0, this.innerw, this.innerh);
            //填充方形
            this.oGC.fillRect(0, 0, this.innerw, this.innerh);
            //画背景
            showback.main();
            //画开始按钮
            if(this.flagdrawstart){
                lightbtn.main();
            }
            //画人物
            if(this.flagdrawrenwu){
                showrenwu.main();
            }
            requestAnimationFrame(() => {
                this.draw(showrenwu,lightbtn,showback)
            });
        },
        initshow(){
            this.flagdrawrenwu = false;
            this.flagdrawstart = true;
        },
        touchstartfn(event){
            if(this.flagdrawstart){
                if(this.hoptext.indexOf("结果")!=-1){
                    clearInterval(this.playbackmusic);
                    this.$router.replace({"name":"room",query:{roomid:this.roomid}});
                    return;
                }
                this.sendresult();
                util.vueSocket.on('roominfo', (data, ip) => {
                    this.hoptext = "结果："+data.roomresult.addthingsel;
                });
                var oC = document.getElementById('castshoe');
                var touch = event.targetTouches;
                for(var i=0;i<touch.length;i++){
                    var _x = touch[i].pageX-oC.offsetLeft;
                    var _y = touch[i].pageY-oC.offsetTop;
                    //判断是否点击开始
                    var startx = Math.abs(_x-this.startbtninfo.positionx);
                    var starty = Math.abs(_y-this.startbtninfo.positiony);
                    if(startx<this.startbtninfo.imgw/2&&starty<this.startbtninfo.imgh/2){
                        this.playmusic("startGame");
                        this.initshow();
                        this.flagdrawrenwu = true;
                        this.flagdrawstart = false;
                    }
                }
            }
        },
        //初始化音乐文件
        initmusic(){
            this.sound = new Howl({
                urls: [sound],
                sprite: {
                    hitBlock: [0, 950],
                    gem:  [1000,3500],
                    gem0: [1000, 700],
                    gem1: [2000, 700],
                    gem2: [3000, 700],
                    gem3: [4000, 700],
                    click: [5000, 400],
                    collectPowerUp: [5500, 1200],
                    fall: [7000, 2000],
                    boost: [9500, 1200],
                    startGame: [11500, 1200],
                    jump: [13000, 800],
                    makeTurn: [14000, 700],
                    sideStep: [15000, 500],
                    duck: [16000, 600],
                    powerUpEnd: [17000, 600]
                }
            });
        },
        //播出音乐
        playmusic(G){
            this.sound.play(G);
        },
        //调用产生随机结果
        sendresult(){
            util.vueSocket.emit('randomresult', { roomid: this.roomid});
        }
    },
    mounted() {
        this.roomid = this.$route.query.roomid;
        var thisview = this;
        this.setcanvas();
        //适配
        window.onresize = () => {
            window.requestAnimationFrame(() => {
                this.setcanvas();
            });
        }
        window.addEventListener('resize', () => {
            window.requestAnimationFrame(() => {
                this.setcanvas();
            });
        })

        var oC = document.getElementById('castshoe');
        this.oGC = oC.getContext('2d');
        this.oGC.fillRect(0, 0, oC.width, oC.height);
        var imgobj = {
            "renwu": castimg,
            "faguang": topFlare,
            "hop": btn2,
            "startbtn": btn,
            "back": back
        };

        //加载后的图片对象
        var loadedimgobj = {};

        //画背景
        function Showback(){}
        Showback.prototype = {
            init(){

            },
            main(){
                let backw = loadedimgobj.back.width;
                let backh = loadedimgobj.back.height;
                let w = "",h="",px="",py="";
                if(backw/backh>thisview.canvasw/thisview.canvash){
                    h = thisview.canvash;
                    w = thisview.canvash*(backw/backh);
                    px = (thisview.canvasw-w)/2;
                    py = 0;
                }else{
                    h = thisview.canvasw/(backw/backh);
                    w = thisview.canvasw;
                    px = 0;
                    py = 0;
                }
                thisview.oGC.drawImage(loadedimgobj.back, 0, 0, backw, backh, px, py, w, h);
            }
        }

        //画人物函数
        function Showrenwu() { }
        Showrenwu.prototype = {
            init() {
                this.imgcutx = 0;//x图片切图位置初始值
                this.imgcuty = 0;//y图片切图位置初始值
                this.positionx = 0;//x偏移量初始值
                this.positiony = 0;//y偏移量初始值
                this.imgspeed = 0;//图片切换速度初始化
                this.speed = 7 / thisview.gamesetdefault.gamespeed;//速度
            },
            changeimg() {
                //判断图片切换
                if(this.imgcuty<8){
                    this.imgcutx++;
                    if (this.imgcutx == 3) {
                        this.imgcutx = 0;
                        this.imgcuty++;
                        if (this.imgcuty >= 8) {
                            this.imgcuty = 0;
                            thisview.flagdrawstart = true;
                            thisview.flagdrawrenwu = false;
                            thisview.playmusic("boost");
                        }
                    }
                }
            },
            draw(renwu) {
                //控制图片切换速度
                this.imgspeed++;
                var positionx = oC.width / 2 - oC.scaleratio * 199 / 2;
                var positiony = oC.height / 2 - oC.scaleratio * 197.5 / 2;
                thisview.oGC.drawImage(loadedimgobj.renwu, this.imgcutx * 199, this.imgcuty * 198, 199, 196, positionx, positiony, 1.2*oC.scaleratio * 199, 1.2*oC.scaleratio * 197.5);
                //自定义图片变换速度
                if (this.imgspeed > this.speed) {
                    //判断第几张图片切换图片
                    this.changeimg();
                    this.imgspeed = 0;
                }
            },
            main() {
                this.draw(loadedimgobj.renwu);
            }
        }

        //画光线和按钮
        function Lightbtn(){}
        Lightbtn.prototype = {
            init(){
                this.guangxiannum = 0;//光线旋转度数
                this.startbtnnum = 1;//开始按钮控制变换倍数
                this.btnflag = true;//同上
                this.imgspeed = 0;//图片切换速度初始化
                this.speed = 2 / thisview.gamesetdefault.gamespeed;//速度
                this.positionx2 = 0;//按钮x的偏移量
                this.positiony2 = 0;//按钮y的偏移量
            },
            drawhop(){
                thisview.oGC.save();
                let imgw1 = 0.7*oC.scaleratio *loadedimgobj.hop.width;
                let imgh1 = 0.7*oC.scaleratio *loadedimgobj.hop.height;
                let positionx1 = thisview.canvasw/2-0.7*oC.scaleratio *loadedimgobj.hop.width/2;
                let positiony1 = thisview.canvash/2-0.7*oC.scaleratio *loadedimgobj.hop.height;
                thisview.oGC.drawImage(loadedimgobj.hop,0, 0,loadedimgobj.hop.width, loadedimgobj.hop.height, positionx1,positiony1, imgw1, imgh1);
                thisview.oGC.restore()
            },
            drawrotate(){
                thisview.oGC.save();
                this.guangxiannum = this.guangxiannum +0.7;
                if(this.guangxiannum>=360){
                    this.guangxiannum = 0;
                }
                let imgw = oC.scaleratio *loadedimgobj.faguang.width;
                let imgh = oC.scaleratio *loadedimgobj.faguang.height;

                let positionx = -oC.scaleratio *loadedimgobj.faguang.width/2;
                let positiony = -oC.scaleratio *loadedimgobj.faguang.height/2;
                thisview.oGC.translate(thisview.canvasw/2,thisview.canvash/2.5);
                thisview.oGC.rotate(this.guangxiannum*Math.PI/90);
                //画光线
                thisview.oGC.drawImage(loadedimgobj.faguang, 0, 0, loadedimgobj.faguang.width, loadedimgobj.faguang.height, positionx,positiony, imgw, imgh);
                thisview.oGC.restore();
            },
            drawtext(){
                let fontsize = 25*oC.scaleratio;

                thisview.oGC.save();

                thisview.oGC.font = fontsize+'px impact';

                thisview.oGC.textBaseline='top';

                thisview.oGC.fillStyle = "#ffffff";

                thisview.oGC.strokeStyle = "#ffffff";

                //阴影 默认黑色透明
                thisview.oGC.shadowOffsetX = 2;
                thisview.oGC.shadowOffsetY = 2;
                thisview.oGC.shadowBlur = 2;
                thisview.oGC.shadowColor = '#000000';

                var w = thisview.oGC.measureText(thisview.hoptext).width;
                thisview.oGC.fillText(thisview.hoptext,(thisview.canvasw - w)/2,thisview.canvash/2-0.7*oC.scaleratio *loadedimgobj.hop.height/2+25*oC.scaleratio);

                thisview.oGC.restore();
            },
            drawbtn(){
                thisview.oGC.save();
                let imgw2 = 0.5*oC.scaleratio *loadedimgobj.startbtn.width;
                let imgh2 = 0.5*oC.scaleratio *loadedimgobj.startbtn.height;

                if (this.imgspeed > this.speed) {
                    if(this.startbtnnum >= 1.2){
                        this.btnflag = false;
                    }
                    if(this.startbtnnum <= 0.8){
                        this.btnflag = true;
                    }
                    if(this.btnflag){
                        this.startbtnnum = this.startbtnnum+0.1;
                    }else{
                        this.startbtnnum = this.startbtnnum-0.1;
                    }
                    this.imgspeed = 0;
                    this.positionx2 = thisview.canvasw/2-imgw2/(2*this.startbtnnum);
                    this.positiony2 = thisview.canvash/1.8-imgh2*(this.startbtnnum-1)/2;

                    thisview.startbtninfo.positionx = this.positionx2+imgw2/this.startbtnnum/2;
                    thisview.startbtninfo.positiony = this.positiony2+imgh2*this.startbtnnum/2;
                    thisview.startbtninfo.imgw = imgw2/this.startbtnnum;
                    thisview.startbtninfo.imgh = imgh2*this.startbtnnum;
                }

                thisview.oGC.drawImage(loadedimgobj.startbtn,0, 0,loadedimgobj.startbtn.width, loadedimgobj.startbtn.height, this.positionx2,this.positiony2, imgw2/this.startbtnnum, imgh2*this.startbtnnum);
                thisview.oGC.restore();
            },
            main(){
                this.imgspeed++;
                //光线旋转
                this.drawrotate();
                //画hop
                this.drawhop();
                //画提示语
                this.drawtext();
                //画按钮
                this.drawbtn();
            }
        }

        var showrenwu = new Showrenwu();
        var lightbtn = new Lightbtn();
        var showback = new Showback();
        showrenwu.init();
        lightbtn.init();
        this.initmusic();

        //进度条每次加载图片增加的
        var imgobjarr = Object.keys(imgobj);
        let proinit = parseInt(100/imgobjarr.length);
        for (var k in imgobj) {
            var loadindex = 0;
            loadedimgobj[k] = new Image();
            loadedimgobj[k].src = imgobj[k];
            loadedimgobj[k].onload = () => {
                loadindex++;
                thisview.progress = thisview.progress+proinit;
                if (loadindex == 5) {
                    thisview.playmusic("gem");
                    thisview.playbackmusic = setInterval(()=>{
                        thisview.playmusic("gem");
                    },8000);
                    thisview.proflag = false;
                    thisview.progress = 100;
                    //全部加载完开始画
                    thisview.draw(showrenwu,lightbtn,showback);
                }
            }
        }
    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
#castshoe {
    display: block;
    margin: 0 auto;
}
.castshoe {
    width: 100%;
    height: 100%;
    position: absolute;
    .progress{
        position: absolute;
        top: 50%;
        width: 100%;
        .loadtext{
            color: #000000;
            position: relative;
            top: 25px;
            z-index: 1;
        }
    }
}
</style>
