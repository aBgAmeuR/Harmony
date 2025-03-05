import { filesProcessing, getFiles } from "./file-processing";

/**
 * Downloads and processes a ZIP file from a remote URL
 * @param fileUrl The URL of the file to download and process
 * @param setProgress A callback function to update progress
 * @returns Processing result message
 */
export async function processUploadedZipFile(
  fileUrl: string,
  setProgress: (progress: number) => void
) {
  try {
    // Download the file from the URL
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.statusText}`);
    }

    // Convert the response to a Blob and then create a File object
    const blobData = await response.blob();
    const file = new File(
      [blobData], 
      `spotify-package-${Date.now()}.zip`, 
      { type: "application/zip" }
    );
    
    // Extract and get files from the ZIP
    const filesResult = await getFiles(file);

    // Handle extraction errors
    if (!Array.isArray(filesResult)) {
      return filesResult; // Return the error message
    }
    
    // Process the extracted files
    return await filesProcessing(file, filesResult, setProgress);
  } catch (error) {
    console.error("Error processing uploaded file:", error);
    return { 
      message: "error", 
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}