let stompClient = null;
let socket = null;
let shortName = "";

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    }
    else {
        $("#conversation").hide();
    }
    $("#chatMessages").html("");
}

function connect() {
    // create the SockJS WebSocket-like object
	socket = new SockJS('/my-chat-app');
	
	// specify that we're using the STOMP protocol on the socket
    stompClient = Stomp.over(socket);
    
    // implement the behavior we want whenever the client connects to the server (-or- user connects to chat app client by joining a group)
    stompClient.connect({}, function (frame) {
        setConnected(true);
        console.log('Connected: ' + frame);
        
        // subscribe to topic and create the callback function that handles updates from the server
        stompClient.subscribe("/topic/guestnames", function (greeting) {
        	showJoinedName(JSON.parse(greeting.body).content,JSON.parse(greeting.body).timeStamp);
        });

        stompClient.subscribe("/topic/guestsleft", function (greeting) {
            showLeftPersonName(JSON.parse(greeting.body).content,JSON.parse(greeting.body).timeStamp);
        });

        stompClient.subscribe("/topic/guestchats", function (greeting) {
            showMessage(JSON.parse(greeting.body).content,JSON.parse(greeting.body).timeStamp);
        });

        stompClient.subscribe('/topic/guestupdates', function (greeting) {
        		showTyping(JSON.parse(greeting.body).content);
        });

        sendName();
    });
    
}

function disconnect() {

    shortName = $("#shortName").val();
    timeStamp = new Date().toLocaleTimeString();
    $("#members").append("<tr><td>" + shortName + " just left at " + timeStamp + "</td></tr>");
    sendGuestLeft();
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");


}

function showTyping(message) {
	$("#typingUpdates").html("<tr><td>User is typing...</td></tr>");
}

function sendMessage() {
  stompClient.send("/app/guestchat", {}, JSON.stringify({'message': $("#message").val()}));
}

function showMessage(message,timestamp) {
    $("#chatMessages").append("<tr><td>" + message + "</td><td>"  + timestamp +  "</td></tr>");
    $("#typingUpdates").html("<tr><td>&nbsp;</td></tr>");
    $("#message").val("");
}
	
function sendName() {
    stompClient.send("/app/guestjoin", {}, JSON.stringify({'message': $("#shortName").val()}));
}

function sendGuestLeft() {
    stompClient.send("/app/guestleft", {}, JSON.stringify({'senderName': $("#shortName").val()}));
}

function showJoinedName(message,joinDate) {
	shortName = message;
	timeStamp = joinDate;
    $("#members").append("<tr><td>" + shortName  + " joined at " +  timeStamp + "</td></tr>");
}

function showLeftPersonName(message,leftTime) {
    shortName = message;
    timeStamp = leftTime;
    $("#members").append("<tr><td>" + shortName + " just left at " + timeStamp + "</td></tr>");
}

$(function() {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    
    $( "#connect" ).click(function() { connect(); });
    
    $( "#disconnect" ).click(function() { disconnect(); });
    
    $( "#send" ).click(function() { sendMessage(); });
    
    $("#message").keydown(function (e)  {
		// Send "is typing" message to server after keystrokes detected
		stompClient.send("/app/guestupdate", {}, {});
	});
});

