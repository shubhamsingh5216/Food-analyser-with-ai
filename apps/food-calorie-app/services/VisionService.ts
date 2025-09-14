import axios from "axios";
import { VisionResponse } from "../types";
import { CONFIG } from "@/constants/Index";

export class VisionService {
  static async analyzeImage(base64: string): Promise<VisionResponse | null> {
    try {
      const url = `https://vision.googleapis.com/v1/images:annotate?key=${CONFIG.VISION_API.KEY}`;
      const response = await axios.post(url, {
        requests: [
          {
            image: { content: base64 },
            features: [
              { type: "LABEL_DETECTION", maxResults: 15 },
              { type: "OBJECT_LOCALIZATION", maxResults: 5 },
            ],
          },
        ],
      });

      return response.data.responses[0];
    } catch (error) {
      console.error("Error analyzing image:", error);
      return null;
    }
  }
}
