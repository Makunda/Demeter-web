import axios from "axios";
import { use } from "vue/types/umd";
import { ApiComUtils } from "../ApiComUtils";

export class ExportController {
  private static API_BASE_URL = ApiComUtils.getUrl();

  /**
   * Get the url to generate the Paris export
   */
  public static getDownloadUrl(): string {
    return ExportController.API_BASE_URL + "/api/paris/export/all";
  }
}
