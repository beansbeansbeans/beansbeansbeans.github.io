define(['templates/log_detail', 'log/log_renderer', 'log_data'], function(logTemplate, logRenderer, logData) {
    var tayvin = {
        selfLoading: true,
        initialize: function() {
            var title = "tayvin",
                data = {
                title: title,
                overrides: [
                    {
                        index: 0,
                        width: 1125
                    },
                    {
                        index: 1,
                        width: 1425
                    },
                    {
                        index: 2,
                        width: 1600
                    },
                    {
                        index: 3,
                        width: 1500
                    },
                    {
                        index: 4,
                        width: 750
                    }
                ],
                length: 42,
                guilt: 0.8,
                detail: "Two hours",
                date: "July 13, 2015",
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
    return tayvin;
});