import { GoogleAnalytics as NextGoogleAnalytics } from "@next/third-parties/google";

export const googleAnalyticsMeasurementIdEnvName = "NEXT_PUBLIC_GA_MEASUREMENT_ID";

export function getGoogleAnalyticsMeasurementId(): string {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  if (!measurementId) {
    throw new Error(
      `${googleAnalyticsMeasurementIdEnvName} is required for Google Analytics. Received value: ${String(measurementId)}`
    );
  }

  if (!/^G-[A-Z0-9]+$/.test(measurementId)) {
    throw new Error(
      `${googleAnalyticsMeasurementIdEnvName} must be a GA4 measurement ID like G-XXXXXXXXXX. Received value: ${measurementId}`
    );
  }

  return measurementId;
}

export function GoogleAnalytics() {
  const measurementId = getGoogleAnalyticsMeasurementId();

  return <NextGoogleAnalytics gaId={measurementId} />;
}
