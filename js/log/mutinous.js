define(['templates/log_detail', 'log/log_renderer'], function(logTemplate, logRenderer) {
    var mutinous = {
        selfLoading: true,
        initialize: function() {
            var data = {
                title: "mutinous",
                overrides: [
                    {
                        index: 2,
                        width: 1225
                    }
                ],
                length: 99,
                detail: "An average day",
                date: "November 5, 2014",
                logContents: ""
            };

            $("#view").html(logTemplate(data));

            logRenderer.initialize(data);
        },
        destroy: function() {
            logRenderer.destroy();
        }
    }
    return mutinous;
});