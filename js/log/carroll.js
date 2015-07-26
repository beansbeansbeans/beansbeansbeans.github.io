define(['templates/log_detail', 'log/log_renderer', 'log_data'], function(logTemplate, logRenderer, logData) {
    var carroll = {
        selfLoading: true,
        initialize: function() {
            var title = "carroll",
                data = {
                title: title,
                overrides: [
                    {
                        index: 0,
                        width: 1450
                    },
                    {
                        index: 1,
                        width: 1600
                    },
                    {
                        index: 2,
                        width: 1550
                    },
                    {
                        index: 3,
                        width: 1500
                    },
                    {
                        index: 5,
                        width: 1250
                    }
                ],
                guilt: 0.25,
                length: 43,
                detail: "More than an hour",
                date: "July 18, 2015",
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
    return carroll;
});