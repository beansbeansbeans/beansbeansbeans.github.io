define(['templates/log_detail', 'log/log_renderer'], function(logTemplate, logRenderer) {
    var dolcezza = {
        selfLoading: true,
        initialize: function() {
            var data = {
                title: "dolcezza",
                overrides: [
                    {
                        index: 0,
                        width: 1650
                    },
                    {
                        index: 2,
                        width: 1250
                    },
                    {
                        index: 3,
                        width: 1345
                    },
                    {
                        index: 4,
                        width: 1300
                    },
                    {
                        index: 5,
                        width: 1550
                    },
                    {
                        index: 6,
                        width: 1550
                    }
                ],
                length: 33,
                detail: "coffee and an argument",
                date: "June 22, 2015",
                logContents: ""
            };

            $("#view").html(logTemplate(data));

            logRenderer.initialize(data);
        },
        destroy: function() {
            logRenderer.destroy();
        }
    }
    return dolcezza;
});