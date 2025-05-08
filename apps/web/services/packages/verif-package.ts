import { getFiles } from "../file-processing";

export async function verifPackage(files: File[]) {
  try {
    const filesResult = await getFiles(files[0]);

    return Array.isArray(filesResult) && filesResult.length > 0;
  } catch (error) {
    return false;
  }
}
