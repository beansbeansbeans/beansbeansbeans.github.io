define(['templates/log_detail', 'log/log_renderer'], function(logTemplate, logRenderer) {
    var tubes = {
        selfLoading: true,
        initialize: function() {
            var data = {
                title: "tubes",
                overrides: [
                    {
                        index: 0,
                        width: 1250
                    },
                    {
                        index: 3,
                        width: 1300
                    }
                ],
                length: 40,
                detail: "Tubing in the Shenandoah",
                date: "June 13, 2015",
                logContents: ""
            };

            $("#view").html(logTemplate(data));

            logRenderer.initialize(data);
        },
        destroy: function() {
            logRenderer.destroy();
        }
    }
    return tubes;
});