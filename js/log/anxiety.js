define(['templates/log_detail', 'log/log_renderer'], function(logTemplate, logRenderer) {
    var anxiety = {
        initialize: function() {
            var data = {
                title: "anxiety",
                overrides: [
                    {
                        index: 0,
                        width: 1560
                    },
                    {
                        index: 1,
                        width: 1800
                    },
                    {
                        index: 2,
                        width: 1500
                    },
                    {
                        index: 3,
                        width: 700
                    },
                    {
                        index: 5,
                        width: 1350
                    }
                ],
                length: 57,
                detail: "A boring day",
                date: "September 12, 2014",
                logContents: ""
            };

            $("#view").html(logTemplate(data));

            logRenderer.initialize(data);
        },
        destroy: function() {
            logRenderer.destroy();
        }
    }
    return anxiety;
});