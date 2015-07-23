define(['templates/log_detail', 'log/log_renderer', 'log_data', 'underscore'], function(logTemplate, logRenderer, logData, _) {
    var cara = {
        selfLoading: true,
        initialize: function() {
            var title = "cara",
                data = {
                title: title,
                overrides: [
                    {
                        index: 0,
                        width: 1380
                    },
                    {
                        index: 1,
                        width: 1550
                    },
                    {
                        index: 2,
                        width: 1675
                    }
                ],
                length: 90,
                detail: "An unproductive day",
                date: "November 17, 2014",
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
    return cara;
});