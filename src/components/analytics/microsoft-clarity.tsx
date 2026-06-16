import Script from "next/script";

export const microsoftClarityProjectIdEnvName = "NEXT_PUBLIC_CLARITY_PROJECT_ID";

export function getMicrosoftClarityProjectId(): string {
  const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

  if (!projectId) {
    throw new Error(
      `${microsoftClarityProjectIdEnvName} is required for Microsoft Clarity. Received value: ${String(projectId)}`
    );
  }

  if (!/^[a-z0-9]+$/.test(projectId)) {
    throw new Error(
      `${microsoftClarityProjectIdEnvName} must contain only lowercase letters and numbers. Received value: ${projectId}`
    );
  }

  return projectId;
}

export function MicrosoftClarity() {
  const projectId = getMicrosoftClarityProjectId();

  return (
    <Script id="microsoft-clarity" strategy="afterInteractive">
      {`
(function(c,l,a,r,i,t,y){
  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "${projectId}");
      `}
    </Script>
  );
}
