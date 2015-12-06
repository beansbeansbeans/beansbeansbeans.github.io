define(['templates/log_detail', 'log/log_renderer', 'log_data'], function(logTemplate, logRenderer, logData) {
    var lobster = {
        selfLoading: true,
        initialize: function() {
            var title = "lobster",
                data = {
                title: title,
                overrides: [
                    {
                        index: 0,
                        width: 1250
                    },
                    {
                        index: 2,
                        width: 1510
                    },
                    {
                        index: 3,
                        width: 1320
                    },
                    {
                        index: 4,
                        width: 1235
                    }
                ],
                guilt: 0.05,
                length: 21,
                detail: "More than an hour",
                date: "November 27, 2015",
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
    return lobster;
});