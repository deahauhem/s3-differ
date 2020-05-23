import type { Request, Response } from "express";
import { S3 } from "aws-sdk";
const s3 = new S3({ region: "ap-southeast-2"});


export default async (request: Request, response: Response ) => {
    try { 
        const bucketParams = {
            Bucket: request.params.bucket,
            Prefix: request.params.prefix
        }    

        let s3Response: S3.ListObjectsV2Output;

        let continuationToken = undefined;
        let objectList: string[] = [];
        do {
            s3Response = await s3.listObjectsV2({
                ...bucketParams,
                ContinuationToken: continuationToken
            }).promise();
            continuationToken = s3Response?.NextContinuationToken
            const keys = s3Response?.Contents?.map(entry => entry.Key)
                .filter(key => key != null) as string[] | undefined;
            if (keys == undefined) { throw new Error("couldn't retrieve keys"); }
            objectList = [...objectList, ...keys];
            console.log(keys);
        } while (s3Response.IsTruncated);
        
        response.send(objectList);
    } catch (err) {
        response.send("An error occurred" + err);
    }
}