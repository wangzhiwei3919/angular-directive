/**
 * create by wangzhiwei on 2017/03/22

 */

/**
 * @param 三个参数:
 *     参数           类型            使用
 * dShow:控制显示,   boolean  true:显示  false:隐藏
 * dUrl:模板地址,     string   url地址(当type非0时,不用传入url)
 * events:事件绑定   function   会往function中注入一个scope,用于绑定
 *                             模板中使用的参数和方法.并且在function
 *                             可直接访问和控制父级 $scope.隔离是为了
 *                             防止一个单页中出现多个弹窗的问题.
 * type:用于确定模板加载  number  0 url加载
 *                              1 警告弹窗
 *                              2 提示弹窗
 *
 */
app.directive('dialog', function () {
    return {
        restrict: 'AE',
        scope: {
            events: '=events',
            dialogUrl: '=dUrl',
            dialogShow: '=dShow',
            type:'=dType'
        },
        template: '<div ng-show="dialogShow" class="dialog-main">' +
        '<div class="dialog-box">' +
        '<div class="dialog-content">' +
        '<div ng-if="type == 0" ng-include="dialogUrl"></div>' +
        '<div ng-if="type == 1"><warnhtmlcode></warnhtmlcode></div>' +
        '<div ng-if="type == 2"><tipshtmlcode></tipshtmlcode></div>' +
        '</div></div></div>',
        replace: true,
        controller: function ($scope) {
            console.log('dialog');
            if (typeof $scope.events != 'function') {
                throw new Error('events必须是一个function');
            }
            if (typeof $scope.dialogUrl != 'string' && $scope.type==0) {
                throw new Error('弹窗url未赋值');
            }
            $scope.events($scope);//传入当前内部$scope
        }
    }
});

app.directive('warndialog', function () {
    return {
        restrict: 'AE',
        scope: {
            callback: '=dCallback',
            icon: '=dIcon',
            tips: '=dTips',
            isShow: '=dShow'
        },
        template: '<dialog d-show="isShow" d-type="type" events="events"></dialog>',
        replace: false,
        controller: function ($scope) {
            $scope.type=1;//确认弹窗类型
            //默认值操作
            if(typeof $scope.tips != 'string'){
                $scope.tips='确定执行这个操作吗?';
            }
            if(typeof $scope.icon != 'string'){
                $scope.icon='icon-warning';
            }
            if (typeof $scope.callback != 'function') {
                throw new Error('回调必须是一个function');
            }
            if (typeof $scope.isShow != 'boolean') {
                throw new Error('d-show必须为Boolean类型对象');
            }
            //事件绑定
            $scope.events = function (dScope) {
                dScope.iconClass = $scope.icon;
                dScope.content = $scope.tips;
                dScope.close = function () {
                    //alert('我是一个关闭回调,并且访问修改了$scope属性');
                    $scope.callback(false);
                    //$scope.isShow = false;
                };
                dScope.submit = function () {
                    // alert('我是一个提交回调,访问了弹窗内部scope');
                    $scope.callback(true);
                   // $scope.isShow = false;
                    dScope.content = '我点了确定';
                }
            }
        }
    }
});
app.directive('tipsdialog', ['$interval',function ($interval) {
    return {
        restrict: 'AE',
        scope: {
            time: '=dTime',
            tips: '=dTips',
            isShow: '=dShow'
        },
        template: '<dialog d-show="isShow" d-type="type" events="events"></dialog>',
        replace: false,
        controller: function ($scope) {
            $scope.type=2;//确认弹窗类型
            //默认值操作
            if(typeof $scope.time != 'number'){
                $scope.time=1000;
            }
            $scope.times={
                nmb:Math.ceil($scope.time/1000)
            };
            if (typeof $scope.isShow != 'boolean') {
                throw new Error('d-show必须为Boolean类型对象');
            }
            $scope.$watch('isShow',function(n,o){
                $scope.times.nmb=Math.ceil($scope.time/1000);
                if(n){
                   var inte= $interval(function(){
                           --$scope.times.nmb;
                       console.log($scope.times.nmb);
                       if($scope.times.nmb<=0){
                            $interval.cancel(inte);
                            $scope.isShow=false;
                        }
                    },1000);
                }
            });
            //事件,数值绑定
            $scope.events = function (dScope) {
                dScope.tips = $scope.tips;
                dScope.times=$scope.times;
            }
        }
    }
}]);
app.directive('warnhtmlcode', function () {
    return {
        restrict: 'AE',
        template: '<div class="warn-dialog-box">' +
        '<div class="tips-icon">' +
        '<i ng-class="iconClass"></i>' +
        '</div>' +
        '<p class="content-text">' +
        '{{content}}' +
        '</p>' +
        '<div class="dialog-button-box">' +
        '<button class="primary" ng-click="submit()">确定</button><button class="cancel" ng-click="close()">取消</button>' +
        '</div>' +
        '</div>',
        replace: true

    }
});
app.directive('tipshtmlcode', function () {
    return {
        restrict: 'AE',
        template: '<div class="tips-dialog-box">' +
        '<p class="content-text">' +
        '{{tips}} <small>({{times.nmb}})</small>' +
        '</p>' +

        '</div>',
        replace: true

    }
});