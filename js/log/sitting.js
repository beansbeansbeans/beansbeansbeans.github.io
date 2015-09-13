define(['templates/log_detail', 'log/log_renderer', 'log_data'], function(logTemplate, logRenderer, logData) {
    var sitting = {
        selfLoading: true,
        initialize: function() {
            var title = "sitting",
                data = {
                title: title,
                overrides: [
                    {
                        index: 3,
                        width: 1180
                    },
                    {
                        index: 4,
                        width: 750
                    },
                    {
                        index: 5,
                        width: 1700
                    }
                ],
                length: 27,
                guilt: 0.8,
                detail: "An exciting week",
                date: "May 20, 2015",
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
    return sitting;
});