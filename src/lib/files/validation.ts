import { CleanDataType, DataType } from "@/types"

import { JSZipObject, parseZipFiles } from "@/lib/zipService"

/**
 * Filters data entries based on a specific period.
 * @param data Array of DataType.
 * @param months Number of months to filter by.
 * @returns Filtered array of DataType.
 */
function filterDataByPeriod(data: DataType[], months: number): DataType[] {
  const cutoffDate = new Date()
  cutoffDate.setMonth(cutoffDate.getMonth() - months)
  return data.filter((entry) => new Date(entry.ts) >= cutoffDate)
}

/**
 * Cleans data by aggregating it based on Spotify track URI.
 * @param data Array of DataType.
 * @returns Array of CleanDataType.
 */
function cleanData(data: DataType[]): CleanDataType[] {
  const cleanedData: Record<string, CleanDataType> = {}

  data.forEach((entry) => {
    if (entry.ms_played < 3000 || !entry.spotify_track_uri) {
      return
    }

    const uri = entry.spotify_track_uri
    const current = cleanedData[uri]
    if (current) {
      current.total_played++
      current.ms_played += entry.ms_played
    } else {
      cleanedData[uri] = {
        total_played: 1,
        ms_played: entry.ms_played,
        track_name: entry.master_metadata_track_name,
        artist_name: entry.master_metadata_album_artist_name,
        album_name: entry.master_metadata_album_album_name,
        spotify_track_uri: uri,
      }
    }
  })

  return Object.values(cleanedData)
}

/**
 * Merges and sorts streaming data from an array of DataType.
 * @param files Array of JSZip.JSZipObject from ZIP extraction.
 * @returns Object with filtered and cleaned data.
 */
export async function mergeStreamingDataAndSort(files: JSZipObject[]): Promise<{
  last6MonthsData: CleanDataType[]
  lastYearData: CleanDataType[]
  allTimeData: CleanDataType[]
  lastTrack: DataType
}> {
  const allData = await parseZipFiles(files)
  const lastYearData = filterDataByPeriod(allData, 12)
  const last6MonthsData = filterDataByPeriod(lastYearData, 6)

  return {
    last6MonthsData: cleanData(last6MonthsData),
    lastYearData: cleanData(lastYearData),
    allTimeData: cleanData(allData),
    lastTrack: last6MonthsData[0],
  }
}
