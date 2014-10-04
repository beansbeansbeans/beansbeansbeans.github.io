define(['templates/log_detail', 'log/log_renderer'], function(logTemplate, logRenderer) {
    var boyhood = {
        initialize: function() {
            var data = {
                title: "boyhood",
                length: 82,
                detail: "A regular day",
                date: "September 22, 2014",
                logContents: ""
            };

            $("#view").html(logTemplate(data));

            logRenderer.initialize(data);
        },
        destroy: function() {
            logRenderer.destroy();
        }
    }
    return boyhood;
});