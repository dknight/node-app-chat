let socket = io();

function scrollToBottom () {
  var messages = jQuery('#messages-list');
  var newMessage = messages.children('li:last-child')
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
      messages.scrollTop(scrollHeight);
  }
}

socket.on('connect', function() {
  var params = deparam(window.location.search.substring(1));
  
  socket.emit('join', params, function (err) {
      if (err) {
        alert(err);
        window.location.href = '/';
      } else {
        console.log('No error');
      }
  });
});

socket.on('disconnect', function() {
  console.log('Disconnected from server');
});

socket.on('newMessage', function(message) {
    var formattedTime = moment(message.createdAt).format('HH:mm');

    var template = jQuery('#message-template').html();
    var html =   Mustache.render(template, {
        text: message.text,
        name: message.name,
        color: message.color,
        createdAt: formattedTime
    });
    jQuery('#messages-list').append(html);
    scrollToBottom();
});

socket.on('updateUserList', function (users) {
    var $ul = jQuery('<ul></ul>');
    users.forEach(function (user) {
        const $li = jQuery('<li></li>').text(user)
        $ul.append($li);
    });
    jQuery('#users').html($ul);
});

socket.on('newLocationMessage', function (message) {
    var formattedTime = moment(message.createdAt).format('HH:mm');
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template, {
        url: message.url,
        name: message.name,
        createdAt: formattedTime
    });
    jQuery('#messages-list').append(html);
    scrollToBottom();
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

        var msg = $messageTextbox.val();
        if (!msg) {
            return;
        }
    
        $messageTextbox.focus();
        socket.emit('createMessage', {
            name: 'User',
            text: msg
        }, function () {
            $messageTextbox.val('');
        });
    });
});