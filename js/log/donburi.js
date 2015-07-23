define(['templates/log_detail', 'log/log_renderer', 'log_data'], function(logTemplate, logRenderer, logData) {
    var donburi = {
        selfLoading: true,
        initialize: function() {
            var title = "donburi",
                data = {
                title: title,
                overrides: [
                    {
                        index: 4,
                        width: 1550
                    },
                    {
                        index: 5,
                        width: 1590
                    }
                ],
                length: 78,
                detail: "An exciting day",
                date: "October 15, 2014",
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
    return donburi;
});