define([], function() {
  var clips = {
    initialize: function() {
      $("#view").html('<div id="clips"><div class="clip_label">ImprovBoston - 4/29/2018</div><iframe width="560" height="315" src="https://www.youtube.com/embed/s9WEfdo-91g?rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe><div class="clip_label">Comedy Studio - 3/4/2018</div><iframe width="560" height="315" src="https://www.youtube.com/embed/zoQ2WW_PBn8?rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe><div class="clip_label">Maggy\'s Lounge  - 2/2/2018</div><iframe width="560" height="315" src="https://www.youtube.com/embed/7aPN0d2C-9c?rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe></div>');

      $("#menu_wrapper").html('<div id="clips_sig">Ann Yuan</div>').attr("style", "margin-bottom: 30px")

      $("#signature").html('annyuan@gmail.com').attr("href", "mailto:annyuan@gmail.com")
    }
  }
  return clips;
})
