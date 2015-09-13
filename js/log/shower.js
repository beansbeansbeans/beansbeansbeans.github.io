define(['templates/log_detail', 'log/log_renderer', 'log_data', 'underscore'], function(logTemplate, logRenderer, logData, _) {
    var shower = {
        selfLoading: true,
        initialize: function() {
            var title = "shower",
                data = {
                title: title,
                overrides: [
                    {
                        index: 0,
                        width: 1265
                    },
                    {
                        index: 3,
                        width: 2100
                    }
                ],
                guilt: 0,
                length: 18,
                detail: "An unproductive day",
                date: "December 25, 2014",
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
    return shower;
});