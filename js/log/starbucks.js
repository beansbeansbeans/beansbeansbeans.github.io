define(['templates/log_detail', 'log/log_renderer'], function(logTemplate, logRenderer) {
    var starbucks = {
        initialize: function() {
            var data = {
                title: "starbucks",
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
