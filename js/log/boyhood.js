define(['templates/log_detail', 'log/log_renderer', 'log_data'], function(logTemplate, logRenderer, logData) {
    var boyhood = {
        selfLoading: true,
        initialize: function() {
            var title = "boyhood",
                data = {
                title: title,
                length: 41,
                guilt: 0,
                detail: "A regular day",
                date: "September 22, 2014",
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
    return boyhood;
});