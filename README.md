# ccc
# only Gods know my code
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
                        CommonUtils.showPopViewTips(stackInfo+"\nextraInfo:\n    "+exception1,null,null,true); //调用弹窗面板展示错误定位
                    }
                },0);
                return true;
            };
        }
