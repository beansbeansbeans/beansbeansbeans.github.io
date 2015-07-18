define(['templates/log_detail', 'log/log_renderer'], function(logTemplate, logRenderer) {
    var carroll = {
        selfLoading: true,
        initialize: function() {
            var data = {
                title: "carroll",
                overrides: [
                    {
                        index: 0,
                        width: 1450
                    },
                    {
                        index: 1,
                        width: 1600
                    },
                    {
                        index: 2,
                        width: 1550
                    },
                    {
                        index: 3,
                        width: 1500
                    },
                    {
                        index: 5,
                        width: 1250
                    }
                ],
                length: 43,
                detail: "More than an hour",
                date: "July 18, 2015",
                logContents: ""
            };

            $("#view").html(logTemplate(data));

            logRenderer.initialize(data);
        },
        destroy: function() {
            logRenderer.destroy();
        }
    }
    return carroll;
});