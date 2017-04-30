angular.module('nasaApp', ['ngMap'])
	.constant('_', window._)
	.run(function ($rootScope) {
		$rootScope._ = window._;
	})
	.controller('NasaController', ($scope, $http, NgMap) => {
		const apiKey = "AIzaSyAU9ibG25HJILPrSNIQvvTSrvgWafphCw0";
		$scope.googleMapsUrl=`https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
		$scope.formSubmit = function() {
			// $http.post('https://address', {json}).then(res => {

			// });
		}
		$scope.coords = [
			{
				longitutde: 50,
				latitude: 20
			},
			{
				longitutde: 60,
				latitude: 30
			}
		];
		const coordsPromise = $scope.coords.map(cord => {
			return $http.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${cord.longitutde},${cord.latitude}&key=${apiKey}`);
		});
		return Promise.all(coordsPromise).then(values => {
			return values.map(value => {
				const city = value.data.results.filter(location => {
					return _.includes(location.types, 'locality') || 
					_.includes(location.types, 'sublocality') && 
					_.includes(location.types, 'political');
				});
				return { score: 1, city: city[0].formatted_address};
			});
		}).then(cities => {
			$scope.locations = cities;
			$scope.$digest();
		});
	});
