define(['templates/log_detail', 'log/log_renderer'], function(logTemplate, logRenderer) {
    var starbucks = {
        initialize: function() {
            var data = {
                title: "starbucks",
                overrides: [
                    {
                        index: 0,
                        width: 1350
                    },
                    {
                        index: 1,
                        width: 1225
                    },
                    {
                        index: 2,
                        width: 1625
                    },
                    {
                        index: 3,
                        width: 1580
                    },
                    {
                        index: 7,
                        width: 1750
                    }
                ],
                length: 58,
                detail: "A good day",
                date: "November 27, 2014",
                logContents: ""
            };

            $("#view").html(logTemplate(data));

            logRenderer.initialize(data);
        },
        destroy: function() {
            logRenderer.destroy();
        }
    }
    return starbucks;
});