define(['templates/log_detail', 'log/log_renderer', 'log_data'], function(logTemplate, logRenderer, logData) {
    var posterboard = {
        selfLoading: true,
        initialize: function() {
            var title = "posterboard",
                data = {
                title: title,
                overrides: [
                    {
                        index: 2,
                        width: 1300
                    },
                    {
                        index: 3,
                        width: 1200
                    },
                    {
                        index: 5,
                        width: 1500
                    },
                    {
                        index: 9,
                        width: 1500
                    },
                    {
                        index: 8,
                        width: 1600
                    }
                ],
                length: 63,
                detail: "An exciting day",
                date: "September 12, 2014",
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
    return posterboard;
});