import React, { Suspense } from 'react';
import CrashCourse from './components/CrashCourse';
import ErrorBoundary from './components/ErrorBoundary';


export default function CrashCoursePageUI() {
  return (
    <div className="bg-gray-100">


      {/* Main Content */}
      <main className="p-8">
        <Suspense fallback={
          <div className="p-8 text-center">
            <div className="text-xl font-medium">Loading crash course...</div>
          </div>
        }>
          <ErrorBoundary>
             <CrashCourse />
          </ErrorBoundary>
        </Suspense>
      </main>
    </div>
  );
}
