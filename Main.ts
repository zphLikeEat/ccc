import { UIManager } from "./core/ui/UIManager";
import { UIID, SceneLayer } from "./core/ui/UIConst";
import { Component, game, math, Node, Quat, sys, System, Vec3, _decorator } from "cc";
import { NetCenter } from "./core/net/NetCenter";
import { MathUtils } from "./core/Utils/MathUtils";
import { GameConst } from "./core/const/GameConst";
import { gzalog, phlog } from "./core/Utils/Log";
import { ObjectPool } from "./core/Utils/ObjectPool";
import cfgmgr from "./core/Wconfig/config/loadcfg";
import { CommonUtils } from "./core/Utils/CommonUtils";
import { DEV } from "cce.env";
const { ccclass, property } = _decorator

declare var window: Window & { __errorHandler: any };

@ccclass
export default class Main extends Component {
    @property(Node)
    public ball: Node = null;
    @property(Node)
    public target: Node = null;

    private cha = 0;
    private chaz = 0;
    start() {
        //初始化设置
        game.setFrameRate(30);

        this.listenErrorInfoTips();

        this.loadConfig();

        let cha = (this.ball.position.x - this.target.position.x) / 100;
        let chaz = (this.ball.position.z - this.target.position.z) / 100;

        let r = MathUtils.calc_angle(this.ball.position.x, this.ball.position.z, this.target.position.x, this.target.position.z);
        let q: Quat = ObjectPool.getObjectByClass("Quat", Quat);
        MathUtils.rotateBy2D(q, r + GameConst.rotation_offset);
        this.ball.setRotation(q);
        ObjectPool.recover("Quat", q);

        this.cha = cha;
        this.chaz = chaz;
        // UIManager.getInstance().open(UIID.CommonTipsDialog, SceneLayer.Tips);
        NetCenter.getInstance().test();
        NetCenter.getInstance().test2();
        
    }

    async loadConfig() {
        await cfgmgr.load();
        gzalog(cfgmgr.testdata, cfgmgr.testdata.get(1), cfgmgr.testsingle.x);
    }

    update() {
        let cha = (this.ball.position.x - this.target.position.x);
        let chaz = (this.ball.position.z - this.target.position.z)
        // this.ball.setPosition(new math.Vec3(, this.ball.position.y, this.ball.position.z - this.chaz));
        let v3 = ObjectPool.getObjectByClass("Vec3", Vec3);
        v3.x = this.ball.position.x - this.cha;
        v3.y = this.ball.position.y;
        v3.z = this.ball.position.z - this.chaz;
        this.ball.setPosition(v3);
        ObjectPool.recover("Vec3", v3);
        if (Math.abs(cha) < 5) {
            this.ball.setPosition(new math.Vec3(0, 0, 0));
        }
    }

    //全局错误信息同步
    listenErrorInfoTips(){
        if(sys.isNative && DEV) {   // 本地模拟器
            window.__errorHandler = function(errorMessage, file, line, message, error) {
                let exception = [
                    errorMessage = errorMessage,
                    file = file,
                    line = line,
                    message = message,
                    error = error,
                ];
                let exception1 = JSON.stringify(exception);
                console.error(exception1);
                setTimeout(function(){ //延迟一帧调用
                    if (!!error && !!error.stack){
                        //错误堆栈信息
                        let stackInfo = error.stack.toString();
                        phlog(stackInfo+"\nextraInfo:\n    "+exception1);
                        phlog(arguments);
                    }
                },0);
                // //上传服务器
                //  var url = "http://10.21.215.240:1001/client3/errorlog"
                //  var xhr = new XMLHttpRequest();
                //  xhr.open("post",url);
                //  xhr.setRequestHeader("Content-Type", "application/json");
                //  xhr.send(exception1);
            };
        } else if(sys.isBrowser && DEV) {   //浏览器
            window.onerror = function (errorMessage, file, line, message, error) {
                let exception = [
                    errorMessage = errorMessage,
                    file = file,
                    line = line,
                    message = message,
                    error = error,
                ];
                let exception1 = JSON.stringify(exception);
                setTimeout(function(){ //延迟一帧调用
                    if (!!error && !!error.stack){
                        //错误堆栈信息
                        let stackInfo = error.stack.toString();
                        phlog(stackInfo+"\nextraInfo:\n    "+exception1);
                        phlog(arguments);
                        CommonUtils.showPopViewTips(stackInfo+"\nextraInfo:\n    "+exception1,null,null,true);
                    }
                },0);
                return true;
            };
        }
    }



}
