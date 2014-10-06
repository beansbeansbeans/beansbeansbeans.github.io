define(['templates/log_detail', 'log/log_renderer'], function(logTemplate, logRenderer) {
    var oprah = {
        initialize: function() {
            var data = {
                title: "oprah",
                overrides: [
                    {
                        index: 0,
                        width: 1700
                    },
                    {
                        index: 2,
                        width: 1700
                    },
                    {
                        index: 3,
                        width: 1600
                    }
                ],
                length: 83,
                detail: "A good day",
                date: "October 5, 2014",
                logContents: ""
            };

            $("#view").html(logTemplate(data));

            logRenderer.initialize(data);
        },
        destroy: function() {
            logRenderer.destroy();
        }
    }
    return oprah;
});