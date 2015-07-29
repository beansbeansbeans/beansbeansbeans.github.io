define(['templates/log_detail', 'log/log_renderer', 'log_data'], function(logTemplate, logRenderer, logData) {
    var unapologetic = {
        selfLoading: true,
        initialize: function() {
            var title = "unapologetic",
                data = {
                title: title,
                overrides: [],
                guilt: 0,
                length: 248,
                date: "Autism",
                logContents: ""
            };

            $("#view").html(logTemplate(data));

            logRenderer.initialize(data);
        },
        destroy: function() {
            logRenderer.destroy();
        }
    }
    return unapologetic;
});