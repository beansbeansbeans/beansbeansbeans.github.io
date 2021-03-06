define(['templates/log_detail', 'log/log_renderer', 'log_data'], function(logTemplate, logRenderer, logData) {
    var trump = {
        selfLoading: true,
        initialize: function() {
            var title = "trump",
                data = {
                title: title,
                overrides: [
                    {
                        index: 0,
                        width: 1220
                    },
                    {
                        index: 1,
                        width: 1480
                    },
                    {
                        index: 2,
                        width: 1580
                    },
                    {
                        index: 3,
                        width: 2020
                    }
                ],
                guilt: 0.3,
                length: 20,
                detail: "More than an hour",
                date: "August 31, 2015",
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
    return trump;
});