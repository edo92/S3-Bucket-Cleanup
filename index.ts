import Aws from "aws-sdk";

interface ICreds {
  accessKeyId: string;
  secretAccessKey: string;
}

class BucketActions {
  private readonly aws: AWS.S3;

  constructor(creds: ICreds) {
    this.aws = new Aws.S3(creds);
  }

  public async deleteBucket(bucket: any) {
    await this.aws.deleteBucket({ Bucket: bucket.Name }).promise();
  }

  public async deleteObject(bucket: any, content: any) {
    const params = {
      Bucket: bucket.Name,
      Key: content.Key,
    };
    await this.aws.deleteObject(params).promise();
  }

  public async emptyBucket(bucket: any) {
    const res = await this.aws.listObjects({ Bucket: bucket.Name }).promise();

    res.Contents?.map(async (content) => {
      await this.deleteObject(bucket, content);
    });
  }

  public async purgeBuckets() {
    const { Buckets } = await this.aws.listBuckets().promise();

    Buckets?.forEach(async (bucket) => {
      await this.emptyBucket(bucket);
      await this.deleteBucket(bucket);
    });
  }
}

const bucket = new BucketActions({
  accessKeyId: "",
  secretAccessKey: "",
});

bucket.purgeBuckets();
