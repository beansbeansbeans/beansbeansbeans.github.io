define(['templates/log_detail', 'log/log_renderer', 'log_data'], function(logTemplate, logRenderer, logData) {
    var video = {
        selfLoading: true,
        initialize: function() {
            var title = "video",
                data = {
                title: title,
                overrides: [
                    {
                        index: 0,
                        width: 1520
                    },
                    {
                        index: 1,
                        width: 750
                    },
                    {
                        index: 2,
                        width: 1580
                    }
                ],
                guilt: 1,
                length: 49,
                detail: "A typical day",
                date: "September 29, 2014",
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
    return video;
});