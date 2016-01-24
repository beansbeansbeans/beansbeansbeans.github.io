define(['templates/log_detail', 'log/log_renderer', 'log_data'], function(logTemplate, logRenderer, logData) {
    var avery = {
        selfLoading: true,
        initialize: function() {
            var title = "avery",
                data = {
                title: title,
                initialBuffer: 55,
                overrides: [
                    {
                        index: 0,
                        width: 1350
                    },
                    {
                        index: 1,
                        width: 1570
                    },
                    {
                        index: 3,
                        width: 1550
                    },
                    {
                        index: 4,
                        width: 1470
                    }
                ],
                guilt: 0.9,
                length: 56,
                detail: "More than an hour",
                date: "January 20, 2016",
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
    return avery;
});