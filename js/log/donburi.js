define(['templates/log_detail', 'log/log_renderer'], function(logTemplate, logRenderer) {
    var donburi = {
        selfLoading: true,
        initialize: function() {
            var data = {
                title: "donburi",
                overrides: [
                    {
                        index: 4,
                        width: 1550
                    },
                    {
                        index: 5,
                        width: 1590
                    }
                ],
                length: 78,
                detail: "An exciting day",
                date: "October 15, 2014",
                logContents: ""
            };

            $("#view").html(logTemplate(data));

            logRenderer.initialize(data);
        },
        destroy: function() {
            logRenderer.destroy();
        }
    }
    return donburi;
});