function handleComposeSubmit(event) {
  console.log('Button clicked, performing ajax call...');
  event.preventDefault();
  var formDataStr = $(this).serialize();
  var textAreaContent = $('#new-tweet-area').val();

  if(textAreaContent === '') {
    return showNotificationBar('Please enter a text');
  } else if (textAreaContent.length > 140) {
    return showNotificationBar("Tweet is too long");
  } else {
    $.ajax({
      url: '/tweets',
      method: 'POST',
      data: formDataStr
    }).done(function(data) {
      $('#new-tweet-area').val('');
      $('.counter').html(140);
      loadTweets();
      console.log('the ajax request is successfull');
    });
  }
}

function createTweetElement (tweetObj) {
  $tweet = $("<article>").addClass("tweet");
  let html = `
    <header>
      <img src=${tweetObj.user.avatars.small} alt="user-avatar" />
      <h1>${tweetObj.user.name}</h1>
      <h2>${tweetObj.user.handle}</h2>
    </header>
    <div class="tweet-body">
      <p>
        ${tweetObj.content.text}
      </p>
    </div>
    <footer>
      <p>
      ${getTheCurrentTime(tweetObj.created_at)}
      </p>
      <span>
        <i class="fa fa-flag" aria-hidden="true"></i>
        <i class="fa fa-retweet" aria-hidden="true"></i>
        <i class="fa fa-heart" aria-hidden="true"></i>
      </span>
    </footer>
  `;
  $tweet = $tweet.append(html);
  return $tweet;
}

function renderTweets(tweets) {
  var $html = $('<div></div>');
  tweets.forEach((tweet)=> {
    var a = createTweetElement(tweet);
    $html.prepend(a);
  })
  $(".tweets-container").html($html);
}

function loadTweets() {
  $.ajax({
    url: `/tweets`,
    method: 'GET',
    dataType: "json",
    success: function (data) {
      console.log('Success: ', data);
      renderTweets(data);
    }
  });
}

function showNotificationBar(message, duration, bgColor, txtColor, height) {
  /*set default values*/
  duration = typeof duration !== 'undefined' ? duration : 1500;
  bgColor = typeof bgColor !== 'undefined' ? bgColor : "#F4E0E1";
  txtColor = typeof txtColor !== 'undefined' ? txtColor : "#A42732";
  height = typeof height !== 'undefined' ? height : 40;
  /*create the notification bar div if it doesn't exist*/
  if ($('#notification-bar').size() == 0) {
      var HTMLmessage = "<div class='notification-message' style='text-align:center; line-height: " + height + "px;'> " + message + " </div>";
      $('body').prepend("<div id='notification-bar' style='display:none; width:100%; height:" + height + "px; background-color: " + bgColor + "; position: fixed; z-index: 100; color: " + txtColor + ";border-bottom: 1px solid " + txtColor + ";'>" + HTMLmessage + "</div>");
  }
  /*animate the bar*/
  $('#notification-bar').slideDown(function() {
      setTimeout(function() {
          $('#notification-bar').slideUp(function() { $(this).remove();});
      }, duration);
  });
}

function getTheCurrentTime(date) {
  var currentDate = Date.now();
  var howLongAgoSeconds = (currentDate - date) / 1000 / 60;
  var howLongAgoMinutes = (currentDate - date) / 1000 / 60;
  var howLongAgoHours = (currentDate - date) / 1000 / 60 / 60;
  if (howLongAgoMinutes < 1) {
    return `${Math.floor(howLongAgoSeconds)} seconds ago`;
  } else if (howLongAgoMinutes > 1 && howLongAgoMinutes < 60) {
    return `${Math.floor(howLongAgoMinutes)} minutes ago`;
  } else if (howLongAgoMinutes > 60 && howLongAgoHours < 24) {
    return `${Math.floor(howLongAgoHours)} hours ago`;
  } else if (howLongAgoHours > 24) {
    return `${Math.floor(howLongAgoHours / 24)} days ago`;
  }
}

  $(document).ready(function() {
    $(".new-tweet").hide();
    loadTweets();
    console.log('loadtweets function invoked successfully');
    $('#compose').on('submit', handleComposeSubmit);
    console.log('submit is successful');
    $("button").click(function(){
      $(".new-tweet").slideToggle("fast", function (){});
    });
  });
