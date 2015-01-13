define(['templates/log_detail', 'log/log_renderer'], function(logTemplate, logRenderer) {
    var running = {
        selfLoading: true,
        initialize: function() {
            var data = {
                title: "running",
                overrides: [
                    {
                        index: 0,
                        width: 1490
                    },
                    {
                        index: 1,
                        width: 1590
                    }
                ],
                length: 69,
                detail: "A boring day",
                date: "January 12, 2015",
                logContents: ""
            };

            $("#view").html(logTemplate(data));

            logRenderer.initialize(data);
        },
        destroy: function() {
            logRenderer.destroy();
        }
    }
    return running;
});