define(['templates/log_detail', 'log/log_renderer', 'log_data'], function(logTemplate, logRenderer, logData) {
    var chairs = {
        selfLoading: true,
        initialize: function() {
            var title = "chairs",
                data = {
                title: title,
                overrides: [
                    {
                        index: 1,
                        width: 1720
                    },
                    {
                        index: 2,
                        width: 1570
                    },
                    {
                        index: 3,
                        width: 750
                    }
                ],
                guilt: 0,
                length: 26,
                detail: "A good day",
                date: "March 27, 2015",
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
    return chairs;
});