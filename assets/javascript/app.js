var name;
var role;
var rate;
var startdate;   


  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyB2W8UwsJNT6Z8q_XZOUpUHplupb8KlZjE",
    authDomain: "minalfirst.firebaseapp.com",
    databaseURL: "https://minalfirst.firebaseio.com",
    projectId: "minalfirst",
    storageBucket: "minalfirst.appspot.com",
    messagingSenderId: "786089528355"
  };
  firebase.initializeApp(config);


    // VARIABLES
    // --------------------------------------------------------------------------------

    var database = firebase.database();
    var clickCounter = 0;

    // FUNCTIONS + EVENTS
    // --------------------------------------------------------------------------------

    $("#submit").on("click", function() {
      
        event.preventDefault();
        var name=$("#name").val().trim();
        var destination=$("#destination").val().trim();
        var traintime=$("#traintime").val().trim();
        var frequency=$("#frequency").val().trim();
        database.ref("TrainSchedular").push({
        name:name,
        destination:destination,
        traintime:traintime,
        frequency:frequency

      });
    });

    // MAIN PROCESS + INITIAL CODE
    // --------------------------------------------------------------------------------

    database.ref("TrainSchedular").on("child_added", function(snapshot) {
      console.log(snapshot.val());

       name= snapshot.val().name;
       destination= snapshot.val().destination;
       traintime= snapshot.val().traintime;
       frequency=snapshot.val().frequency;
      
      

        //code in math to find the next train time and minutes until next arrival based off of frequency value and first train time value.

        //convert first train time back a year to make sure it is set before current time before pushing to firebase.

        var firstTrainConverted = moment(traintime, "hh:mm").subtract(1, "years");
        console.log(firstTrainConverted);

        //set a variable equal to the current time from moment.js

        var currentTime = moment();
        console.log("Current Time: " + moment(currentTime).format("hh:mm"));

        //post current time to jumbotron for reference

        $("#currentTime").html("Current Time: " + moment(currentTime).format("hh:mm"));

        //find the difference between the first train time and the current time

        var timeDiff = moment().diff(moment(firstTrainConverted), "minutes");
        console.log("Difference In Time: " + timeDiff);

        //find the time apart by finding the remainder of the time difference and the frequency - use modal to get whole remainder number

        var timeRemainder = timeDiff % frequency;
        console.log(timeRemainder);

        //find the minutes until the next train

        var nextTrainMin = frequency - timeRemainder;
        console.log("Minutes Till Train: " + nextTrainMin);

        //find the time of the next train arrival

        var nextTrainAdd = moment().add(nextTrainMin, "minutes");
        var nextTrainArr = moment(nextTrainAdd).format("hh:mm");
        console.log("Arrival Time: " + nextTrainArr);

      var tbrow=$("<tr>");
      tbrow.append("<td>"+name+"</td>");
      tbrow.append("<td>"+destination+"</td>");
      tbrow.append("<td>"+frequency+"</td>");
      tbrow.append("<td>"+nextTrainArr+"</td>");
      tbrow.append("<td>"+nextTrainMin+"</td>");
      
      $(".table").append(tbrow);
    }, function(errorObject) {
      console.log("The read failed: " + errorObject.code);
    });