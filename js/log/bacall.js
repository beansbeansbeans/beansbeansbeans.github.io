define(['templates/log_detail', 'log/log_renderer'], function(logTemplate, logRenderer) {
    var starbucks = {
        initialize: function() {
            var data = {
                title: "bacall",
                detail: "A boring day",
                date: "August 12, 2014",
                logContents: ""
            };

            $("#view").html(logTemplate(data));

            logRenderer.initialize(data.title);
        },
        destroy: function() {
            logRenderer.destroy();
        }
    }
    return starbucks;
});
