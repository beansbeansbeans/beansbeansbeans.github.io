define(['templates/log_detail', 'log/log_renderer', 'log_data'], function(logTemplate, logRenderer, logData) {
    var chess = {
        selfLoading: true,
        initialize: function() {
            var title = "chess",
                data = {
                title: title,
                overrides: [
                    {
                        index: 2,
                        width: 1300
                    },
                    {
                        index: 3,
                        width: 1300
                    }
                ],
                length: 91,
                detail: "An unproductive day",
                date: "April 15, 2015",
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
    return chess;
});