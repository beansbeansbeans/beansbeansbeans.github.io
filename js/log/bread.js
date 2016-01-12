define(['templates/log_detail', 'log/log_renderer', 'log_data'], function(logTemplate, logRenderer, logData) {
    var bread = {
        selfLoading: true,
        initialize: function() {
            var title = "bread",
                data = {
                title: title,
                overrides: [
                    {
                        index: 0,
                        width: 1410
                    },
                    {
                        index: 1,
                        width: 1500
                    },
                    {
                        index: 2,
                        width: 1320
                    },
                    {
                        index: 3,
                        width: 1565
                    }
                ],
                guilt: 0.8,
                length: 39,
                detail: "More than an hour",
                date: "January 6, 2016",
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
    return bread;
});