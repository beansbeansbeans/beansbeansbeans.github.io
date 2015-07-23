define(['templates/log_detail', 'log/log_renderer', 'log_data'], function(logTemplate, logRenderer, logData) {
    var okcupid = {
        selfLoading: true,
        initialize: function() {
            var title = "okcupid",
                data = {
                title: title,
                overrides: [
                    {
                        index: 1,
                        width: 1520
                    },
                    {
                        index: 2,
                        width: 1370
                    },
                    {
                        index: 4,
                        width: 1500
                    }
                ],
                length: 36,
                detail: "Schuyler",
                date: "May 8, 2015",
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
    return okcupid;
});