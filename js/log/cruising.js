define(['templates/log_detail', 'log/log_renderer', 'log_data'], function(logTemplate, logRenderer, logData) {
    var cruising = {
        selfLoading: true,
        initialize: function() {
            var title = "cruising",
                data = {
                title: title,
                overrides: [
                    {
                        index: 0,
                        width: 1350
                    },
                    {
                        index: 1,
                        width: 1500
                    }
                ],
                length: 85,
                detail: "An exciting week",
                date: "March 22, 2015",
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
    return cruising;
});