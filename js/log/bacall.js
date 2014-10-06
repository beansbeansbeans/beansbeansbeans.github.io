define(['templates/log_detail', 'log/log_renderer'], function(logTemplate, logRenderer) {
    var bacall = {
        initialize: function() {
            var data = {
                title: "bacall",
                overrides: [
                    {
                        index: 0,
                        width: 1500
                    },
                    {
                        index: 1,
                        width: 1480
                    },
                    {
                        index: 2,
                        width: 1400
                    },
                    {
                        index: 3,
                        width: 1550
                    },
                    {
                        index: 4,
                        width: 1200
                    }
                ],
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