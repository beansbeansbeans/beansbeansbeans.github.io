define(['templates/log_detail', 'log/log_renderer', 'log_data'], function(logTemplate, logRenderer, logData) {
    var didion = {
        selfLoading: true,
        initialize: function() {
            var title = "didion",
                data = {
                title: title,
                overrides: [
                    {
                        index: 1,
                        width: 800
                    }
                ],
                length: 13,
                guilt: 0,
                detail: "A boring day",
                date: "March 2, 2014",
                logContents: ""
            };

            var indexOfPost = -1;
            for(var i=0; i<logData.length; i++) {
                if(logData[i].title === title) {
                    indexOfPost = i;
                    break;
                }
            }

            if(indexOfPost !== 0) {
                data.previous = logData[indexOfPost - 1].title;
            }
            if(indexOfPost !== (logData.length - 1)) {
                data.next = logData[indexOfPost + 1].title;
            }

            $("#view").html(logTemplate(data));

            logRenderer.initialize(data);
        },
        destroy: function() {
            logRenderer.destroy();
        }
    }
    return didion;
});