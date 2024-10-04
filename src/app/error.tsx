"use client";

import NextError from "next/error";

function ErrorPage({ error }: { error: Error }) {
  return (
    <div>
      <NextError
        statusCode={404}
        title={error.message + " - " + error.cause + " - " + error.name}
      />
    </div>
  );
}

export default ErrorPage;
