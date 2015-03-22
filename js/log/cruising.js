define(['templates/log_detail', 'log/log_renderer'], function(logTemplate, logRenderer) {
    var cruising = {
        selfLoading: true,
        initialize: function() {
            var data = {
                title: "cruising",
                overrides: [
                    {
                        index: 0,
                        width: 1350
                    },
                    {
                        index: 1,
                        width: 1500
                    }
                ],
                length: 85,
                detail: "An exciting week",
                date: "March 22, 2015",
                logContents: ""
            };

            $("#view").html(logTemplate(data));

            logRenderer.initialize(data);
        },
        destroy: function() {
            logRenderer.destroy();
        }
    }
    return cruising;
});