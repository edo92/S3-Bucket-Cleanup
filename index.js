const AWS = require("aws-sdk");

const data = new AWS.S3({
  accessKeyId: "XXX",
  secretAccessKey: "XXX",
});

const emptyBucket = () => {
  data.listBuckets((err, res) => {
    res.Buckets.map((bucket) => {
      data
        .listObjectsV2({
          Bucket: bucket.Name,
        })
        .promise()
        .then(async ({ Contents }) => {
          data.deleteObjects(
            {
              Bucket: bucket.Name,
              Delete: {
                Objects: Contents.map((item) => ({ Key: item.Key })),
              },
            },
            (err, res) => {
              if (err) throw new Error(err);
              console.log("res", res);
            }
          );
        });
    });
  });
};

const deleteBuckets = () => {
  data.listBuckets((err, res) => {
    if (err) throw err;

    res.Buckets.map((bucket) => {
      data
        .deleteBucket({ Bucket: bucket.Name })
        .promise()
        .then((resp) => {
          console.log("---", resp);
        })
        .catch((err) => {
          throw err;
        });
    });
  });
};

emptyBucket();
deleteBuckets();
