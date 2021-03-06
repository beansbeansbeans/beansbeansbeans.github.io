define(['templates/log_detail', 'log/log_renderer', 'log_data'], function(logTemplate, logRenderer, logData) {
    var danny = {
        selfLoading: true,
        initialize: function() {
            var title = "danny",
                data = {
                title: title,
                overrides: [
                    {
                        index: 0,
                        width: 1590
                    },
                    {
                        index: 1,
                        width: 1580
                    },
                    {
                        index: 2,
                        width: 1700
                    },
                    {
                        index: 3,
                        width: 1850
                    }
                ],
                guilt: 0.8,
                length: 21,
                detail: "More than an hour",
                date: "September 20, 2015",
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
    return danny;
});