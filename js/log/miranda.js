define(['templates/log_detail', 'log/log_renderer'], function(logTemplate, logRenderer) {
    var miranda = {
        selfLoading: true,
        initialize: function() {
            var data = {
                title: "miranda",
                overrides: [
                    {
                        index: 1,
                        width: 775
                    },
                    {
                        index: 2,
                        width: 1700
                    },
                    {
                        index: 3,
                        width: 1575
                    },
                    {
                        index: 4,
                        width: 1700
                    }
                ],
                length: 93,
                detail: "A productive day",
                date: "November 9, 2014",
                logContents: ""
            };

            $("#view").html(logTemplate(data));

            logRenderer.initialize(data);
        },
        destroy: function() {
            logRenderer.destroy();
        }
    }
    return miranda;
});