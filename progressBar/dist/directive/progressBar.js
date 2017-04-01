/**
 **********************************************************
 *
 *
 * @author      wangzhiwei.
 * @date        17/3/27.
 * @time        11:39.
 * @versions    0.0.0
 *
 *
 *********************************************************
 */
app.directive('progressbar', ['$timeout', function ($timeout) {
    return {
        restrict: 'AE',
        scope: {
            data:'=pData',
            scale: '=pScale',
            styleT: '=pStyle'
        },
        template: '<div class="progress-main">' +
        '<div class="progress-bar" style="background: {{ styleT.background }}">' +
        ' <div style="{{ cover + (100 - scale.currentValue) }}%;background:{{ styleT.coverColor }};" class="progress-cover"></div></div>' +
        '<div style="{{ position }}" class="progress-hints" ng-class="hintsClass">{{ (scale.currentValue) + scale.unit }}</div>' +
        '</div>',
        replace: true,
        link:function($scope,attr,ele){
            //限定值和赋予初始值
            if (typeof $scope.scale != 'object') {
                throw new Error('scale必须是一个object');
            } else {
                // 下值必填
                if (typeof $scope.scale.currentValue != 'number') {
                    throw new Error('scale.currentValue必须是一个number');
                }
                //假如有部分定值,赋予其它初值
                $scope.scale = {//必须,用于控制进度条
                    startValue: $scope.scale.startValue || 0,//非必须,默认0
                    endValue: $scope.scale.endValue || 100,//非必须,默认100
                    currentValue: $scope.scale.currentValue || 56,//必须,指定当前刻度
                    unit: $scope.scale.unit || '%'//非必须,默认%
                };
            }
            console.log($scope.styleT);
            if (!$scope.styleT) {
                $scope.styleT = {//非必须
                    type: 1,//非必须,默认值为1  1为垂直进度条,2为横向进度条
                    background: '#00ff00',//剩余数
                    coverColor: '#fff',
                    hintsPosition: 'right'// 五个取值,top,right,bottom,left,middle
                };
            } else {//如果给定部分默认值
                $scope.styleT = {
                    type: $scope.styleT.type || 1,
                    background: $scope.styleT.background || '#00ff00',//剩余数
                    coverColor: $scope.styleT.coverColor || '#fff',
                    hintsPosition: $scope.styleT.hintsPosition || 'right'// 五个取值,top,right,bottom,left,middle
                };
            }

            console.log($scope.styleT);
            //判断垂直或者横向 提示方向
            switch ($scope.styleT.type) {
                case 1:
                    $scope.cover = 'height:';
                    switch ($scope.styleT.hintsPosition) {
                        case 'left':
                        case 'right':
                            $scope.$watch('scale.currentValue', function (n, o) {
                                $scope.position = 'top:' + (100 - $scope.scale.currentValue) + '%';
                            });
                    }
                    break;
                case 2:
                    $scope.cover = 'right:0;width:';
                    switch ($scope.styleT.hintsPosition) {
                        case 'top':
                        case 'bottom':
                            $scope.$watch('scale.currentValue', function (n, o) {
                                $scope.position = 'right:' + (100 - $scope.scale.currentValue) + '%';
                            });
                    }
                    break;
            }
            $scope.hintsClass = $scope.styleT.hintsPosition + $scope.styleT.type;
            console.log('progress-directive');
            if($scope.hintsClass == 'bottom2' || $scope.hintsClass == 'top2'){

            }
        },
        controller: function ($scope) {

        }
    }
}]);