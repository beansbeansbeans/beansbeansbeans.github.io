define(['templates/log_detail', 'log/log_renderer'], function(logTemplate, logRenderer) {
    var okcupid = {
        selfLoading: true,
        initialize: function() {
            var data = {
                title: "okcupid",
                overrides: [
                    {
                        index: 1,
                        width: 1520
                    },
                    {
                        index: 2,
                        width: 1370
                    },
                    {
                        index: 4,
                        width: 1500
                    }
                ],
                length: 36,
                detail: "Schuyler",
                date: "May 8, 2015",
                logContents: ""
            };

            $("#view").html(logTemplate(data));

            logRenderer.initialize(data);
        },
        destroy: function() {
            logRenderer.destroy();
        }
    }
    return okcupid;
});