
  function initialize() {
    var mapOptions = {
      zoom: 6
    };

    // Try HTML5 geolocation
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = new google.maps.LatLng(position.coords.latitude,
                                         position.coords.longitude);

        // console.log(position.coords.latitude);
        // console.log(position.coords.longitude);
        getCurrentlocate();

      }, function() {
        handleNoGeolocation(true);
      });
    } else {
      // Browser doesn't support Geolocation
      handleNoGeolocation(false);
    }
  }

  function getCurrentlocate() {
    navigator.geolocation.getCurrentPosition(function(position) {
        var pos = new google.maps.LatLng(position.coords.latitude,
                                         position.coords.longitude);

        console.log(position.coords.latitude);
        console.log(position.coords.longitude);
    });
    setTimeout('getCurrentlocate()', 2000);
  }

  function handleNoGeolocation(errorFlag) {
    if (errorFlag) {
      var content = 'Error: The Geolocation service failed.';
    } else {
      var content = 'Error: Your browser doesn\'t support geolocation.';
    }

  }

  // google.maps.event.addDomListener(window, 'load', initialize);
