define(['templates/log_detail', 'log/log_renderer'], function(logTemplate, logRenderer) {
    var weights = {
        selfLoading: true,
        initialize: function() {
            var data = {
                title: "weights",
                overrides: [
                    {
                        index: 0,
                        width: 2080
                    },
                    {
                        index: 1,
                        width: 1180
                    },
                    {
                        index: 2,
                        width: 800
                    },
                    {
                        index: 4,
                        width: 1670
                    },
                    {
                        index: 5,
                        width: 1260
                    }
                ],
                length: 38,
                detail: "Helen",
                date: "May 1, 2015",
                logContents: ""
            };

            $("#view").html(logTemplate(data));

            logRenderer.initialize(data);
        },
        destroy: function() {
            logRenderer.destroy();
        }
    }
    return weights;
});