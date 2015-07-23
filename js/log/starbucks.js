define(['templates/log_detail', 'log/log_renderer', 'log_data'], function(logTemplate, logRenderer, logData) {
    var starbucks = {
        selfLoading: true,
        initialize: function() {
            var title = "starbucks",
                data = {
                title: title,
                overrides: [
                    {
                        index: 0,
                        width: 1350
                    },
                    {
                        index: 1,
                        width: 1225
                    },
                    {
                        index: 2,
                        width: 1625
                    },
                    {
                        index: 3,
                        width: 1580
                    },
                    {
                        index: 7,
                        width: 1750
                    }
                ],
                length: 58,
                detail: "A good day",
                date: "November 27, 2014",
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
    return starbucks;
});