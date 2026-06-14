import { render } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("next/script", () => ({
  default: ({
    children,
    id,
    src,
    strategy
  }: {
    children?: React.ReactNode;
    id?: string;
    src?: string;
    strategy?: string;
  }) => (
    <div data-script-id={id} data-src={src} data-strategy={strategy}>
      {children}
    </div>
  )
}));

import {
  GoogleAnalytics,
  getGoogleAnalyticsMeasurementId,
  googleAnalyticsMeasurementIdEnvName
} from "./google-analytics";

const testMeasurementId = "G-TEST123456";
const googleAnalyticsSource = readFileSync(
  join(process.cwd(), "src/components/analytics/google-analytics.tsx"),
  "utf8"
);

describe("GoogleAnalytics", () => {
  afterEach(() => {
    delete process.env[googleAnalyticsMeasurementIdEnvName];
  });

  it("loads the GA4 library for the configured measurement id", () => {
    process.env[googleAnalyticsMeasurementIdEnvName] = testMeasurementId;

    const { container } = render(<GoogleAnalytics />);

    const ga4LibraryScript = container.querySelector(
      `[data-src="https://www.googletagmanager.com/gtag/js?id=${testMeasurementId}"]`
    );

    expect(ga4LibraryScript).toBeInTheDocument();
    expect(ga4LibraryScript).toHaveAttribute("data-strategy", "lazyOnload");
  });

  it("configures gtag with the configured measurement id", () => {
    process.env[googleAnalyticsMeasurementIdEnvName] = testMeasurementId;

    const { container } = render(<GoogleAnalytics />);

    const inlineScript = container.querySelector('[data-script-id="google-analytics"]');

    expect(inlineScript?.textContent).toContain(`gtag("config", "${testMeasurementId}")`);
    expect(inlineScript).toHaveAttribute("data-strategy", "lazyOnload");
  });

  it("fails fast when the measurement id environment variable is missing", () => {
    expect(() => getGoogleAnalyticsMeasurementId()).toThrow(
      `${googleAnalyticsMeasurementIdEnvName} is required for Google Analytics. Received value: undefined`
    );
  });

  it("fails fast when the measurement id does not look like a GA4 id", () => {
    process.env[googleAnalyticsMeasurementIdEnvName] = "UA-123";

    expect(() => getGoogleAnalyticsMeasurementId()).toThrow(
      `${googleAnalyticsMeasurementIdEnvName} must be a GA4 measurement ID like G-XXXXXXXXXX. Received value: UA-123`
    );
  });

  it("uses static public env access so Next.js can inline the measurement id", () => {
    expect(googleAnalyticsSource).toContain("process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID");
    expect(googleAnalyticsSource).not.toContain(
      "process.env[googleAnalyticsMeasurementIdEnvName]"
    );
  });
});
