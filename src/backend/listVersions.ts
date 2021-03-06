import type { Request, Response } from "express";
import { S3 } from "aws-sdk";
const s3 = new S3({ region: "ap-southeast-2"});



export default async (request: Request, response: Response ) => {
    const versionParams = {
        Bucket: request.params.bucket
    }

    console.log(request.params.id);
    let s3Response: S3.ListObjectVersionsOutput;
    let versionList: unknown[] = [];
    try {

        do {
            s3Response = await s3.listObjectVersions({
                ...versionParams,
                Prefix: request.params.id
            }).promise();
            const versions = s3Response?.Versions?.map(entry => ({ VersionId: entry.VersionId, LastModified: entry.LastModified }))
            if (versions == undefined) { throw new Error("couldn't retrieve keys"); }
            versionList = [...versionList, ...versions];
        } while (s3Response.IsTruncated);
        
        response.send(versionList);
    } catch (error) {
        response.statusCode = 500
        response.send("Error fetching versions" + error?.message)
    }
}