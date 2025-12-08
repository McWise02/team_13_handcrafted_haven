// app/api/uploadthing/core.ts
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    mediaUploader: f({ 
        image: { maxFileSize: "4MB", acl: "public-read"}, 
        video: { maxFileSize: "32MB", acl: "public-read" } 
    })
        .onUploadComplete(async ({ file }) => {
            // This code RUNS ON YOUR SERVER after upload
            //console.log("Upload complete for userId:", metadata?.userId);
            console.log("File URL:", file.url);
        }),


    /*// Define as many FileRoutes as you want, each with a unique routeSlug
    imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 5 } })
        .onUploadComplete(async ({ metadata, file }) => {
            // This code RUNS ON YOUR SERVER after upload
            console.log("Upload complete for userId:", metadata?.userId);
            console.log("File URL:", file.url);
        }),*/
} satisfies FileRouter;

// export type definition of API
export type OurFileRouter = typeof ourFileRouter;

