define(['templates/log_detail', 'log/log_renderer'], function(logTemplate, logRenderer) {
    var bacall = {
        initialize: function() {
            var data = {
                title: "bacall",
                length: 46,
                detail: "A boring day",
                date: "August 12, 2014",
                logContents: ""
            };

            $("#view").html(logTemplate(data));

            logRenderer.initialize(data);
        },
        destroy: function() {
            logRenderer.destroy();
        }
    }
    return bacall;
});