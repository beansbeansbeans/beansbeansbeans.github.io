define(['templates/log_detail', 'log/log_renderer', 'log_data'], function(logTemplate, logRenderer, logData) {
    var tubes = {
        selfLoading: true,
        initialize: function() {
            var title = "tubes",
                data = {
                title: title,
                overrides: [
                    {
                        index: 0,
                        width: 1250
                    },
                    {
                        index: 3,
                        width: 1300
                    }
                ],
                length: 40,
                detail: "Tubing in the Shenandoah",
                date: "June 13, 2015",
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
    return tubes;
});