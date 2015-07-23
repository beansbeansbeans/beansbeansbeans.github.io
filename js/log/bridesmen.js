define(['templates/log_detail', 'log/log_renderer', 'log_data'], function(logTemplate, logRenderer, logData) {
    var bridesmen = {
        selfLoading: true,
        initialize: function() {
            var title = "bridesmen",
                data = {
                title: title,
                overrides: [
                    {
                        index: 1,
                        width: 1560
                    },
                    {
                        index: 2,
                        width: 770
                    },
                    {
                        index: 3,
                        width: 1580
                    },
                    {
                        index: 4,
                        width: 1300
                    },
                    {
                        index: 5,
                        width: 1350
                    },
                    {
                        index: 6,
                        width: 2080
                    }
                ],
                length: 31,
                detail: "Hampden",
                date: "April 22, 2015",
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
    return bridesmen;
});