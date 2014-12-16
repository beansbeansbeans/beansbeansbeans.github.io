define(['templates/log_detail', 'log/log_renderer'], function(logTemplate, logRenderer) {
    var pops = {
        // selfLoading: true,
        initialize: function() {
            var data = {
                title: "pops",
                overrides: [
                    {
                        index: 0,
                        width: 1485
                    },
                    {
                        index: 1,
                        width: 1700
                    },
                    {
                        index: 2,
                        width: 1500
                    }
                ],
                length: 149,
                detail: "A good day",
                date: "December 15, 2014",
                logContents: ""
            };

            $("#view").html(logTemplate(data));

            logRenderer.initialize(data);
        },
        destroy: function() {
            logRenderer.destroy();
        }
    }
    return pops;
});