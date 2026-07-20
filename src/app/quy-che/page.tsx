"use client";

import PolicyPageLayout from "@/components/PolicyPageLayout";
import { pageContent } from "./page-content";

export default function QuyChePage() {
  return (
    <PolicyPageLayout
      title={pageContent.title}
      lastUpdated={pageContent.lastUpdated}
      description={pageContent.description}
      sections={pageContent.sections}
    />
  );
}
