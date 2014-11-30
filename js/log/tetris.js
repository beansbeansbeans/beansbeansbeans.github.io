define(['templates/log_detail', 'log/log_renderer'], function(logTemplate, logRenderer) {
    var tetris = {
        initialize: function() {
            var data = {
                title: "tetris",
                overrides: [
                    {
                        index: 0,
                        width: 1200
                    },
                    {
                        index: 1,
                        width: 1265
                    },
                    {
                        index: 2,
                        width: 1200
                    },
                    {
                        index: 3,
                        width: 1570
                    }
                ],
                length: 66,
                detail: "A good day",
                date: "November 30, 2014",
                logContents: ""
            };

            $("#view").html(logTemplate(data));

            logRenderer.initialize(data);
        },
        destroy: function() {
            logRenderer.destroy();
        }
    }
    return tetris;
});