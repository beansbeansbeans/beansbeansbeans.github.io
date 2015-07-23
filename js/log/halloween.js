define(['templates/log_detail', 'log/log_renderer', 'log_data'], function(logTemplate, logRenderer, logData) {
    var halloween = {
        selfLoading: true,
        initialize: function() {
            var title = "halloween",
                data = {
                title: title,
                overrides: [
                    {
                        index: 0,
                        width: 1750
                    },
                    {
                        index: 1,
                        width: 1600
                    },
                    {
                        index: 5,
                        width: 2100
                    }
                ],
                length: 47,
                detail: "A good day",
                date: "October 22, 2014",
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
    return halloween;
});