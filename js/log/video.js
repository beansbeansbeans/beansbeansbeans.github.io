define(['templates/log_detail', 'log/log_renderer'], function(logTemplate, logRenderer) {
    var video = {
        initialize: function() {
            var data = {
                title: "video",
                length: 76,
                detail: "A typical day",
                date: "September 29, 2014",
                logContents: ""
            };

            $("#view").html(logTemplate(data));

            logRenderer.initialize(data);
        },
        destroy: function() {
            logRenderer.destroy();
        }
    }
    return video;
});