define(['templates/log_detail', 'log/log_renderer'], function(logTemplate, logRenderer) {
    var cara = {
        initialize: function() {
            var data = {
                title: "cara",
                overrides: [
                    {
                        index: 0,
                        width: 1380
                    },
                    {
                        index: 1,
                        width: 1550
                    },
                    {
                        index: 2,
                        width: 1675
                    }
                ],
                length: 90,
                detail: "An unproductive day",
                date: "November 17, 2014",
                logContents: ""
            };

            $("#view").html(logTemplate(data));

            logRenderer.initialize(data);
        },
        destroy: function() {
            logRenderer.destroy();
        }
    }
    return cara;
});