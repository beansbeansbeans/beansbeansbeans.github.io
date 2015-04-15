define(['templates/log_detail', 'log/log_renderer'], function(logTemplate, logRenderer) {
    var chess = {
        selfLoading: true,
        initialize: function() {
            var data = {
                title: "chess",
                overrides: [
                    {
                        index: 2,
                        width: 1300
                    },
                    {
                        index: 3,
                        width: 1300
                    }
                ],
                length: 91,
                detail: "An unproductive day",
                date: "April 15, 2015",
                logContents: ""
            };

            $("#view").html(logTemplate(data));

            logRenderer.initialize(data);
        },
        destroy: function() {
            logRenderer.destroy();
        }
    }
    return chess;
});