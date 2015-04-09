define(['templates/log_detail', 'log/log_renderer'], function(logTemplate, logRenderer) {
    var birthday = {
        selfLoading: true,
        initialize: function() {
            var data = {
                title: "birthday",
                overrides: [
                    {
                        index: 0,
                        width: 1400
                    },
                    {
                        index: 1,
                        width: 750
                    },
                    {
                        index: 2,
                        width: 1520
                    },
                    {
                        index: 3,
                        width: 1200
                    },
                    {
                        index: 4,
                        width: 1600
                    },
                    {
                        index: 5,
                        width: 1600
                    },
                    {
                        index: 6,
                        width: 1410
                    }
                ],
                length: 39,
                detail: "A good day",
                date: "March 27, 2015",
                logContents: ""
            };

            $("#view").html(logTemplate(data));

            logRenderer.initialize(data);
        },
        destroy: function() {
            logRenderer.destroy();
        }
    }
    return birthday;
});