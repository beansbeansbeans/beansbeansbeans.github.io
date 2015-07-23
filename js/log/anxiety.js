define(['templates/log_detail', 'log/log_renderer', 'log_data'], function(logTemplate, logRenderer, logData) {
    var anxiety = {
        selfLoading: true,
        initialize: function() {
            var title = "anxiety",
                data = {
                title: title,
                overrides: [
                    {
                        index: 0,
                        width: 1560
                    },
                    {
                        index: 1,
                        width: 1800
                    },
                    {
                        index: 2,
                        width: 1500
                    },
                    {
                        index: 3,
                        width: 700
                    },
                    {
                        index: 5,
                        width: 1350
                    }
                ],
                length: 57,
                detail: "A boring day",
                date: "September 12, 2014",
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
    return anxiety;
});