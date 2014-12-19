define(['templates/log_detail', 'log/log_renderer'], function(logTemplate, logRenderer) {
    var danimal = {
        selfLoading: true,
        initialize: function() {
            var data = {
                title: "danimal",
                overrides: [
                    {
                        index: 1,
                        width: 1600
                    },
                    {
                        index: 4,
                        width: 2200
                    },
                    {
                        index: 5,
                        width: 1600
                    }
                ],
                length: 78,
                detail: "A good day",
                date: "October 27, 2014",
                logContents: ""
            };

            $("#view").html(logTemplate(data));

            logRenderer.initialize(data);
        },
        destroy: function() {
            logRenderer.destroy();
        }
    }
    return danimal;
});