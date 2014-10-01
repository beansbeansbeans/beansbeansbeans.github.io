define(['templates/log_detail', 'log/log_renderer'], function(logTemplate, logRenderer) {
    var posterboard = {
        initialize: function() {
            var data = {
                title: "posterboard",
                length: 63,
                detail: "An exciting day",
                date: "September 12, 2014",
                logContents: ""
            };

            $("#view").html(logTemplate(data));

            logRenderer.initialize(data);
        },
        destroy: function() {
            logRenderer.destroy();
        }
    }
    return posterboard;
});