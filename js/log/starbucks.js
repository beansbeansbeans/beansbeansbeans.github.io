define(['templates/log_detail', 'log/log_renderer'], function(logTemplate, logRenderer) {
    var starbucks = {
        initialize: function() {
            var data = {
                title: "starbucks",
                detail: "About a dude",
                date: "06/28/2014",
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
