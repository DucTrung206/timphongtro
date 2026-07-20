"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Clock, FileText } from "lucide-react";

interface Section {
  title: string;
  content: string | string[];
}

interface PolicyPageProps {
  title: string;
  lastUpdated: string;
  description: string;
  sections: Section[];
}

export default function PolicyPageLayout({
  title,
  lastUpdated,
  description,
  sections,
}: PolicyPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200/60">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link
            href="/"
            className="group flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-all duration-300"
          >
            <div className="w-9 h-9 rounded-xl bg-gray-100 group-hover:bg-blue-50 flex items-center justify-center transition-colors duration-300">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-300" />
            </div>
            <span className="text-sm font-medium hidden sm:inline">Trang chủ</span>
          </Link>
          <div className="h-5 w-px bg-gray-200" />
          <span className="text-sm font-semibold text-gray-800 truncate">{title}</span>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 pt-12 pb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-200/50">
              <Clock className="w-3 h-3" />
              Cập nhật: {lastUpdated}
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
            {title}
          </h1>
          <p className="text-gray-500 text-base sm:text-lg max-w-2xl leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 pb-16">
        <div className="space-y-6">
          {sections.map((section, index) => (
            <article
              key={index}
              className="group bg-white rounded-2xl border border-gray-200/60 hover:border-blue-200/80 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  {/* Section Number */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100/60 flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors duration-300">
                      {section.title}
                    </h2>
                    {Array.isArray(section.content) ? (
                      <div className="space-y-2">
                        {section.content.map((paragraph, pIdx) => (
                          <p key={pIdx} className="text-gray-600 leading-relaxed text-[15px]">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600 leading-relaxed text-[15px]">
                        {section.content}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom accent line */}
              <div className="h-0.5 bg-gradient-to-r from-transparent via-blue-200/0 to-transparent group-hover:via-blue-300/60 transition-all duration-500" />
            </article>
          ))}
        </div>

        {/* Back to home */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
