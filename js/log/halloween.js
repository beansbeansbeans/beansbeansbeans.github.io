define(['templates/log_detail', 'log/log_renderer'], function(logTemplate, logRenderer) {
    var halloween = {
        initialize: function() {
            var data = {
                title: "halloween",
                overrides: [
                    {
                        index: 0,
                        width: 1750
                    },
                    {
                        index: 1,
                        width: 1600
                    },
                    {
                        index: 5,
                        width: 2100
                    }
                ],
                length: 47,
                detail: "A good day",
                date: "October 22, 2014",
                logContents: ""
            };

            $("#view").html(logTemplate(data));

            logRenderer.initialize(data);
        },
        destroy: function() {
            logRenderer.destroy();
        }
    }
    return halloween;
});