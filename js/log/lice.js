define(['templates/log_detail', 'log/log_renderer', 'log_data'], function(logTemplate, logRenderer, logData) {
    var lice = {
        selfLoading: true,
        initialize: function() {
            var title = "lice",
                data = {
                title: title,
                overrides: [
                    {
                        index: 0,
                        width: 1250
                    },
                    {
                        index: 1,
                        width: 800
                    }
                ],
                guilt: 0.05,
                length: 21,
                detail: "More than an hour",
                date: "November 23, 2015",
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
    return lice;
});