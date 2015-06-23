define(['templates/log_detail', 'log/log_renderer'], function(logTemplate, logRenderer) {
    var bridesmen = {
        selfLoading: true,
        initialize: function() {
            var data = {
                title: "bridesmen",
                overrides: [
                    {
                        index: 1,
                        width: 1560
                    },
                    {
                        index: 2,
                        width: 770
                    },
                    {
                        index: 3,
                        width: 1580
                    },
                    {
                        index: 4,
                        width: 1300
                    },
                    {
                        index: 5,
                        width: 1350
                    },
                    {
                        index: 6,
                        width: 2080
                    }
                ],
                length: 31,
                detail: "Hampden",
                date: "April 22, 2015",
                logContents: ""
            };

            $("#view").html(logTemplate(data));

            logRenderer.initialize(data);
        },
        destroy: function() {
            logRenderer.destroy();
        }
    }
    return bridesmen;
});