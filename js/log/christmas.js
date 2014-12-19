define(['templates/log_detail', 'log/log_renderer'], function(logTemplate, logRenderer) {
    var christmas = {
        selfLoading: true,
        initialize: function() {
            var data = {
                title: "christmas",
                overrides: [
                    {
                        index: 1,
                        width: 1620
                    },
                    {
                        index: 2,
                        width: 1560
                    },
                    {
                        index: 3,
                        width: 885
                    },
                    {
                        index: 4,
                        width: 1350
                    },
                    {
                        index: 5,
                        width: 1200
                    },
                    {
                        index: 6,
                        width: 2260
                    },
                    {
                        index: 7,
                        width: 1700
                    }
                ],
                length: 111,
                detail: "An exciting day",
                date: "December 5, 2014",
                logContents: ""
            };

            $("#view").html(logTemplate(data));

            logRenderer.initialize(data);
        },
        destroy: function() {
            logRenderer.destroy();
        }
    }
    return christmas;
});