define(['templates/log_detail', 'log/log_renderer'], function(logTemplate, logRenderer) {
    var toast = {
        initialize: function() {
            var data = {
                title: "toast",
                overrides: [
                    {
                        index: 0,
                        width: 1220
                    },
                    {
                        index: 2,
                        width: 1700
                    },
                    {
                        index: 3,
                        width: 1320
                    }
                ],
                length: 66,
                detail: "A peaceful day",
                date: "December 8, 2014",
                logContents: ""
            };

            $("#view").html(logTemplate(data));

            logRenderer.initialize(data);
        },
        destroy: function() {
            logRenderer.destroy();
        }
    }
    return toast;
});