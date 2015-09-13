define(['templates/log_detail', 'log/log_renderer', 'log_data'], function(logTemplate, logRenderer, logData) {
    var gefilte = {
        selfLoading: true,
        initialize: function() {
            var title = "gefilte",
                data = {
                title: title,
                overrides: [
                    {
                        index: 1,
                        width: 1180
                    },
                    {
                        index: 3,
                        width: 750
                    },
                    {
                        index: 4,
                        width: 1050
                    },
                    {
                        index: 5,
                        width: 1210
                    }
                ],
                guilt: 0.2,
                length: 41,
                detail: "More than an hour",
                date: "September 14, 2015",
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
    return gefilte;
});