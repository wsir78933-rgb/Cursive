import { render } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const nextGoogleAnalyticsMocks = vi.hoisted(() => ({
  GoogleAnalytics: vi.fn()
}));

vi.mock("@next/third-parties/google", () => ({
  GoogleAnalytics: nextGoogleAnalyticsMocks.GoogleAnalytics
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
  beforeEach(() => {
    nextGoogleAnalyticsMocks.GoogleAnalytics.mockReset();
    nextGoogleAnalyticsMocks.GoogleAnalytics.mockImplementation(({ gaId }: { gaId: string }) => (
      <div data-ga-id={gaId} data-testid="next-google-analytics" />
    ));
  });

  afterEach(() => {
    delete process.env[googleAnalyticsMeasurementIdEnvName];
  });

  it("initializes GA4 through the official Next.js third-parties component", () => {
    process.env[googleAnalyticsMeasurementIdEnvName] = testMeasurementId;

    render(<GoogleAnalytics />);

    expect(nextGoogleAnalyticsMocks.GoogleAnalytics).toHaveBeenCalledWith(
      { gaId: testMeasurementId },
      undefined
    );
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
