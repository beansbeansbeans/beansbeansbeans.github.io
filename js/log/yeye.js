define(['templates/log_detail', 'log/log_renderer'], function(logTemplate, logRenderer) {
    var yeye = {
        selfLoading: true,
        initialize: function() {
            var data = {
                title: "yeye",
                overrides: [
                    {
                        index: 1,
                        width: 1365
                    }
                ],
                length: 42,
                detail: "A stressful day",
                date: "December 10, 2014",
                logContents: ""
            };

            $("#view").html(logTemplate(data));

            logRenderer.initialize(data);
        },
        destroy: function() {
            logRenderer.destroy();
        }
    }
    return yeye;
});