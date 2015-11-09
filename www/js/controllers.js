angular.module('weatherapp.controllers', ['mobiscroll-image', 'mobiscroll-datetime', 'ionic.rating', 'jlareau.pnotify', 'ngCordova', 'google.places'])

.controller('AppCtrl', function($scope, $rootScope, FriendService, $ionicModal, $timeout, $ionicLoading, $ionicSideMenuDelegate, $compile, $window, notificationService, $state, $cordovaSocialSharing, $http, $ionicScrollDelegate) {
	$scope.capitals = capitals;
	
	$scope.month = 1;
	$scope.temperatue = 7;

	$scope.monthData = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb"];
	$scope.deltaMonth = 52.5;

	$scope.deltaTemperature = 52.5;

	$scope.temperatueList = [];
	for(var i = -10; i<40;i++)  {
		$scope.temperatueList.push(i);
	}

	$scope.countryData = [];	

	//Load Data from Local Data
	$scope.loadWeatherDatafromLocal = function() {
		$scope.countryData =  [];
		for(var i=0;i<capitals.length;i++) {
			var jsonStr = window.localStorage.getItem(capitals[i]);
			var jsonData = $.parseJSON(jsonStr);
			if(jsonData == null || jsonData == undefined)
				continue;
			//console.log(jsonData);
			$scope.countryData.push({
				climate: jsonData.ClimateAverages[0].month,
				capital: jsonData.request[0].query			
			});
		}
		
		//alert($scope.countryData.length);
	}
	
	$scope.tempVal = 0;
	//Load Data from Server Data
	$scope.loadWeatherDatafromServer = function() {
		$ionicLoading.show({
			template: 'Fetching Weather Data...'
		});

		for(var i=0;i<capitals.length;i++) {
			var api = "http://api.worldweatheronline.com/premium/v1/weather.ashx?q=" + capitals[i] + "&format=json&key=q984f5e6fmvjz7a8gbspkusp";
			//console.log(api);
			//break;
			$http.get(api).then(function(resp) {
				//console.log('Success', resp);
				
				$scope.countryData.push({
					climate: resp.data.data.ClimateAverages[0].month,
					capital: resp.data.data.request[0].query			
				});
				
				if($scope.countryData.length > 220)  {
					$ionicLoading.hide();
				}
					
				cap = resp.data.data.request[0].query;
				//jsonData = JSON.stringify(resp.data.data.ClimateAverages[0].month);
				jsonData = JSON.stringify(resp.data.data);
				var item  = cap.substr(0, cap.indexOf(","));
				window.localStorage.setItem(item, jsonData);
				
			}, function(err) {
				console.error('ERR', err);
				// err.status will contain the status code
			})
		}
	}
	
	
	
	var first = window.localStorage.getItem("first");
	if(first == true || first == "true") {
		$scope.loadWeatherDatafromLocal();
	}else{
		$scope.loadWeatherDatafromServer();
		window.localStorage.setItem("first", "true");
	}
	
	//alert(capitals[0]);

	$scope.wData = [
    {
      title: 'United Kingdom',
	  degree: -10
    },
	{
      title: 'Spain',
	  degree: -10
    },
	{
      title: 'Germany',
	  degree: -10
    },
	{
      title: 'France',
	  degree: -10
    },
	{
      title: 'Greece',
	  degree: -10
    },
	{
      title: 'Italy',
	  degree: -10
    }];
	
	$scope.fData = [
		{
		  title: 'Average Maximum Temperature',
		  id: 1,
		  bUse: false
		},
		{
		  title: 'Average Minimum Temperature',
		  id: 2,
		  bUse: false
		},
		{
		  title: 'Average Dry Days',
		  id: 3,
		  bUse: false
		},
		{
		  title: 'Average Monthly RainFall Amount',
		  id: 4,
		  bUse: false
		},
		{
		  title: 'Average Daily Rainfall Amount',
		  id: 5,
		  bUse: false
		},
		{
		  title: 'Average Fog Days',
		  id: 6,
		  bUse: false
		},
		{
		  title: 'Average Snow Days',
		  id: 7,
		  bUse: false
		}		
	];
	
	$scope.detailData = [
		{
		  title: 'Average Dry Days',
		  val: "61",
		  imgUrl : "img/sun.png"
		},
		{
		  title: 'Average Monthly Rainfall Amount',
		  val: "4 mm",
		  imgUrl : "img/umbrella.png"
		},
		{
		  title: 'Average Daily Rainfall Amount',
		  val: "1 mm",
		  imgUrl : "img/two_umbrella.png"		  
		},
		{
		  title: 'Average Fog Days',
		  val: "1",
		  imgUrl : "img/fog.png"
		},
		{
		  title: 'Average Snow Days',
		  val: "2",
		  imgUrl : "img/snow.png"
		}
	];
	



  $scope.goWeatherPage = function () {
  	
		var delta1 = $("#monthList .scroll").css('transform').split(',')[5];
		delta1 = Math.abs(delta1.substr(0, delta1.length-1));
		delta1 = parseFloat(delta1/$scope.deltaMonth);
		
		$scope.month = Math.ceil(delta1 + 1);

		console.log($scope.month);


		var delta2 = $("#temperatueList .scroll").css('transform').split(',')[5];
		delta2 = Math.abs(delta2.substr(0, delta2.length-1));
		delta2 = parseFloat(delta2/$scope.deltaTemperature);
		
		$scope.temperatue = $scope.temperatueList[Math.ceil(delta2 + 2)];

		console.log($scope.temperatue);		
		
		//Decide country with Month and Average Temperatue
		$scope.wData = [];
		for(var i=0;i<$scope.countryData.length;i++) {
			countryData = $scope.countryData[i].climate;
			avgMaxTemp = parseFloat(countryData[$scope.month - 1].avgMaxTemp);
			avgMinTemp = parseFloat(countryData[$scope.month - 1].avgMaxTemp);		
			avgDryDays = parseInt(countryData[$scope.month - 1].avgDryDays);
			avgMonthlyRainfall = parseFloat(countryData[$scope.month - 1].avgMonthlyRainfall);
			avgDailyRainfall = parseFloat(countryData[$scope.month - 1].avgDailyRainfall);
			avgFogDays = parseInt(countryData[$scope.month - 1].avgFogDays);
			avgSnowDays = parseInt(countryData[$scope.month - 1].avgSnowDays);			
			
			var avgTemp = Math.floor((avgMaxTemp + avgMinTemp)/2);
			
			//console.log(avgTemp);
			if(avgTemp == $scope.temperatue) {
				$scope.wData.push({
					num: i,
					title: $scope.countryData[i].capital,
					avgMaxTemp : avgMaxTemp,
					avgMinTemp : avgMinTemp,
					avgDryDays : avgDryDays,
					avgMonthlyRainfall : avgMonthlyRainfall,
					avgDailyRainfall : avgDailyRainfall,
					avgFogDays : avgFogDays,
					avgFogDays : avgFogDays,
					avgSnowDays : avgSnowDays
				});
			}
		}
		
		$scope.fAvgMaxTemp = true;
		$scope.wData.sort(compareAvgMaxTemp);
		
		$state.go("app.weather");
  }
  
  $scope.arrowImg = "img/des_arrow.png";
  
  $scope.bFilterShow = false;
  
  $scope.countryName =  "The Former Yugoslav Republic of Macedonia";
  $scope.homeTitle = "Weather Watchman";
  $scope.discoverTitle = "Weather discoveries";
  
  //Show Filter List
  $scope.showFilter = function() {
	if($scope.arrowImg == "img/des_arrow.png") {
		$scope.arrowImg = "img/asc_arrow.png";
		$scope.bFilterShow = true;
	}
	else {
		$scope.arrowImg = "img/des_arrow.png";
		$scope.bFilterShow = false;
	}
  }
  
  //Decide Filter Item after click , Apply Filtering
  $scope.onClickFilterItem  = function(sub_item){
	for(var i =0;i<$scope.fData.length;i++){
		$scope.fData[i].bUse = false;		
	}
	for(var i =0;i<$scope.fData.length;i++){
		item = $scope.fData[i];
		if(item.id == sub_item.id) {
			$scope.fData[i].bUse = true;		
			break;
		}
	}
	
	$scope.bFilterShow = false;
	$scope.arrowImg = "img/des_arrow.png";

	$scope.fAvgMaxTemp = false;
	$scope.fAvgMinTemp = false;
	$scope.fAvgDryDays = false;
	$scope.fAvgMonthRainfall = false;
	$scope.fAvgDailyRainfall = false;
	$scope.fAvgFogDays = false;
	$scope.fAvgSnowDays = false;
	
	//Processing Filter Start	
	switch(sub_item.id) {
		//Average Maximum Temperature
		case 1:
			$scope.fAvgMaxTemp = true;
			$scope.wData.sort(compareAvgMaxTemp);
			break;
		//Average Minimum Temperature
		case 2:
			$scope.fAvgMinTemp = true;
			$scope.wData.sort(compareAvgMinTemp);
			break;
		//Average Dry Days
		case 3:
			$scope.fAvgDryDays = true;
			$scope.wData.sort(compareAvgDryDays);
			break;
		//Average Monthly RainFall Amount
		case 4:
			$scope.fAvgMonthRainfall = true;
			$scope.wData.sort(compareAvgMonthlyRainfall);
			break;
		//Average Daily Rainfall Amount
		case 5:
			$scope.fAvgDailyRainfall = true;
			$scope.wData.sort(compareAvgDailyRainfall);
			break;
		//Average Fog Days
		case 6:
			$scope.fAvgFogDays = true;
			$scope.wData.sort(compareAvgFogDays);
			break;
		//Average Snow Days
		case 7:
			$scope.fAvgSnowDays = true;
			$scope.wData.sort(compareAvgSnowDays);
			break;
		default:
			break;
	}
	//Processing Filter End
  }
  
  //Show Country Detail
  $scope.onClickCountry = function(item){
	$state.go("app.country");
  }
  
  //go Home Page
  $scope.goHome = function() {
	$state.go("app.home");
  }
  
  //Show Country Map Page
  $scope.goCountryMap = function(item){
	$state.go("app.country_map");
  }  
  
  //Share Country Weather Detail
  $scope.shareDetail = function (){
	message = "message";
	subject = "message";
	file = "file";
	link = "www.google.com";
	
	$cordovaSocialSharing
    .share(message, subject, file, link) // Share via native share sheet
    .then(function(result) {
      // Success!
    }, function(err) {
      // An error occured. Show a message to the user
    });	
  }
  
  // init gps array
    $scope.basel = { lat: 47.55633987116614, lon: 7.576619513223015 };
	
	$scope.whoiswhere = [
		{ "name": "My Marker", "lat": $scope.basel.lat, "lon": $scope.basel.lon },
	];
})

// Controller that shows more detailed info about a friend
.controller('FriendCtrl', function($scope, $stateParams, FriendService, $window, $ionicLoading, $timeout) {
  
  $scope.onSwipeLeft = function () {
	//alert("swipeleft");
  }
    $scope.onSwipeRight = function () {
	url ="#/app/friendlist";
	$window.location.href = url;	
	//alert("swiperight");
  }
  
})

// Controller that shows profile
.controller('ProfileCtrl', function($scope, $stateParams, FriendService, $ionicLoading, $ionicModal,$sce, $timeout, $http, notificationService, $cordovaCamera) {
  
  $scope.profileInfo = [];
  $scope.profileInfo.name = "John Steve";
  $scope.profileInfo.email = "johnsteve@gmail.com";
  $scope.profileInfo.phone = "1232342342";
  $scope.profileInfo.emergencyinfo = "this is emergency information";
  
  $scope.phone = "";
  
  $scope.friend = FriendService.get($stateParams.commentId);
  $scope.title = "Profile";  	

  $scope.selectedCar;
 	
  $scope.birthday = new Date();

	/*zheng start*/
	$scope.showModal = function(templateUrl) {
		$ionicModal.fromTemplateUrl(templateUrl, {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.modal = modal;
			$scope.modal.show();
		});
	}
	
		// Close the modal
		$scope.closeModal = function() {
			$scope.modal.hide();
			$scope.modal.remove()
		};

		
		$scope.clipSrc = 'https://www.safecab.com/home/AdvertMedia?AdvertId=2';
 
		$scope.playVideo = function() {
			$scope.showModal('templates/video-popover.html');
		}
		
		 $scope.trustSrc = function(src) {
			return $sce.trustAsResourceUrl(src);
		}
		
		/*zheng end*/
		
  $scope.callPhoneService = function(){
  	//alert($scope.profileInfo.phone);
  	if($scope.profileInfo.phone.toString().length < 5)
  		return ;
   // alert(typeof($scope.profileInfo.phone));
    var url  = "https://external.safecab.com/ValidationService.svc/ValidatePhone/" + $scope.profileInfo.phone + "/GB";
   // alert(url);
  	$http.get(url).
	  success(function(data, status, headers, config) {
	    // this callback will be called asynchronously
	    // when the response is available
	    alert(data);
	  }).
	  error(function(data, status, headers, config) {
	    // called asynchronously if an error occurs
	    // or server returns response with an error status.
	  });
  }
  
  $scope.imgData = null;
  
  $scope.openCamera  = function (){
	var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 100,
      targetHeight: 100,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {
      var image = document.getElementById('myImage');
      image.src = "data:image/jpeg;base64," + imageData;
	  $scope.imgData = imageData;
    }, function(err) {
      // error
    }); 
  }
})

function compareAvgMaxTemp(a, b) {
	if(a.avgMaxTemp < b.avgMaxTemp)
		return -1;
	if(a.avgMaxTemp > b.avgMaxTemp)
		return 1;
	return 0;
}


function compareAvgMinTemp(a, b) {
	if(a.avgMinTemp < b.avgMinTemp)
		return -1;
	if(a.avgMinTemp > b.avgMinTemp)
		return 1;
	return 0;
}

function compareAvgDryDays(a, b) {
	if(a.avgDryDays < b.avgDryDays)
		return -1;
	if(a.avgDryDays > b.avgDryDays)
		return 1;
	return 0;
}

function compareAvgMonthlyRainfall(a, b) {
	if(a.avgMonthlyRainfall < b.avgMonthlyRainfall)
		return -1;
	if(a.avgMonthlyRainfall > b.avgMonthlyRainfall)
		return 1;
	return 0;
}

function compareAvgDailyRainfall(a, b) {
	if(a.avgDailyRainfall < b.avgDailyRainfall)
		return -1;
	if(a.avgDailyRainfall > b.avgDailyRainfall)
		return 1;
	return 0;
}

function compareAvgFogDays(a, b) {
	if(a.avgFogDays < b.avgFogDays)
		return -1;
	if(a.avgFogDays > b.avgFogDays)
		return 1;
	return 0;
}

function compareAvgSnowDays(a, b) {
	if(a.avgSnowDays < b.avgSnowDays)
		return -1;
	if(a.avgSnowDays > b.avgSnowDays)
		return 1;
	return 0;
}