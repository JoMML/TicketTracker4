(function(){
  'use strict';
  var user="nouser";
  var selectedUser="VictorHeredia";
var Profile="[]";
var myProfile="[]";
  var todosTicket={};
  var Login={};
  var module = angular.module('app', ['onsen'],function($httpProvider) {
  // Use x-www-form-urlencoded Content-Type
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

  /**
   * The workhorse; converts an object to x-www-form-urlencoded serialization.
   * @param {Object} obj
   * @return {String}
   */ 
  var param = function(obj) {
    var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

    for(name in obj) {
      value = obj[name];

      if(value instanceof Array) {
        for(i=0; i<value.length; ++i) {
          subValue = value[i];
          fullSubName = name + '[' + i + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value instanceof Object) {
        for(subName in value) {
          subValue = value[subName];
          fullSubName = name + '[' + subName + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value !== undefined && value !== null)
        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
    }

    return query.length ? query.substr(0, query.length - 1) : query;
  };

  // Override $http service's default transformRequest
  $httpProvider.defaults.transformRequest = [function(data) {
    return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
  }];
});

  module.controller('AppController', function($scope, $data,$myDataProfile,$http) {
    $scope.doSomething = function() {
      setTimeout(function() {
        alert(''+device.uuid);
      }, 100);
    };
    $scope.miPerfil=function(){
    	$http.get('http://empowerlabs.com/proyectos/helpDesk/getUserData.php?user='+user).
  success(function(data, status, headers, config) {
  	//$scope.ons.notification.alert({message: ""+data.firstname,title: "intellibanks"});
    $myDataProfile=data;
    myProfile=data;
    $scope.mydata = $myDataProfile;
    //ons.notification.alert({message: ''+user, title:"Intellibanks"});
  }).
  error(function(data, status, headers, config) {
  	
  });
    };
  });

  module.controller('DetailController', function($scope, $data) {
    $scope.item = $data.selectedItem;
    selectedUser= $data.selectedItem.autor;
    //navigator.notification.vibrate(2000); //milliseconds
	//navigator.notification.beep(2); // numbr of times
  });

  module.controller('MasterController', function($scope, $data, $http) {
	$scope.entradaTicket=user;//para ver tickets unicamente el que se logea solo va ver sus tickets											 
    $scope.items = todosTicket;  
    $http.get('http://empowerlabs.com/proyectos/trackersAPI/EmpowerLabsIntra/tickettracker/todos.php').success(function(data, status, headers, config) {
  	data.reverse();
    $data.items=data;
    todosTicket=data;
    $scope.items = $data.items;  
    $scope.showDetail = function(item) {
      var selectedItem = item;
      $data.selectedItem = selectedItem;
      $scope.ons.navigator.pushPage('detail.html', {title : selectedItem.title});
    };
  }).
  error(function(data, status, headers, config) {
  	
  });
  });

  module.factory('$data', function() {
      var data = {};
      
      data.items = todosTicket;
      
      return data;
  });
  
  module.controller('profileController', function($scope, $dataProfile, $http) {
    $http.get('http://empowerlabs.com/proyectos/helpDesk/getUserData.php?user='+selectedUser).    
  success(function(data, status, headers, config) {
  	//$scope.ons.notification.alert({message: ""+data.firstname,title: "intellibanks"});
    $dataProfile=data;
    Profile=data;
    $scope.data = $dataProfile;
  }).
  error(function(data, status, headers, config) {
  	
  });
  });
   module.factory('$dataProfile', function() {
      var dataProfile;
      		dataProfile=Profile;
      
      return dataProfile;
  });
  
  module.controller('NuevoController',function($scope,$http){
  	$scope.formData = {};
  	$scope.push=function(){
  		modal.show();
  		$http.post('http://empowerlabs.com/proyectos/soporte/nuevo.php', $scope.formData).
  success(function(data, status, headers, config) {
  	modal.hide();
  	$scope.alta.$setPristine();
  	$scope.formData = {};
ons.notification.alert({message: ''+data.mensaje, title:"Intellibanks"});
  }).
  error(function(data, status, headers, config) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
  });
  	};
  });
  
  module.controller('LoginController',function($scope,$http){
  	$scope.formLogin={};
  		$scope.login=function(){
  			$http.post('http://empowerlabs.com/landing-pages/Martin/Usuarios/ingreso.php',$scope.formLogin).
  			success(function(data,status,headers,config){
  				if(data.code=="OK"){
  					user=data.user;
  					//ons.notification.alert({message: ''+data.respuesta, title:"Intellibanks"});
  					$scope.miPerfil();
  					menu.setMainPage('page1.html');
  				}
  				else{
  					ons.notification.alert({message: ''+data.respuesta, title:"Intellibanks"});
  				}
  			});
  		};
  		
  });
   module.factory('$myDataProfile', function() {
      var myDataProfile;
      		myDataProfile=myProfile;
      
      return myDataProfile;
  });
  
})();
