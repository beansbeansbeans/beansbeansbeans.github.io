define(['templates/log_detail', 'log/log_renderer'], function(logTemplate, logRenderer) {
    var posterboard = {
        initialize: function() {
            var data = {
                title: "posterboard",
                overrides: [
                    {
                        index: 2,
                        width: 1300
                    },
                    {
                        index: 3,
                        width: 1200
                    },
                    {
                        index: 5,
                        width: 1500
                    },
                    {
                        index: 9,
                        width: 1500
                    },
                    {
                        index: 8,
                        width: 1600
                    }
                ],
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