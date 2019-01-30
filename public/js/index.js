let socket = io();

socket.on('connect', function() {
  console.log('Connected to server');
});

socket.on('disconnect', function() {
  console.log('Disconnected from server');
});

socket.on('newMessage', function(message) {
    var formattedTime = moment(message.createdAt).format('hh:mm a');

    var template = jQuery('#message-template').html();
    var html =   Mustache.render(template, {
        text: message.text,
        name: message.name,
        createdAt: formattedTime
    });
    jQuery('#messages-list').append(html);
});

socket.on('newLocationMessage', function (message) {
    var formattedTime = moment(message.createdAt).format('hh:mm a');
    var template = jQuery('#location-message-template').html();
    var html =   Mustache.render(template, {
        url: message.url,
        name: message.name,
        createdAt: formattedTime
    });
    jQuery('#messages-list').append(html);
});

jQuery(function ($) {
    var $locationButton = $('#btn-send-location');
    
    $locationButton.on('click', function (e) {
        if (!navigator.geolocation) {
            return void alert('Geolocation isnt supported by your browser');
        }

        $locationButton.attr('disabled', 'disabled').text('Sending...');

        navigator.geolocation.getCurrentPosition(function(pos) {
            $locationButton.removeAttr('disabled').text('Send location');
            socket.emit('createLocationMessage', {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
            });
        }, function (e) {
            $locationButton.removeAttr('disabled').text('Send location');
            return void alert('Unable to fetch location');
        })
    });

    var $messageTextbox = $('#message')
    $('#message-form').on('submit', function (e) {
        e.preventDefault();
    
        socket.emit('createMessage', {
            name: 'User',
            text: $messageTextbox.val()
        }, function () {
            $messageTextbox.val('');
        });
    });
});