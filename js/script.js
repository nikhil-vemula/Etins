// Initialize Firebase
    var config = {
        apiKey: "AIzaSyBQ_enKWy_AYaDE9t3uME15yKj61f43fJ0",
        authDomain: "startup-41216.firebaseapp.com",
        databaseURL: "https://startup-41216.firebaseio.com",
        storageBucket: "",
        messagingSenderId: "695575534367"
    };
    firebase.initializeApp(config);
    //User Authorization changes
    firebase.auth().onAuthStateChanged(function(user) {
        setNav();
        if (user) {
            // User is signed in.
        } else {
            // No user is signed in.
        }
    });
    // To set login and logout of navigation bar
    function setNav()
    {
        var user = firebase.auth().currentUser;
        var vlogin = document.getElementById('login');
        var vlogout = document.getElementById('logout');
        var vdashboard = document.getElementById('dashboard');
        if (user) {
            // User is signed in.
            vlogin.style.display = "none";
            vlogout.style.display = "block";
            vdashboard.style.display = 'block';
        } else {
        // No user is signed in.         
            vlogin.style.display = "block";
            vlogout.style.display = "none";
            vdashboard.style.display = 'none';
        }
    }
    function signOut()
    {
        firebase.auth().signOut().then(function() {
            location = "./index.html"
        }, function(error) {
        // An error happened.
        });
    }
    function login()
    {
        var email = document.getElementById('email').value;
        var password = document.getElementById('pwd').value;
        var vloginbtn = document.getElementById('loginbtn');
        vloginbtn.innerHTML = "Logging in...";
        firebase.auth().signInWithEmailAndPassword(email, password).then(function(){
            $("#myModal").modal("hide");
            location = "./user.html"
        }
        ,function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);
        document.getElementById('login_error').style.display="block";
        });
        vloginbtn.innerHTML = "Login";
    }
            var map="";
            var markers=[];
            function initMap() {
                var myLatLng={lat: 17.387140, lng: 78.491684}
                var mapDiv = document.getElementById('map');
                map = new google.maps.Map(mapDiv, {
                center: myLatLng,
                zoom: 4
                });

            }
        function addMarker(location,name) {
        var marker = new google.maps.Marker({
          position: location,
          map: map,
          title:name
        });
        markers.push(marker);
      }
      // Sets the map on all markers in the array.
      function setMapOnAll(map) {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
        }
      }

      // Removes the markers from the map, but keeps them in the array.
      function clearMarkers() {
        setMapOnAll(null);
      }

      // Shows any markers currently in the array.
      function showMarkers() {
        setMapOnAll(map);
      }

      // Deletes all markers in the array by removing references to them.
      function deleteMarkers() {
        clearMarkers();
        markers = [];
      }
      //firebase
      firebase.database().ref('/location/').once('value').then(function(snapshot) {
                                $.each(snapshot.val(), function(i, value) {
                                $('#cityselect').append($('<option>').text(i).attr('value', i));
                            });
                        });     
                        function updateArea(){
                            var city = document.getElementById('cityselect').value;
                            $('#areaselect').empty() 
                            firebase.database().ref('/location/'+city+'/').once('value').then(function(snapshot) {
                                    $('#areaselect').append($('<option>').text('Select').attr('value', 'select'));
                                    $.each(snapshot.val(), function(i, value) {
                                    $('#areaselect').append($('<option>').text(i).attr('value', i));
                                    });
                            });  
                        }    
                        function search(){
                            var hi = document.getElementById('hi');
                            var city = document.getElementById('cityselect').value;
                            var area = document.getElementById('areaselect').value;
                            firebase.database().ref('/location/'+city+'/'+area+'/').once('value').then(function(snapshot) {
                                $('#list').empty();
                                var count = Object.keys(snapshot.val()).length;
                                deleteMarkers();
                                $.each(snapshot.val(), function(i, value) {
                                    var name = $('<h3>').text(i);
                                    var address =$('<h4>').text(value.Address);
                                    var btn = $('<input>').attr('type','button');                                  
                                    btn.attr('class','btn btn-default');
                                    btn.attr('value','Book');
                                    btn.attr('name','Book');
                                    var quan =$('<input>');
                                    quan.attr('id','quantity');
                                    quan.attr('type','number');
                                    quan.attr('min','1');
                                    quan.attr('max','100');  
                                    var uaddr = $('<textarea>');
                                    uaddr.attr('class','form-control');
                                    uaddr.attr('placeholder','Enter address');
                                    uaddr.attr('rows','2');
                                    uaddr.attr('id','usraddr');                                    
                                    var phno = $('<input>');
                                    phno.attr('class','form-control');
                                    phno.attr('id','phno');
                                    phno.attr('placeholder','Enter phone number');                                    
                                    var x = 'book(\''+i+'\')';  
                                    console.log(x);  
                                    btn.attr('onclick',x);                                
                                    var holder = $('<div>')
                                    holder.attr('class','panel panel-default');
                                    holder.append(name);
                                    holder.append(phno);
                                    holder.append(uaddr);
                                    holder.append($('<label>').text("No of tins:"));
                                    holder.append(quan);
                                    holder.append(btn);
                                    $('#list').append(holder);
                                    addMarker({lat:value.lat,lng:value.lng},value.hi);
                                });
                            }); 
                        }
 function displayItems(){
     var user = firebase.auth().currentUser;
     var uid = user.uid;
     console.log(uid);
firebase.database().ref('/users/'+uid+'/posts/').once('value').then(function(snapshot) {
    $('#itemList').empty();
    console.log(snapshot.val());
    $.each(snapshot.val(), function(i, value) {
        var post =$('<p>').text(JSON.stringify(value));
        post.attr('id','item');                                  
        var holder = $('<div>');
        holder.attr('class','alert alert-success');    
        holder.append(post);
        $('#itemList').append(holder);
        });
    });
}
function book(dname)
{
    var usraddr = document.getElementById('usraddr').innerText;
    var phno = document.getElementById('phno').innerText;
    var quantity = document.getElementById('quantity').innerText;
    console.log(usraddr);
    firebase.database().ref('/users/').once('value').then(function(snapshot) {
    console.log(snapshot.val());
    $.each(snapshot.val(), function(i, value) {
        if(value.hi==dname)
        {
            var postData = {
            phno:phno,
            quantity:quantity,
            usraddr:usraddr
            };
            var newPostKey = firebase.database().ref(/users/+i+'/').child('posts').push().key;
            var updates = {};
            updates['/users/'+i+'/posts/' + newPostKey] = postData;
            return firebase.database().ref().update(updates);
        }
        });
    });
}