import { redirect } from "next/navigation";
import connectDB from "@/lib/mongo";
import Url from "@/models/Url";

export default async function RedirectPage({
  params,
}: {
  params: Promise<{ shortId: string }>; // `params` là Promise
}) {
  const unwrappedParams = await params; // Unwrap `params`
  const { shortId } = unwrappedParams;

  await connectDB();
  const url = await Url.findOne({ shortId });

  if (!url) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">404 - URL not found</h1>
          <p>The requested URL does not exist.</p>
        </div>
      </div>
    );
  }

  if (url.password) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Password Protected</h1>
          <p>This URL requires a password to access.</p>
        </div>
      </div>
    );
  }

  redirect(url.originalUrl);
}
