define(['templates/log_detail', 'log/log_renderer', 'log_data'], function(logTemplate, logRenderer, logData) {
    var nohemi = {
        selfLoading: true,
        initialize: function() {
            var title = "nohemi",
                data = {
                title: title,
                overrides: [
                    {
                        index: 3,
                        width: 1345
                    },
                    {
                        index: 4,
                        width: 2045
                    }
                ],
                guilt: 0.2,
                length: 46,
                detail: "More than an hour",
                date: "November 20, 2015",
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
    return nohemi;
});