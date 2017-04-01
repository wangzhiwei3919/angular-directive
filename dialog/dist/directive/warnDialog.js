/**
 **********************************************************
 *
 *
 * @author      wangzhiwei.
 * @date        17/3/24.
 * @time        16:21.
 * @versions    0.0.0
 *
 *
 *********************************************************
 */
app.directive('warnDialog', function () {
    return {
        restrict: 'AE',
        scope: {
            callback: '=callback',
            url:'=dUrl',
            icon:'=dIcon',
            tips:'=dTips',
            isShow:'=isShow'
        },
        template: '<dialog d-show="isShow" d-url="url" events="events"></dialog>',
        replace: true,
        controller: function ($scope) {
            if (typeof $scope.callback != 'function') {
                throw new Error('回调必须是一个function');
            }
            if (typeof $scope.url !='string') {
                throw new Error('弹窗url未赋值');
            }
            //
            $scope.events = function (dScope) {
                dScope.iconClass=$scope.icon;
                dScope.content = $scope.tips;
                dScope.close = function () {
                    //alert('我是一个关闭回调,并且访问修改了$scope属性');
                    $scope.callback(false);
                    $scope.isShow=false;
                };
                dScope.submit= function(){
                    // alert('我是一个提交回调,访问了弹窗内部scope');
                    $scope.callback(true);
                    $scope.isShow=false;
                    dScope.content='我点了确定';
                }
            }
        }
    }
});