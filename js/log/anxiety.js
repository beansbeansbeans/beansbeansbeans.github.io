define(['templates/log_detail', 'log/log_renderer'], function(logTemplate, logRenderer) {
    var anxiety = {
        initialize: function() {
            var data = {
                title: "anxiety",
                length: 57,
                detail: "A boring day",
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
    return anxiety;
});