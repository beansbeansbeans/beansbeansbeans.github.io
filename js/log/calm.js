define(['templates/log_detail', 'log/log_renderer', 'log_data'], function(logTemplate, logRenderer, logData) {
    var calm = {
        selfLoading: true,
        initialize: function() {
            var title = "calm",
                data = {
                title: title,
                overrides: [
                    {
                        index: 0,
                        width: 1375
                    },
                    {
                        index: 1,
                        width: 1550
                    }
                ],
                length: 37,
                guilt: 0.3,
                date: "August 2, 2015",
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
    return calm;
});