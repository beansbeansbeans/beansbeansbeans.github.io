define(['templates/log_detail', 'log/log_renderer', 'log_data'], function(logTemplate, logRenderer, logData) {
    var petunia = {
        selfLoading: true,
        initialize: function() {
            var title = "petunia",
                data = {
                title: title,
                overrides: [
                    {
                        index: 1,
                        width: 1275
                    },
                    {
                        index: 2,
                        width: 1225
                    },
                    {
                        index: 3,
                        width: 1550
                    },
                    {
                        index: 4,
                        width: 1655
                    },
                    {
                        index: 5,
                        width: 850
                    },
                    {
                        index: 6,
                        width: 1565
                    }
                ],
                guilt: 0.5,
                length: 31,
                detail: "More than an hour",
                date: "November 18, 2015",
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
    return petunia;
});