$(document).ready(function() {
  $.urlParam = function(name) {
    var results = new RegExp('[?&]' + name + '=([^&#]*)').exec(
      window.location.href,
    );
    if (results == null) {
      return null;
    } else {
      return decodeURI(results[1]) || 0;
    }
  };
});

$(document).ready(function() {
  $(function() {
    $('#next').click(function() {
      nextId();
    });
  });
  $(function() {
    $('#prev').click(function() {
      prevId();
    });
    $('img').click(function() {
      $('.selected').removeClass('selected'); // removes the previous selected class
      $(this).addClass('selected'); // adds the class to the clicked image
    });
  });
});

function nextId() {
  newId = parseInt($.urlParam('id')) + 1 || 1;
  window.location = '?id=' + newId;
}

function prevId() {
  newId = parseInt($.urlParam('id')) - 1;
  if (newId < 0) {
    newId = 0;
  }
  window.location = '?id=' + newId;
}

function saveToDB(id, link, image) {
  var data = {};
  data.link = link;
  data.id = id;
  data.image = image;
  $.ajax({
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json',
    url: '/saved',
    success: function(data) {
      console.log('success');
    },
    error: function(data) {
      console.log('error: ', data);
    },
  });
}
document.onkeydown = checkKey;

function checkKey(e) {
  e = e || window.event;

  if (e.keyCode == '37') {
    prevId();
  } else if (e.keyCode == '39') {
    nextId();
  } else if (e.keyCode == '49') {
    $('#img_0').click();
  } else if (e.keyCode == '50') {
    $('#img_1').click();
  } else if (e.keyCode == '51') {
    $('#img_2').click();
  } else if (e.keyCode == '52') {
    $('#img_3').click();
  } else if (e.keyCode == '53') {
    $('#img_4').click();
  }
}
