var AWS = require("aws-sdk");
AWS.config.region = process.env.AWS_REGION;
const ec2 = new AWS.EC2();
const cloudwatch = new AWS.CloudWatch();

var main = function(event, context, callback) {
  //console.log('Received event:', JSON.stringify(event, null, 2));
  var count = 0;

  var params = {
    IncludeAllInstances: false,
    MaxResults: 1000
  };
  ec2.describeInstanceStatus(params).promise()
      .then(function(data) {
        try {
          for (var i = 0; i < data.InstanceStatuses.length; i++) {
            //console.log(JSON.stringify(data.InstanceStatuses[i], null, 2));
            if (data.InstanceStatuses[i].Events !== null && data.InstanceStatuses[i].Events.length > 0) {
              for (var j = 0; j < data.InstanceStatuses[i].Events.length; j++) {
                if (!data.InstanceStatuses[i].Events[j].Description.startsWith("[Completed]")) {
                  count++;
                }
              }
            }
          }

          putMetric(count)
              .then(function() {
                console.log("Metric: [" + count + "]");
              }, function(e) {console.log(e.stack); callback(e, null);});
        }
        catch (err) {
          console.log(err);
        }
      }, function(e) {console.log(e.stack); callback(e, null);});

  callback(null, "Done");
};
exports.handle = main;

function putMetric(count) {
  var params = {
    MetricData: [{
      MetricName: 'instance-scheduled-events',
      Value: count,
      Unit: 'Count'
    }],
    Namespace: 'EC2 Custom'
  };

  return cloudwatch.putMetricData(params).promise();
}