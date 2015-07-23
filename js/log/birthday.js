define(['templates/log_detail', 'log/log_renderer', 'log_data'], function(logTemplate, logRenderer, logData) {
    var birthday = {
        selfLoading: true,
        initialize: function() {
            var title = "birthday",
                data = {
                title: title,
                overrides: [
                    {
                        index: 0,
                        width: 1400
                    },
                    {
                        index: 1,
                        width: 750
                    },
                    {
                        index: 2,
                        width: 1520
                    },
                    {
                        index: 3,
                        width: 1200
                    },
                    {
                        index: 4,
                        width: 1600
                    },
                    {
                        index: 5,
                        width: 1600
                    },
                    {
                        index: 6,
                        width: 1410
                    }
                ],
                length: 39,
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
    return birthday;
});