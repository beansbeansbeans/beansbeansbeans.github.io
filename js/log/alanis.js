define(['templates/log_detail', 'log/log_renderer', 'log_data'], function(logTemplate, logRenderer, logData) {
    var alanis = {
        selfLoading: true,
        initialize: function() {
            var title = "alanis",
                data = {
                title: title,
                initialBuffer: 55,
                overrides: [
                    {
                        index: 0,
                        width: 1570
                    },
                    {
                        index: 1,
                        width: 1370
                    },
                    {
                        index: 2,
                        width: 1570
                    },
                    {
                        index: 3,
                        width: 1660
                    },
                    {
                        index: 5,
                        width: 1300
                    }
                ],
                guilt: 0.1,
                length: 57,
                detail: "More than an hour",
                date: "January 27, 2016",
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
    return alanis;
});