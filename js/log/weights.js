define(['templates/log_detail', 'log/log_renderer', 'log_data'], function(logTemplate, logRenderer, logData) {
    var weights = {
        selfLoading: true,
        initialize: function() {
            var title = "weights",
                data = {
                title: title,
                overrides: [
                    {
                        index: 0,
                        width: 2080
                    },
                    {
                        index: 1,
                        width: 1180
                    },
                    {
                        index: 2,
                        width: 800
                    },
                    {
                        index: 4,
                        width: 1670
                    },
                    {
                        index: 5,
                        width: 1260
                    }
                ],
                length: 38,
                detail: "Helen",
                date: "May 1, 2015",
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
    return weights;
});