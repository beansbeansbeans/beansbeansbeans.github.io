define(['templates/log_detail', 'log/log_renderer'], function(logTemplate, logRenderer) {
    var pushpop = {
        selfLoading: true,
        initialize: function() {
            var data = {
                title: "pushpop",
                overrides: [],
                length: 55,
                detail: "A good day",
                date: "February 20, 2015",
                logContents: ""
            };

            $("#view").html(logTemplate(data));

            logRenderer.initialize(data);
        },
        destroy: function() {
            logRenderer.destroy();
        }
    }
    return pushpop;
});