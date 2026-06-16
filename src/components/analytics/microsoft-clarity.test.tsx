import { render, screen } from "@testing-library/react";
import React from "react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const nextScriptMocks = vi.hoisted(() => ({
  Script: vi.fn()
}));

vi.mock("next/script", () => ({
  default: nextScriptMocks.Script
}));

import {
  MicrosoftClarity,
  getMicrosoftClarityProjectId,
  microsoftClarityProjectIdEnvName
} from "./microsoft-clarity";

const testProjectId = "x6s5bucoec";
const microsoftClaritySource = readFileSync(
  join(process.cwd(), "src/components/analytics/microsoft-clarity.tsx"),
  "utf8"
);

describe("MicrosoftClarity", () => {
  beforeEach(() => {
    nextScriptMocks.Script.mockReset();
    nextScriptMocks.Script.mockImplementation(
      ({
        children,
        id,
        strategy
      }: {
        children: React.ReactNode;
        id: string;
        strategy: string;
      }) => (
        <script data-testid="next-script" data-script-id={id} data-strategy={strategy}>
          {children}
        </script>
      )
    );
  });

  afterEach(() => {
    delete process.env[microsoftClarityProjectIdEnvName];
  });

  it("initializes Microsoft Clarity with the configured project id", () => {
    process.env[microsoftClarityProjectIdEnvName] = testProjectId;

    render(<MicrosoftClarity />);

    const scriptElement = screen.getByTestId("next-script");
    expect(scriptElement).toHaveAttribute("data-script-id", "microsoft-clarity");
    expect(scriptElement).toHaveAttribute("data-strategy", "afterInteractive");
    expect(scriptElement.textContent).toContain("https://www.clarity.ms/tag/");
    expect(scriptElement.textContent).toContain(`"${testProjectId}"`);
  });

  it("fails fast when the project id environment variable is missing", () => {
    expect(() => getMicrosoftClarityProjectId()).toThrow(
      `${microsoftClarityProjectIdEnvName} is required for Microsoft Clarity. Received value: undefined`
    );
  });

  it("fails fast when the project id contains unsupported characters", () => {
    process.env[microsoftClarityProjectIdEnvName] = "bad id";

    expect(() => getMicrosoftClarityProjectId()).toThrow(
      `${microsoftClarityProjectIdEnvName} must contain only lowercase letters and numbers. Received value: bad id`
    );
  });

  it("uses static public env access so Next.js can inline the project id", () => {
    expect(microsoftClaritySource).toContain("process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID");
    expect(microsoftClaritySource).not.toContain(
      "process.env[microsoftClarityProjectIdEnvName]"
    );
  });
});
