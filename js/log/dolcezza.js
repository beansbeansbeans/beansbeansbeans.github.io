define(['templates/log_detail', 'log/log_renderer', 'log_data'], function(logTemplate, logRenderer, logData) {
    var dolcezza = {
        selfLoading: true,
        initialize: function() {
            var title = "dolcezza",
                data = {
                title: title,
                overrides: [
                    {
                        index: 0,
                        width: 1650
                    },
                    {
                        index: 2,
                        width: 1250
                    },
                    {
                        index: 3,
                        width: 1345
                    },
                    {
                        index: 4,
                        width: 1300
                    },
                    {
                        index: 5,
                        width: 1550
                    },
                    {
                        index: 6,
                        width: 1550
                    }
                ],
                length: 33,
                detail: "coffee and an argument",
                date: "June 22, 2015",
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
    return dolcezza;
});