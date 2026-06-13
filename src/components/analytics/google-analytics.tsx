import Script from "next/script";

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

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag("js", new Date());
          gtag("config", "${measurementId}");
        `}
      </Script>
    </>
  );
}
