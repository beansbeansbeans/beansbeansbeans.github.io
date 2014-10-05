define(['templates/log_detail', 'log/log_renderer'], function(logTemplate, logRenderer) {
    var oprah = {
        initialize: function() {
            var data = {
                title: "oprah",
                length: 83,
                detail: "A good day",
                date: "October 5, 2014",
                logContents: ""
            };

            $("#view").html(logTemplate(data));

            logRenderer.initialize(data);
        },
        destroy: function() {
            logRenderer.destroy();
        }
    }
    return oprah;
});