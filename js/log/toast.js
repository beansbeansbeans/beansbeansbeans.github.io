define(['templates/log_detail', 'log/log_renderer', 'log_data'], function(logTemplate, logRenderer, logData) {
    var toast = {
        selfLoading: true,
        initialize: function() {
            var title = "toast",
                data = {
                title: title,
                overrides: [
                    {
                        index: 0,
                        width: 1220
                    },
                    {
                        index: 2,
                        width: 1700
                    },
                    {
                        index: 3,
                        width: 1320
                    }
                ],
                guilt: 1,
                length: 11,
                detail: "A peaceful day",
                date: "December 8, 2014",
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
    return toast;
});