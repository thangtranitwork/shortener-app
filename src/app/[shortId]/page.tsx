import { redirect } from "next/navigation";
import connectDB from "@/lib/mongo";
import Url from "@/models/Url";
import PasswordProtected from "@/components/PasswordProtected";

export default async function RedirectPage({
  params,
}: {
  params: { shortId: string };
}) {
  await connectDB();
  const url = await Url.findOne({ shortId: params.shortId });

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
    return <PasswordProtected shortId={params.shortId} />;
  }

  redirect(url.originalUrl);
}