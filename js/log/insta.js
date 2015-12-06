define(['templates/log_detail', 'log/log_renderer', 'log_data'], function(logTemplate, logRenderer, logData) {
    var insta = {
        selfLoading: true,
        initialize: function() {
            var title = "insta",
                data = {
                title: title,
                overrides: [
                    {
                        index: 0,
                        width: 800
                    },
                    {
                        index: 1,
                        width: 1750
                    },
                    {
                        index: 2,
                        width: 1325
                    },
                    {
                        index: 3,
                        width: 1120
                    },
                    {
                        index: 4,
                        width: 1570
                    }
                ],
                guilt: 0.75,
                length: 34,
                detail: "More than an hour",
                date: "December 2, 2015",
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
    return insta;
});