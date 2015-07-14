define(['templates/log_detail', 'log/log_renderer'], function(logTemplate, logRenderer) {
    var tayvin = {
        selfLoading: true,
        initialize: function() {
            var data = {
                title: "tayvin",
                overrides: [
                    {
                        index: 0,
                        width: 1125
                    },
                    {
                        index: 1,
                        width: 1425
                    },
                    {
                        index: 2,
                        width: 1600
                    },
                    {
                        index: 3,
                        width: 1500
                    },
                    {
                        index: 4,
                        width: 750
                    }
                ],
                length: 42,
                detail: "Two hours",
                date: "July 13, 2015",
                logContents: ""
            };

            $("#view").html(logTemplate(data));

            logRenderer.initialize(data);
        },
        destroy: function() {
            logRenderer.destroy();
        }
    }
    return tayvin;
});