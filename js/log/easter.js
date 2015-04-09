define(['templates/log_detail', 'log/log_renderer'], function(logTemplate, logRenderer) {
    var easter = {
        selfLoading: true,
        initialize: function() {
            var data = {
                title: "easter",
                overrides: [
                    {
                        index: 0,
                        width: 1320
                    },
                    {
                        index: 1,
                        width: 1630
                    },
                    {
                        index: 2,
                        width: 1290
                    },
                    {
                        index: 3,
                        width: 1200
                    }
                ],
                length: 60,
                detail: "A good day",
                date: "April 8, 2015",
                logContents: ""
            };

            $("#view").html(logTemplate(data));

            logRenderer.initialize(data);
        },
        destroy: function() {
            logRenderer.destroy();
        }
    }
    return easter;
});