define(['templates/log_detail', 'log/log_renderer'], function(logTemplate, logRenderer) {
    var upstairs = {
        selfLoading: true,
        initialize: function() {
            var data = {
                title: "upstairs",
                overrides: [
                    {
                        index: 1,
                        width: 1490
                    },
                    {
                        index: 2,
                        width: 1310
                    },
                    {
                        index: 3,
                        width: 1190
                    },
                    {
                        index: 4,
                        width: 1550
                    }
                ],
                length: 79,
                detail: "A regular day",
                date: "October 8, 2014",
                logContents: ""
            };

            $("#view").html(logTemplate(data));

            logRenderer.initialize(data);
        },
        destroy: function() {
            logRenderer.destroy();
        }
    }
    return upstairs;
});